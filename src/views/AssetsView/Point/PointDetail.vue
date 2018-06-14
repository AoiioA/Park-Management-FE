<template>
	<v-jumbotron height="auto">
		<v-progress-linear v-if="networkLoading" indeterminate class="my-0"></v-progress-linear>
		<v-alert v-else-if="networkError" :value="true" type="error">网络出现异常 - 检查网络后刷新重试</v-alert>
		<v-container v-else grid-list-xl>
      <v-layout justify-center align-center>
        <v-flex xs12 xl10>
          <v-subheader>
            生态圈信息
            <v-spacer></v-spacer>
            <v-dialog v-model="menu.newDialog" max-width="500px" persistent>
              <v-btn slot="activator" color="primary" small depressed>编辑生态圈</v-btn>
              <v-form ref="newPointForm" v-model="newPointValid" lazy-validation>
                <v-card>
                  <v-card-title>
                    <span class="headline">编辑生态圈</span>
                      <v-spacer></v-spacer>
                      <v-dialog v-model="menu.delDialog" persistent max-width="290">
                        <v-btn slot="activator" flat color="error">删除生态圈</v-btn>
                        <v-card>
                          <v-card-title class="headline">确认删除生态圈?</v-card-title>
                          <v-card-text>删除生态圈并不会影响该生态圈所含资源。</v-card-text>
                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="primary" flat @click.native="menu.delDialog = false">再看看</v-btn>
                            <v-btn color="error" flat @click.native="delPoint">我确认</v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-dialog>
                  </v-card-title>
                  <v-card-text>
                    <v-container grid-list-xs>
                      <v-layout wrap>
                        <v-flex xs12><v-text-field v-model="editedPoint.pointName" :rules="[$store.state.rules.required]" label="生态圈名称" hint="如 : 望京生态圈" persistent-hint required></v-text-field></v-flex>
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
          <v-card>
            <!-- <v-card-title></v-card-title>
            <v-divider></v-divider> -->
            <v-list dense>
              <v-list-tile>
                <v-list-tile-content>省 : </v-list-tile-content>
                <v-list-tile-content class="align-end">{{ pointDataInfo.province }}</v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card>
        </v-flex>
      </v-layout>
		</v-container>
	</v-jumbotron>
</template>

<script>
export default {
  data: () => ({
    networkLoading: false,
    networkError: null,
    menu: {
      newDialog: false,
      delDialog: false
    },
    select: {
      provinceInfoArr: [],
      cityInfoArr: [],
      districtInfoArr: [],
      parkArr: [],
      buildingArr: []
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
    pointInfo: {},
    parkInfoArr: [],
    pointDataInfo: {}
  }),
  created() {
    this.$store.commit("changeToolBarTitle", { title: "生态圈概览" });
    this.initialize();
  },
  methods: {
    initialize() {
      this.networkLoading = true;
      this.networkError = null;
      this.pointInfo = {};
      this.buildingInfoArr = [];
      this.$http
        .all([
          this.$http.post("/cms/pointInfo/listPointInfo.json", {
            limit: 99999
          }),
          this.$http.post("/cms/pointInfo/listPointInfoByPointNo.json", {
            pointNo: this.$route.params.pointNo
          })
        ])
        .then(
          this.$http.spread((point, pointData) => {
            this.networkLoading = false;
            if (point.data.code == 500) {
              this.$store.commit(
                "addSnackBar",
                `生态圈信息查询失败 ${point.data.msg}`,
                "error"
              );
            } else if (pointData.data.code == 500) {
              this.$store.commit(
                "addSnackBar",
                `生态圈统计信息查询失败 ${pointData.data.msg}`,
                "error"
              );
            } else {
              let pData = point.data.data;
              this.pointInfo =
                pData && pData.length
                  ? pData.find(
                      item => item.pointNo == this.$route.params.pointNo
                    )
                  : {};
              if (!this.pointInfo) throw new Error();
              this.pointDataInfo = pointData.data.data;
              for (let key in this.pointInfo) {
                if (this.defaultPoint.hasOwnProperty(key)) {
                  this.defaultPoint[key] = this.pointInfo[key];
                }
              }
              this.editedPoint = Object.assign({}, this.defaultPoint);
              this.$store.commit("changeToolBarTitle", {
                title: `${this.pointInfo.pointName}
                  <span class="subheading">
                    ${this.pointInfo.city} ${this.pointInfo.district}
                  </span>`,
                isBack: true,
                crumbs: [
                  { name: "生态圈概览", to: { name: "point-list" } },
                  { name: "生态圈详情" }
                ]
              });
            }
          })
        )
        .catch(err => {
          this.networkLoading = false;
          this.networkError = true;
          this.$store.commit("addSnackBar", `生态圈查询失败 ${err}`, "error");
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
        this.menu.newDialog = false;
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
              this.$store.commit("addSnackBar", "生态圈添加成功", "success");
              this.initialize();
            } else {
              this.$store.commit(
                "addSnackBar",
                `生态圈添加失败 ${res.data.msg}`,
                "success"
              );
            }
          })
          .catch(err => {
            this.networkLoading = false;
            this.networkError = true;
            this.$store.commit("addSnackBar", `生态圈添加失败${err}`, "error");
          });
      }
    },
    delPoint() {
      this.$http
        .post(
          `/cms/pointInfo/batchDelPointInfo.json?pointNos=${
            this.pointInfo.pointNo
          }`
        )
        .then(res => {
          if (res.data.code != 500) {
            this.$store.commit("addSnackBar", "生态圈删除成功", "success");
            this.$router.replace({
              name: "point-list"
            });
          }
        })
        .catch(err =>
          this.$store.commit("addSnackBar", `生态圈删除失败${err}`, "error")
        );
    }
  }
};
</script>

<style lang="stylus" scoped>
.no-data {
  height: 400px;
  line-height: 400px;
  text-align: center;
}
</style>
