<template>
  <div class="fill-height point-detail">
    <view-tool-bar>
      <span slot="bar-menu">
        <v-btn icon>
          <v-icon>help</v-icon>
        </v-btn>
      </span>
    </view-tool-bar>
    <v-jumbotron height="auto">
      <v-progress-linear v-if="networkLoading" indeterminate class="my-0"></v-progress-linear>
      <v-alert v-else-if="networkError" :value="true" type="error">网络出现异常 - 检查网络后刷新重试</v-alert>
      <v-container v-else grid-list-xl>
        <v-layout justify-center align-center>
          <v-flex xs12 lg10>
            <v-subheader>
              您的全部园区项目
              <v-spacer></v-spacer>
              <v-dialog v-model="menu.newPark" max-width="500px" persistent>
                <!-- <v-btn slot="activator" color="primary" small depressed>添加园区</v-btn> -->
                <v-form ref="newParkForm" v-model="newParkValid" lazy-validation>
                  <v-card>
                    <v-card-title primary-title>
                      <span class="headline">新园区即将添加</span>
                    </v-card-title>
                    <v-card-text class="pt-0">
                      <v-container grid-list-md class="pa-0">
                        <v-layout wrap>
                          <v-flex xs12><v-text-field v-model="editedPark.parkName" :rules="[$store.state.rules.required]" label="园区名称" hint="如 : 望京园区" persistent-hint required></v-text-field></v-flex>
                          <v-flex xs4><v-autocomplete dense @change="getCity" v-model="editedPark.province" :items="select.provinceInfoArr" item-text="provinceName" item-value="provinceName" :rules="[$store.state.rules.required]" label="省" hint="创建后省市区县不可修改" persistent-hint required></v-autocomplete></v-flex>
                          <v-flex xs4><v-autocomplete dense :disabled="!editedPark.province" @change="getDistrict" v-model="editedPark.city" :items="select.cityInfoArr" item-text="cityName" item-value="cityName" :rules="[$store.state.rules.required]" label="市" required></v-autocomplete></v-flex>
                          <v-flex xs4><v-autocomplete dense :disabled="!editedPark.city" v-model="editedPark.district" :items="select.districtInfoArr" item-text="countyName" item-value="countyName" :rules="[$store.state.rules.required]" label="区县" required></v-autocomplete></v-flex>
                          <v-flex xs12><v-text-field v-model="editedPark.address" :rules="[$store.state.rules.required]" label="详细地址" required></v-text-field></v-flex>
                          <v-flex xs6 sm3><v-text-field v-model="editedPark.floorArea" :rules="[$store.state.rules.noZero, $store.state.rules.nonnegative]" label="占地面积(m²)" type="number"></v-text-field></v-flex>
                          <v-flex xs6 sm3><v-text-field v-model="editedPark.constructionArea" :rules="[$store.state.rules.noZero, $store.state.rules.nonnegative]" label="建筑面积(m²)" type="number"></v-text-field></v-flex>
                          <v-flex xs6 sm3><v-text-field v-model="editedPark.greeningRate" :rules="[$store.state.rules.nonnegative, rules.lessThen(100)]" label="绿化率(%)" type="number"></v-text-field></v-flex>
                          <v-flex xs6 sm3><v-text-field v-model="editedPark.volumeRate" :rules="[$store.state.rules.nonnegative, rules.lessThen(100)]" label="容积率(%)" type="number"></v-text-field></v-flex>
                          <v-flex xs12><v-textarea v-model="editedPark.environment" label="环境描述"></v-textarea></v-flex>
                        </v-layout>
                        <!-- <small class="red--text text--accent-2">*&nbsp;标记为必填项</small> -->
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn depressed @click="newParkClose(true)">取消操作</v-btn>
                      <v-btn :disabled="!newParkValid" @click="newParkSave" depressed color="primary">确认添加</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-form>
              </v-dialog>
            </v-subheader>
          </v-flex>
        </v-layout>
        <v-layout justify-center wrap>
          <v-flex xs12 lg10>
            <v-layout wrap>
              <v-flex xs12 sm4 md3 xl2>
                <v-card>
                  <v-btn
                    @click="menu.newPark=true;getProvince();"
                    tag="v-container"
                    flat
                    color="primary"
                    class="px-0 py-0 text-xs-center"
                    style="height: 146px;cursor: pointer;"
                  >
                    <v-layout column justify-center>
                      <span><v-icon size="48">add</v-icon></span>
                      <span>添加园区</span>
                    </v-layout>
                  </v-btn>
                  <v-divider></v-divider>
                  <v-btn
                    @click="1"
                    tag="v-container"
                    flat
                    color="primary"
                    class="px-0"
                    style="height: 53px;cursor: pointer;"
                  >
                    <v-icon>link</v-icon>
                    了解更多
                  </v-btn>
                </v-card>
              </v-flex>
              <v-flex v-if="parkList.length==0" class="no-data">暂无园区记录 - <a @click="menu.newPark=true;getProvince();">点击此处添加</a></v-flex>
              <v-flex v-for="parkItem in parkList" :key="parkItem.parkNo" xs12 sm4 md3 xl2>
                <v-card height="200px" :to="{ name: 'park-detail', params: { parkNo: parkItem.parkNo }}" ripple>
                  <v-container fill-height fluid class="pt-2 pb-1">
                    <v-layout column>
                      <v-flex class="title"><span>{{ parkItem.parkName }}</span></v-flex>
                      <v-flex xs12></v-flex>
                      <v-flex class="body-1 grey--text">
                        <div class="mb-1">
                          <v-icon small>location_on</v-icon>&nbsp;
                          {{ `${parkItem.city} ${parkItem.district}` }}
                        </div>
                        <div>
                          <v-icon small>access_time</v-icon>&nbsp;
                          编辑于 {{ parkItem.createDate.slice(0, 10) }}
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
    </v-jumbotron>
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
    rules: {
      lessThen: num => val => parseFloat(val) <= num || `该项需小于${num}`
    },
    menu: {
      newPark: false
    },
    select: {
      provinceInfoArr: [],
      cityInfoArr: [],
      districtInfoArr: []
    },
    newParkValid: true,
    editedPark: {
      parkName: "",
      province: "",
      city: "",
      district: "",
      address: "",
      floorArea: "",
      constructionArea: "",
      greeningRate: "",
      volumeRate: "",
      environment: ""
    },
    defaultPark: {
      parkName: "",
      province: "",
      city: "",
      district: "",
      address: "",
      floorArea: "",
      constructionArea: "",
      greeningRate: "",
      volumeRate: "",
      environment: ""
    },
    parkList: []
  }),
  created() {
    this.$store.commit("changeToolBarTitle", { title: "园区概览" });
    this.initialize();
  },
  methods: {
    initialize() {
      this.networkLoading = true;
      this.networkError = null;
      this.$http
        .post("/cms/parkInfo/listParkInfo.json", {})
        .then(res => {
          this.networkLoading = false;
          let resData = res.data.data;
          this.parkList = resData && resData.length ? resData : [];
        })
        .catch(err => {
          this.networkLoading = false;
          this.networkError = true;
          this.$store.commit("addSnackBar", `园区查询失败${err}`, "error");
        });
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
            this.editedPark.city = "";
            this.editedPark.district = "";
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
              province: this.editedPark.province,
              city: city
            }
          })
          .then(res => {
            let resData = res.data.data;
            this.editedPark.district = "";
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
    newParkClose(isCancel) {
      if (!isCancel || confirm("取消后内容将不会保存")) {
        this.editedPark = Object.assign({}, this.defaultPark);
        this.$refs.newParkForm.reset();
        this.menu.newPark = false;
      }
    },
    newParkSave() {
      if (this.$refs.newParkForm.validate()) {
        this.$http
          .post("/cms/parkInfo/addParkInfo.json", this.editedPark)
          .then(res => {
            if (res.data.code != 500) {
              this.newParkClose(false);
              this.$store.commit("addSnackBar", "添加园区成功", "success");
              this.initialize();
            } else {
              throw new Error(res.data.msg);
            }
          })
          .catch(err => {
            this.$store.commit("addSnackBar", `园区添加失败 ${err}`, "error");
          });
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
