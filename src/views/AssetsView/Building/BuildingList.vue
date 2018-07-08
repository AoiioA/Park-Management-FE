<template>
  <div class="fill-height building">
    <view-tool-bar>
      <span slot="bar-menu">
        <v-dialog v-model="newBuildingDialog" max-width="500px" persistent>
          <v-btn flat slot="activator" @click="getPark();getProvince();">添加楼宇</v-btn>
          <v-form ref="newBuildingForm" v-model="newBuildingValid" lazy-validation>
            <v-card>
              <v-card-title primary-title>
                <span class="headline">新楼宇即将添加</span>
              </v-card-title>
              <v-card-text class="pt-0">
                <v-container grid-list-md class="pa-0">
                  <v-layout wrap>
                    <v-flex xs4><v-autocomplete dense v-model="editedBuilding.parkNo" :items="select.parkInfoArr" item-text="parkName" item-value="parkNo" label="所属园区" :hint="editedBuilding.parkNo!==0?`楼宇将继承省市区县信息`:''" persistent-hint required></v-autocomplete></v-flex>
                    <v-flex xs4><v-text-field v-model="editedBuilding.buildingName" :rules="[$store.state.rules.required]" label="楼宇名称" :hint="editedBuilding.buildingName?`全称为 : ${fullBuildingName}`:''" persistent-hint required></v-text-field></v-flex>
                    <v-flex xs4><v-text-field v-model="editedBuilding.constructionArea" :rules="[$store.state.rules.noZero, $store.state.rules.nonnegative]" label="建筑面积(m²)" type="number" required></v-text-field></v-flex>
                    <v-flex xs4><v-autocomplete dense v-if="editedBuilding.parkNo==0" @change="getCity" v-model="editedBuilding.province" :items="select.provinceInfoArr" item-text="provinceName" item-value="provinceName" :rules="[$store.state.rules.required]" label="省" required></v-autocomplete></v-flex>
                    <v-flex xs4><v-autocomplete dense v-if="editedBuilding.parkNo==0" :disabled="!editedBuilding.province" @change="getDistrict" v-model="editedBuilding.city" :items="select.cityInfoArr" item-text="cityName" item-value="cityName" :rules="[$store.state.rules.required]" label="市" required></v-autocomplete></v-flex>
                    <v-flex xs4><v-autocomplete dense v-if="editedBuilding.parkNo==0" :disabled="!editedBuilding.city" v-model="editedBuilding.district" :items="select.districtInfoArr" item-text="countyName" item-value="countyName" :rules="[$store.state.rules.required]" label="区县" required></v-autocomplete></v-flex>
                    <v-flex xs12><v-text-field v-model="editedBuilding.address" :rules="[$store.state.rules.required]" label="详细地址" required></v-text-field></v-flex>
                  </v-layout>
                  <!-- <small class="red--text text--accent-2">*&nbsp;标记为必填项</small> -->
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn depressed @click="newBuildingClose(true)">取消操作</v-btn>
                <v-btn :disabled="!newBuildingValid" @click="newBuildingSave" depressed color="primary">确认添加</v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-dialog>
        <v-btn icon>
          <v-icon>help</v-icon>
        </v-btn>
      </span>
    </view-tool-bar>
    <v-progress-linear v-if="networkLoading" :size="48" indeterminate class="my-0"></v-progress-linear>
    <v-alert v-else-if="networkError" :value="true" type="error">网络出现异常 - 检查网络后刷新重试</v-alert>
    <div v-else-if="buildingList.length==0" class="no-data">暂无楼宇记录 - <a @click="newBuildingDialog=true;getPark();getProvince();">点击此处添加</a></div>
    <v-container v-else grid-list-xl>
      <v-layout justify-center wrap>
        <v-flex xs12 lg10>
          <v-subheader>您的全部楼宇项目</v-subheader>
          <v-layout wrap>
            <v-flex v-for="buildingItem in buildingList" :key="buildingItem.buildingNo" xs12 sm4 md3 xl2>
              <v-card height="200px" :to="{ name: 'building-detail', params: { buildingNo: buildingItem.buildingNo, buildingDetailType: 'area' }}" ripple>
                <v-container fill-height fluid class="pt-2 pb-1">
                  <v-layout column>
                    <v-flex class="title"><span>{{ buildingItem.buildingName }}</span></v-flex>
                    <v-flex xs12></v-flex>
                    <v-flex class="body-1 grey--text">
                      <div class="mb-1">
                        <v-icon small>location_on</v-icon>&nbsp;
                        {{ `${buildingItem.city} ${buildingItem.district}` }}
                      </div>
                      <div>
                        <v-icon small>access_time</v-icon>&nbsp;
                        编辑于 {{ buildingItem.createDate.slice(0, 10) }}
                      </div>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import ViewToolBar from "@/components/ViewToolBar.vue";

export default {
  components: {
    ViewToolBar
  },
  data: () => ({
    networkLoading: false,
    networkError: null,
    newBuildingDialog: false,
    newBuildingValid: true,
    select: {
      parkInfoArr: [{ parkName: "无园区", parkNo: 0 }],
      provinceInfoArr: [],
      cityInfoArr: [],
      districtInfoArr: []
    },
    editedBuilding: {
      buildingName: "",
      parkNo: 0,
      constructionArea: "",
      province: "",
      city: "",
      district: "",
      address: ""
    },
    defaultBuilding: {
      buildingName: "",
      parkNo: 0,
      constructionArea: "",
      province: "",
      city: "",
      district: "",
      address: ""
    },
    buildingList: []
  }),
  computed: {
    fullBuildingName() {
      if (this.editedBuilding.parkNo !== 0) {
        let parkName = this.select.parkInfoArr.find(
          item => item.parkNo == this.editedBuilding.parkNo
        ).parkName;
        return `${parkName} ${this.editedBuilding.buildingName}`;
      }
      return this.editedBuilding.buildingName;
    }
  },
  created() {
    this.$store.commit("changeToolBarTitle", { title: "楼宇概览" });
    this.initialize();
  },
  methods: {
    initialize() {
      this.networkLoading = true;
      this.networkError = null;
      this.$http
        .post("/cms/buildingInfo/listBuildingInfo.json", {})
        .then(res => {
          this.networkLoading = false;

          let resData = res.data.data;
          this.buildingList =
            resData && resData.length
              ? resData.sort((x, y) => x.buildingNo - y.buildingNo)
              : [];
        })
        .catch(err => {
          this.networkLoading = false;
          this.networkError = true;
          this.$store.commit("addSnackBar", `楼宇查询失败 ${err}`, "error");
        });
    },
    getPark() {
      this.select.parkInfoArr = [{ parkName: "无园区", parkNo: 0 }];
      this.$http
        .post("/cms/parkInfo/listParkInfo.json", {})
        .then(res => {
          let resData = res.data.data;
          this.select.parkInfoArr = resData && resData.length ? resData : [];
          this.select.parkInfoArr.unshift({ parkName: "无园区", parkNo: 0 });
        })
        .catch(err =>
          this.$store.commit("addSnackBar", `园区信息查询失败 ${err}`, "error")
        );
    },
    getProvince() {
      this.select.provinceInfoArr = [];
      this.$http
        .get("/cms/administrativeDivision/province.json", {})
        .then(res => {
          let resData = res.data.data;
          this.select.provinceInfoArr =
            resData && resData.length ? resData : [];
        })
        .catch(err =>
          this.$store.commit("addSnackBar", `省级信息查询失败 ${err}`, "error")
        );
    },
    getCity(province) {
      if (province) {
        this.select.cityInfoArr = [];
        this.$http
          .get("/cms/administrativeDivision/city.json", {
            params: {
              province: province
            }
          })
          .then(res => {
            let resData = res.data.data;
            this.editedBuilding.city = "";
            this.editedBuilding.district = "";
            this.select.cityInfoArr = resData && resData.length ? resData : [];
          })
          .catch(err =>
            this.$store.commit(
              "addSnackBar",
              `市级信息查询失败 ${err}`,
              "error"
            )
          );
      }
    },
    getDistrict(city) {
      if (city) {
        this.select.districtInfoArr = [];
        this.$http
          .get("/cms/administrativeDivision/county.json", {
            params: {
              province: this.editedBuilding.province,
              city: city
            }
          })
          .then(res => {
            let resData = res.data.data;
            this.editedBuilding.district = "";
            this.select.districtInfoArr =
              resData && resData.length ? resData : [];
          })
          .catch(err =>
            this.$store.commit(
              "addSnackBar",
              `区县信息查询失败 ${err}`,
              "error"
            )
          );
      }
    },
    newBuildingClose(isCancel) {
      if (!isCancel || confirm("取消后内容将不会保存")) {
        this.$refs.newBuildingForm.reset();
        this.newBuildingDialog = false;
        this.editedBuilding = Object.assign({}, this.defaultBuilding);
      }
    },
    newBuildingSave() {
      if (this.$refs.newBuildingForm.validate()) {
        let park = this.select.parkInfoArr.find(
          item => item.parkNo == this.editedBuilding.parkNo
        );
        this.$http
          .post("/cms/buildingInfo/addBuildingInfo.json", {
            buildingName: this.fullBuildingName,
            parkNo:
              this.editedBuilding.parkNo != 0 ? this.editedBuilding.parkNo : "",
            parkId: this.editedBuilding.parkNo != 0 ? park.parkId : "",
            constructionArea: this.editedBuilding.constructionArea,
            province:
              this.editedBuilding.parkNo === 0
                ? this.editedBuilding.province
                : park.province,
            city:
              this.editedBuilding.parkNo === 0
                ? this.editedBuilding.city
                : park.city,
            district:
              this.editedBuilding.parkNo === 0
                ? this.editedBuilding.district
                : park.district,
            address: this.editedBuilding.address
          })
          .then(res => {
            if (res.data.code != 500) {
              this.newBuildingClose(false);
              this.initialize();
              this.$store.commit("addSnackBar", "楼宇添加成功", "success");
            } else {
              throw new Error(res.data.msg);
            }
          })
          .catch(err =>
            this.$store.commit("addSnackBar", `楼宇添加失败 ${err}`, "error")
          );
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.no-data {
  height: 225px;
  line-height: 225px;
  text-align: center;
}
</style>
