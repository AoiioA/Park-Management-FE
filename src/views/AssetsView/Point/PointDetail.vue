<template>
	<v-jumbotron height="auto">
		<v-progress-linear v-if="networkLoading" indeterminate class="my-0"></v-progress-linear>
		<v-alert v-else-if="networkError" :value="true" type="error">网络出现异常 - 检查网络后刷新重试</v-alert>
		<v-container v-else grid-list-xl>
      <v-layout justify-center align-center>
        <v-flex xs12 xl10>
          <v-subheader>
            商圈信息
            <v-spacer></v-spacer>
            <v-dialog v-model="menu.newDialog" max-width="500px" persistent>
              <v-btn slot="activator" @click="getAssets" color="primary" small depressed>编辑商圈</v-btn>
              <v-form ref="newPointForm" v-model="newPointValid" lazy-validation>
                <v-card>
                  <v-card-title>
                    <span class="headline">编辑商圈</span>
                      <v-spacer></v-spacer>
                      <v-dialog v-model="menu.delDialog" persistent max-width="290">
                        <v-btn slot="activator" flat color="error">删除商圈</v-btn>
                        <v-card>
                          <v-card-title class="headline">确认删除商圈?</v-card-title>
                          <v-card-text>删除商圈并不会影响该商圈所含资源。</v-card-text>
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
                        <v-flex xs12><v-text-field v-model="editedPoint.pointName" :rules="[$store.state.rules.required]" label="商圈名称" hint="如 : 望京商圈" persistent-hint required></v-text-field></v-flex>
                        <v-flex xs12><v-select :disabled="!select.parkArr.length" v-model="editedPoint.parkNos" :items="select.parkArr" item-text="parkName" item-value="parkNo" label="所含园区" no-data-text="暂无可添加的园区" hint="园区及楼宇可稍后重新选择或修改" persistent-hint multiple autocomplete></v-select></v-flex>
                        <v-flex xs12><v-select :disabled="!select.buildingArr.length" v-model="editedPoint.buildingNos" :items="select.buildingArr" item-text="buildingName" item-value="buildingNo" label="所含楼宇" no-data-text="暂无可添加的楼宇" hint="仅可选择未划分园区的楼宇" persistent-hint multiple autocomplete></v-select></v-flex>
                      </v-layout>
                    </v-container>
                    <small class="px-1 red--text text--accent-2">*&nbsp;标记为必填项</small>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn depressed @click="newPointClose(true)">取消操作</v-btn>
                    <v-btn :disabled="!newPointValid" @click="newPointSave" depressed color="primary">确认修改</v-btn>
                  </v-card-actions>
                </v-card>
              </v-form>
            </v-dialog>
          </v-subheader>
          <v-layout justify-center wrap>
            <v-flex xs12 sm6>
              <v-card>
                <v-card-title>房源租赁情况(数量)</v-card-title>
                <!-- <v-divider></v-divider> -->
                <v-container fluid fill-height>
                  <v-layout>
                    <v-flex>
                      <chart
                        :options="assetsNumberOption"
                        auto-resize
                        theme="light"
                        style="height:240px;width:100%;"
                      ></chart>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card>
            </v-flex>
            <v-flex xs12 sm6>
              <v-card>
                <v-card-title>房源租赁情况(面积)</v-card-title>
                <!-- <v-divider></v-divider> -->
                <v-container fluid fill-height>
                  <v-layout wrap>
                    <v-flex xs12 sm8>
                      <chart
                        :options="assetsAreaOption"
                        auto-resize
                        theme="light"
                        style="height:240px;width:100%;"
                      ></chart>
                    </v-flex>
                    <v-flex xs12 sm4>
                      <v-container fluid fill-height>
                        <v-layout column>
                          <v-flex>
                            <div class="mb-1 grey--text text--darken-1">
                              <span class="chart-legend-icon" style="background: #29B6F6"></span>
                              空置房源
                            </div>
                            <div class="title">{{ pointDataInfo.emptyHouseArea }}m²</div>
                          </v-flex>
                          <v-flex>
                            <div class="mb-1 grey--text text--darken-1">
                              <span class="chart-legend-icon" style="background: #1976d2"></span>
                              出租房源
                            </div>
                            <div class="title">{{ pointDataInfo.rentHouseArea }}m²</div>
                          </v-flex>
                          <v-flex>
                            <div class="mb-1 grey--text text--darken-1">
                              <span class="chart-legend-icon" style="background: #90A4AE"></span>
                              其他房源
                            </div>
                            <div class="title">{{ pointDataInfo.totalHouseArea - pointDataInfo.emptyHouseArea - pointDataInfo.rentHouseArea }}m²</div>
                          </v-flex>
                        </v-layout>
                      </v-container>
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
  computed: {
    assetsNumberOption() {
      let optLegend = ["空置房源", "出租房源", "其他房源"];
      let optData = [
        this.pointDataInfo.emptyHouseCount,
        this.pointDataInfo.rentHouseCount
      ];
      optData.push(
        this.pointDataInfo.totalHouseCount -
          optData.reduce((all, item) => all + item)
      );
      return {
        color: ["#1976d2", "#29B6F6", "#5C6BC0", "#90A4AE", "#90A4AE"],
        tooltip: {
          textStyle: {
            color: "rgba(0,0,0,0.87)"
          },
          backgroundColor: "#ECEFF1",
          padding: [8, 12],
          extraCssText: `
            border-radius: 3px;
            box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
          `
        },
        legend: {
          data: optLegend
        },
        grid: [{ left: 20, right: 0, top: 20, bottom: 0, containLabel: true }],
        xAxis: {
          type: "category",
          data: optLegend,
          axisLine: { show: false },
          axisTick: { show: false }
        },
        yAxis: {
          name: "房源数量",
          nameLocation: "middle",
          nameGap: "60",
          type: "value",
          axisLine: { show: false },
          axisTick: { show: false }
        },
        series: [
          {
            data: optData,
            type: "bar",
            barWidth: "50%",
            label: {
              show: true,
              position: "top",
              fontSize: "16"
            }
          }
        ]
      };
    },
    assetsAreaOption() {
      let optLegend = ["空置房源", "出租房源", "其他房源"];
      let optData = [
        this.pointDataInfo.emptyHouseArea,
        this.pointDataInfo.rentHouseArea
      ];
      optData.push(
        this.pointDataInfo.totalHouseArea -
          optData.reduce((all, item) => all + item)
      );
      optData = optData.map((item, index) => ({
        value: item,
        name: optLegend[index]
      }));
      return {
        color: ["#29B6F6", "#1976d2", "#90A4AE"],
        tooltip: {
          textStyle: {
            color: "rgba(0,0,0,0.87)"
          },
          backgroundColor: "#ECEFF1",
          padding: [8, 12],
          extraCssText: `
            border-radius: 3px;
            box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
          `,
          formatter: "<strong>{b}</strong><br />面积 : {c}m²<br />占比 : {d}%"
        },
        grid: [{ left: 0, right: 0, top: 0, bottom: 0, containLabel: true }],
        series: [
          {
            type: "pie",
            radius: ["70%", "90%"],
            label: {
              show: false
            },
            data: optData
          }
        ]
      };
    }
  },
  created() {
    this.$store.commit("changeToolBarTitle", { title: "商圈概览" });
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
                `商圈信息查询失败 ${point.data.msg}`,
                "error"
              );
            } else if (pointData.data.code == 500) {
              this.$store.commit(
                "addSnackBar",
                `商圈统计信息查询失败 ${pointData.data.msg}`,
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
              this.defaultPoint.parkNos = this.defaultPoint.parkNos
                .split(",")
                .map(item => Number(item));
              this.defaultPoint.buildingNos = this.defaultPoint.buildingNos
                .split(",")
                .map(item => Number(item));
              this.editedPoint = Object.assign({}, this.defaultPoint);
              this.$store.commit("changeToolBarTitle", {
                title: `${this.pointInfo.pointName}
                  <span class="subheading">
                    ${this.pointInfo.city} ${this.pointInfo.district}
                  </span>`,
                isBack: true,
                crumbs: [
                  { name: "商圈概览", to: { name: "point-list" } },
                  { name: "商圈详情" }
                ]
              });
            }
          })
        )
        .catch(err => {
          this.networkLoading = false;
          this.networkError = true;
          this.$store.commit("addSnackBar", `商圈查询失败 ${err}`, "error");
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
    newPointClose(isCancel) {
      if (!isCancel || confirm("取消后内容将不会保存")) {
        this.$refs.newPointForm.reset();
        this.menu.newDialog = false;
        this.editedPoint = Object.assign({}, this.defaultPoint);
      }
    },
    newPointSave() {
      if (this.$refs.newPointForm.validate()) {
        this.$http
          .post("/cms/pointInfo/updatePointInfo.json", {
            pointNo: this.pointInfo.pointNo,
            pointName: this.editedPoint.pointName,
            province: this.editedPoint.province,
            city: this.editedPoint.city,
            district: this.editedPoint.district,
            parkNos: String(this.editedPoint.parkNos),
            buildingNos: String(this.editedPoint.buildingNos)
          })
          .then(res => {
            // if (res.data.code != 500) {
              this.newPointClose(false);
              this.$store.commit("addSnackBar", "商圈编辑成功", "success");
              this.initialize();
            // } else {
            //   this.$store.commit(
            //     "addSnackBar",
            //     `商圈编辑失败 ${res.data.msg}`,
            //     "error"
            //   );
            // }
          })
          .catch(err => {
            this.$store.commit("addSnackBar", `商圈编辑失败 ${err}`, "error");
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
            this.$store.commit("addSnackBar", "商圈删除成功", "success");
            this.$router.replace({
              name: "point-list"
            });
          }
        })
        .catch(err =>
          this.$store.commit("addSnackBar", `商圈删除失败${err}`, "error")
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

.chart-legend-icon {
  display: inline-block;
  border-radius: 50%;
  width: 10px;
  height: 10px;
}
</style>
