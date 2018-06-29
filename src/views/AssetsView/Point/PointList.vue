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
              您的全部商圈项目
              <v-spacer></v-spacer>
              <v-dialog v-model="menu.newPoint" max-width="500px" persistent>
                <!-- <v-btn slot="activator" color="primary" small depressed>添加商圈</v-btn> -->
                <v-form ref="newPointForm" v-model="newPointValid" lazy-validation>
                  <v-card>
                    <v-card-title>
                      <span class="headline">新商圈即将添加</span>
                    </v-card-title>
                    <v-card-text>
                      <v-container grid-list-xs>
                        <v-layout wrap>
                          <v-flex xs12><v-text-field v-model="editedPoint.pointName" :rules="[$store.state.rules.required]" label="商圈名称" hint="如 : 望京商圈" persistent-hint required></v-text-field></v-flex>
                          <v-flex xs4><v-select @change="getCity" v-model="editedPoint.province" :items="select.provinceInfoArr" item-text="provinceName" item-value="provinceName" :rules="[$store.state.rules.required]" label="省" hint="创建后省市区县不可修改" persistent-hint autocomplete required></v-select></v-flex>
                          <v-flex xs4><v-select :disabled="!editedPoint.province" @change="getDistrict" v-model="editedPoint.city" :items="select.cityInfoArr" item-text="cityName" item-value="cityName" :rules="[$store.state.rules.required]" label="市" autocomplete required></v-select></v-flex>
                          <v-flex xs4><v-select :disabled="!editedPoint.city" v-model="editedPoint.district" :items="select.districtInfoArr" item-text="countyName" item-value="countyName" :rules="[$store.state.rules.required]" label="区县" autocomplete required></v-select></v-flex>
                          <v-flex xs12><v-select :disabled="!select.parkArr.length" v-model="editedPoint.parkNos" :items="select.parkArr" item-text="parkName" item-value="parkNo" label="所含园区" no-data-text="暂无可添加的园区" hint="园区及楼宇可稍后重新选择或修改" persistent-hint multiple autocomplete></v-select></v-flex>
                          <v-flex xs12><v-select :disabled="!select.buildingArr.length" v-model="editedPoint.buildingNos" :items="select.buildingArr" item-text="buildingName" item-value="buildingNo" label="所含楼宇" no-data-text="暂无可添加的楼宇" hint="仅可选择未划分园区的楼宇" persistent-hint multiple autocomplete></v-select></v-flex>
                        </v-layout>
                      </v-container>
                      <small class="px-1 red--text text--accent-2">*&nbsp;标记为必填项</small>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn depressed @click="newPointClose(true)">取消操作</v-btn>
                      <v-btn :disabled="!newPointValid" @click="newPointSave" depressed color="primary">确认添加</v-btn>
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
                    @click="menu.newPoint=true;getProvince();"
                    tag="v-container"
                    flat
                    color="primary"
                    class="px-0 py-0 text-xs-center"
                    style="height: 146px;cursor: pointer;"
                  >
                    <v-layout column justify-center>
                      <span><v-icon size="48">add</v-icon></span>
                      <span>添加商圈</span>
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
              <v-flex v-if="pointList.length==0" class="no-data">暂无商圈记录 - <a @click="menu.newPoint=true;getProvince();">点击此处添加</a></v-flex>
              <v-flex v-for="pointItem in pointList" :key="pointItem.pointNo" xs12 sm4 md3 xl2>
                <v-card height="200px" :to="{ name: 'point-detail', params: { pointNo: pointItem.pointNo } }" ripple>
                  <v-container fill-height fluid class="pt-2 pb-1">
                    <v-layout column>
                      <v-flex class="title"><span>{{ pointItem.pointName }}</span></v-flex>
                      <v-flex xs12></v-flex>
                      <v-flex class="body-1 grey--text">
                        <div class="mb-1">
                          <v-icon small>business</v-icon>&nbsp;
                          {{ `${pointItem.parkNos.split(',').length} 块园区 ${pointItem.buildingNos.split(',').length} 栋楼宇` }}
                        </div>
                        <div class="mb-1">
                          <v-icon small>location_on</v-icon>&nbsp;
                          {{ `${pointItem.city} ${pointItem.district}` }}
                        </div>
                        <div>
                          <v-icon small>access_time</v-icon>&nbsp;
                          创建于 {{ pointItem.createDate.slice(0, 10) }}
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
    menu: {
      newPoint: false
    },
    newPointValid: true,
    editedPoint: {
      pointName: "",
      province: "",
      city: "",
      district: "",
      parkNos: [],
      buildingNos: []
    },
    defaultPoint: {
      pointName: "",
      province: "",
      city: "",
      district: "",
      parkNos: [],
      buildingNos: []
    },
    select: {
      provinceInfoArr: [],
      cityInfoArr: [],
      districtInfoArr: [],
      parkArr: [],
      buildingArr: []
    },
    pointList: []
  }),
  created() {
    this.$store.commit("changeToolBarTitle", { title: "商圈概览" });
    this.initialize();
    this.getAssets();
  },
  methods: {
    initialize() {
      this.networkLoading = true;
      this.networkError = null;
      this.$http
        .post("/cms/pointInfo/listPointInfo.json", {})
        .then(res => {
          this.networkLoading = false;
          let resData = res.data.data;
          this.pointList = resData && resData.length ? resData : [];
        })
        .catch(err => {
          this.networkLoading = false;
          this.networkError = true;
          this.$store.commit("addSnackBar", `商圈查询失败${err}`, "error");
        });
    },
    getAssets() {
      this.$http
        .post("/cms/AssetsInfo/park.json")
        .then(res => {
          let resData = res.data.data;
          resData = resData && resData.length ? resData : [];

          let parkInfo = [];
          resData.map(item => {
            if (item.parkNo === null) {
              this.select.buildingArr.push({
                buildingNo: item.buildingNo,
                buildingName: item.buildingName
              });
            } else {
              if (!parkInfo[item.parkNo]) {
                parkInfo[item.parkNo] = {
                  parkNo: item.parkNo,
                  parkName: item.parkName
                };
              }
            }
          });
          this.select.parkArr = parkInfo.filter(el => el);
        })
        .catch(err =>
          this.$store.commit("addSnackBar", `楼宇信息查询失败 ${err}`, "error")
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
            this.editedPoint.city = "";
            this.editedPoint.district = "";
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
              province: this.editedPoint.province,
              city: city
            }
          })
          .then(res => {
            let resData = res.data.data;
            this.editedPoint.district = "";
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
    newPointClose(isCancel) {
      if (!isCancel || confirm("取消后内容将不会保存")) {
        this.editedPoint = Object.assign({}, this.defaultPoint);
        this.$refs.newPointForm.reset();
        this.menu.newPoint = false;
      }
    },
    newPointSave() {
      if (this.$refs.newPointForm.validate()) {
        this.$http
          .post("/cms/pointInfo/addPointInfo.json", {
            pointName: this.editedPoint.pointName,
            province: this.editedPoint.province,
            city: this.editedPoint.city,
            district: this.editedPoint.district,
            parkNos: String(this.editedPoint.parkNos),
            buildingNos: String(this.editedPoint.buildingNos)
          })
          .then(res => {
            if (res.data.code != 500) {
              this.newPointClose(false);
              this.$store.commit("addSnackBar", "商圈添加成功", "success");
              this.initialize();
            } else {
              this.$store.commit(
                "addSnackBar",
                `商圈添加失败 ${res.data.msg}`,
                "error"
              );
            }
          })
          .catch(err => {
            this.$store.commit("addSnackBar", `商圈添加失败 ${err}`, "error");
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
