<template>
  <div class="building-detail building">
    <view-tool-bar>
      <span slot="bar-menu">
        <v-dialog :disabled="networkLoading || networkError || buildingInfo.delFlag === 0" v-model="newBuildingDialog" max-width="500px" persistent>
          <v-btn slot="activator" :disabled="buildingInfo.delFlag === 0" @click="getPark();getProvince();" depressed color="primary">编辑楼宇</v-btn>
          <v-form ref="editBuildingForm" v-model="newBuildingValid" lazy-validation>
            <v-card>
              <v-card-title>
                <span class="headline">修改楼宇信息</span>
                <v-spacer></v-spacer>
                <v-btn flat @click="delBuilding" color="error">删除楼宇</v-btn>
              </v-card-title>
              <v-card-text>
                <v-container grid-list-xs>
                  <v-layout wrap>
                    <v-flex xs4><v-select v-model="editedBuilding.parkNo" :items="select.parkInfoArr" item-text="parkName" item-value="parkNo" label="所属园区" :hint="editedBuilding.parkNo!==0?`楼宇将继承省市区县信息`:''" persistent-hint autocomplete required></v-select></v-flex>
                    <v-flex xs4><v-text-field v-model="editedBuilding.buildingName" :rules="[$store.state.rules.required]" label="楼宇名称" :hint="editedBuilding.buildingName?`全称为 : ${fullBuildingName}`:''" persistent-hint required></v-text-field></v-flex>
                    <v-flex xs4><v-text-field v-model="editedBuilding.constructionArea" :rules="[$store.state.rules.noZero, $store.state.rules.nonnegative]" label="建筑面积(m²)" type="number" required></v-text-field></v-flex>
                    <v-flex xs4><v-select v-if="editedBuilding.parkNo==0" @change="getCity" v-model="editedBuilding.province" :items="select.provinceInfoArr" item-text="provinceName" item-value="provinceName" :rules="[$store.state.rules.required]" label="省" autocomplete required></v-select></v-flex>
                    <v-flex xs4><v-select v-if="editedBuilding.parkNo==0" :disabled="!editedBuilding.province" @change="getDistrict" v-model="editedBuilding.city" :items="select.cityInfoArr" item-text="cityName" item-value="cityName" :rules="[$store.state.rules.required]" label="市" autocomplete required></v-select></v-flex>
                    <v-flex xs4><v-select v-if="editedBuilding.parkNo==0" :disabled="!editedBuilding.city" v-model="editedBuilding.district" :items="select.districtInfoArr" item-text="countyName" item-value="countyName" :rules="[$store.state.rules.required]" label="区县" autocomplete required></v-select></v-flex>
                    <v-flex xs12><v-text-field v-model="editedBuilding.address" :rules="[$store.state.rules.required]" label="详细地址" required></v-text-field></v-flex>
                  </v-layout>
                </v-container>
                <small class="px-1 red--text text--accent-2">*&nbsp;标记为必填项</small>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn depressed @click="newBuildingClose(true)">取消操作</v-btn>
                <v-btn :disabled="!newBuildingValid" @click="newBuildingSave" depressed color="primary">确认修改</v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-dialog>
        <v-btn icon>
          <v-icon>help</v-icon>
        </v-btn>
      </span>
      <span slot="bar-extend">
        <v-tabs v-model="activeTab" color="primary" class="px-4" show-arrows>
          <v-tab v-for="tab in viewToolBarTab" :key="tab.value">{{ tab.name }}</v-tab>
        </v-tabs>
      </span>
    </view-tool-bar>
    <v-tabs-items v-model="activeTab">
      <v-tab-item>
        <v-container grid-list-xl>
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
                            <div class="title">{{ buildingDataInfo.emptyHouseArea }}m²</div>
                          </v-flex>
                          <v-flex>
                            <div class="mb-1 grey--text text--darken-1">
                              <span class="chart-legend-icon" style="background: #1976d2"></span>
                              出租房源
                            </div>
                            <div class="title">{{ buildingDataInfo.rentHouseArea }}m²</div>
                          </v-flex>
                          <v-flex>
                            <div class="mb-1 grey--text text--darken-1">
                              <span class="chart-legend-icon" style="background: #90A4AE"></span>
                              其他房源
                            </div>
                            <div class="title">{{ buildingDataInfo.totalHouseArea - buildingDataInfo.emptyHouseArea - buildingDataInfo.rentHouseArea }}m²</div>
                          </v-flex>
                        </v-layout>
                      </v-container>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-tab-item>
      <v-tab-item>
        <v-container grid-list-xl>
          <v-subheader>楼内房源租赁情况</v-subheader>
          <v-data-iterator
            :items="houseInfoArr"
            :rows-per-page-items="['']"
            :pagination.sync="pagination"
            content-tag="v-layout"
            row
            wrap
            justify-center
          >
            <v-flex slot="item" slot-scope="props" xs12 xl10>
              <chart
                :options="getOption(props)"
                @click="clickHouse"
                auto-resize
                theme="light"
                style="height:240px;width:100%;"
              ></chart>
            </v-flex>
            <v-flex slot="no-data" class="no-data">
              <v-progress-circular indeterminate color="primary" v-if="networkLoading"></v-progress-circular>
              <span v-else-if="networkError">网络出现异常 - 检查网络后刷新重试</span>
              <span v-else>暂无房源记录</span>
            </v-flex>
          </v-data-iterator>
        </v-container>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>
<script>
import ViewToolBar from "@/components/ViewToolBar.vue";
import FileUpload from "vue-upload-component";

export default {
  components: {
    ViewToolBar,
    FileUpload
  },
  data: () => ({
    networkLoading: false,
    networkError: false,
    activeTab: null,
    viewToolBarTab: [
      {
        name: "楼宇信息",
        value: "info"
      },
      {
        name: "楼内房源",
        value: "assets"
      }
    ],
    // 修改房源相关
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
    // 详情等相关
    buildingInfo: {},
    buildingDataInfo: {},
    houseInfoArr: [],
    resourceStatus: [
      "空置房源",
      "租赁中房源",
      "预定房源",
      "维护房源",
      "租赁审核房源"
    ],
    pagination: {
      rowsPerPage: 3
    }
  }),
  computed: {
    fullBuildingName() {
      if (
        this.select.parkInfoArr.length > 1 &&
        this.editedBuilding.parkNo !== 0
      ) {
        let parkName = this.select.parkInfoArr.find(
          item => item.parkNo == this.editedBuilding.parkNo
        );
        return `${parkName.parkName} ${this.editedBuilding.buildingName}`;
      }
      return this.editedBuilding.buildingName;
    },
    assetsNumberOption() {
      let optLegend = ["空置房源", "出租房源", "其他房源"];
      let optData = [
        this.buildingDataInfo.emptyHouseCount,
        this.buildingDataInfo.rentHouseCount
      ];
      optData.push(
        this.buildingDataInfo.totalHouseCount -
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
        this.buildingDataInfo.emptyHouseArea,
        this.buildingDataInfo.rentHouseArea
      ];
      optData.push(
        this.buildingDataInfo.totalHouseArea -
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
    this.$store.commit("changeToolBarTitle", {
      title: "楼宇详情",
      isBack: true,
      crumbs: [
        { name: "楼宇概览", to: { name: "building-list" } },
        { name: "楼宇详情" }
      ]
    });
    this.initialize();
  },
  methods: {
    initialize() {
      this.networkLoading = true;
      this.networkError = null;
      this.buildingInfo = {};
      this.buildingDataInfo = {};
      this.houseInfoArr = [];
      this.$http
        .all([
          this.$http.post("/cms/buildingInfo/listBuildingInfo.json", {
            buildingNo: Number(this.$route.params.buildingNo)
          }),
          this.$http.post("/cms/AssetsInfo/queryBuildingAssetsStatistics.json", {
            buildingNos: String(this.$route.params.buildingNo)
          }),
          this.$http.post("/cms/houseInfo/listHouseInfoByFloor.json", {
            buildingNo: Number(this.$route.params.buildingNo)
          })
        ])
        .then(
          this.$http.spread((building, buildingData, house) => {
            this.networkLoading = false;
            if (building.data.code == 500) {
              this.networkError = true;
              this.$store.commit(
                "addSnackBar",
                `楼宇信息查询失败 ${building.data.msg}`,
                "error"
              );
            } else if (buildingData.data.code == 500) {
              this.networkError = true;
              this.$store.commit(
                "addSnackBar",
                `楼宇统计信息查询失败 ${buildingData.data.msg}`,
                "error"
              );
            } else if (house.data.code == 500) {
              this.networkError = true;
              this.$store.commit(
                "addSnackBar",
                `房源信息查询失败 ${house.data.msg}`,
                "error"
              );
            } else {
              let bData = building.data.data;
              let hData = house.data.data;
              this.buildingInfo = bData && bData.length ? bData[0] : {};
              this.buildingDataInfo = buildingData.data.data;
              this.houseInfoArr =
                hData && hData.length
                  ? hData.sort((x, y) => x.floorNo > y.floorNo)
                  : [];
              for (let key in this.buildingInfo) {
                if (this.defaultBuilding.hasOwnProperty(key)) {
                  this.defaultBuilding[key] = this.buildingInfo[key];
                }
              }
              if (this.buildingInfo.parkNo) {
                this.defaultBuilding.buildingName = this.defaultBuilding.buildingName.split(
                  " "
                )[1];
              } else {
                this.defaultBuilding.parkNo = 0;
              }
              this.editedBuilding = Object.assign({}, this.defaultBuilding);
              this.$store.commit("changeToolBarTitle", {
                title: this.buildingInfo.buildingName,
                isBack: true,
                crumbs: [
                  { name: "楼宇概览", to: { name: "building-list" } },
                  { name: "楼宇详情" }
                ]
              });
            }
          })
        )
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
    delBuilding() {
      this.$http
        .post(
          `/cms/buildingInfo/deleteBuildingInfo.json?buildingNos=${
            this.buildingInfo.buildingNo
          }`
        )
        .then(res => {
          if (res.data.code != 500) {
            this.$store.commit("addSnackBar", "楼宇删除成功", "success");
            this.$router.go(0);
          }
        })
        .catch(err =>
          this.$store.commit("addSnackBar", `楼宇删除失败${err}`, "error")
        );
    },
    newBuildingClose(isCancel) {
      if (!isCancel || confirm("取消后内容将不会保存")) {
        this.$refs.editBuildingForm.reset();
        this.newBuildingDialog = false;
        this.editedBuilding = Object.assign({}, this.defaultBuilding);
      }
    },
    newBuildingSave() {
      if (this.$refs.editBuildingForm.validate()) {
        let park = this.select.parkInfoArr.find(
          item => item.parkNo == this.editedBuilding.parkNo
        );
        this.$http
          .post("/cms/buildingInfo/updateBuildingInfoByHouseNo.json", {
            buildingId: this.buildingInfo.buildingId,
            buildingNo: this.buildingInfo.buildingNo,
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
              this.$store.commit("addSnackBar", "楼宇修改成功", "success");
            } else {
              this.$store.commit(
                "addSnackBar",
                `楼宇修改失败 ${res.data.msg}`,
                "success"
              );
            }
          })
          .catch(err =>
            this.$store.commit("addSnackBar", `楼宇修改失败 ${err}`, "error")
          );
      }
    },
    getOption(floor) {
      let floorData = this.resourceStatus.map((status, i) => ({
        name: status,
        value: [0, i],
        children: []
      }));

      floor.item.room.forEach(house => {
        floorData[house.resourceStatus].value[0] = (
          parseFloat(house.buildArea) +
          parseFloat(floorData[house.resourceStatus].value[0])
        ).toFixed(2);

        floorData[house.resourceStatus].children.push({
          name: `${house.doorNumber}室`,
          value: [parseFloat(house.buildArea)],
          to: {
            name: "house-info-detail",
            params: { houseNo: house.houseNo }
          }
        });
      });

      let totalArea = 0;
      floorData.forEach(item => (totalArea += parseFloat(item.value[0])));
      floorData.forEach(
        item =>
          (item.value[2] =
            Math.round((parseFloat(item.value[0]) / totalArea) * 10000) / 100)
      );

      return {
        title: {
          text: `房源 - ${(n => {
            return n >= 0 ? n : "地下" + Math.abs(n);
          })(floor.item.floorNo)}层`,
          subtext: "",
          top: 10,
          left: 10,
          textStyle: {
            color: "#fff",
            fontWeight: "500"
          }
        },
        tooltip: {
          formatter: a => `
            <div style="min-width: 120px;">
              <div>${a.name}</div>
              <div>面积 : <h4 style="float: right">${a.value[0]}m²<h4></div>
              ${
                a.value[2]
                  ? "<div>占比 : <h4 style='float: right'>" +
                    a.value[2] +
                    "%<h4></div>"
                  : ""
              }
            </div>
          `,
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
        series: [
          {
            name: `全部房源`,
            value: 111,
            type: "treemap",
            width: "100%",
            height: "100%",
            // roam: "false",
            nodeClick: "link",
            breadcrumb: {
              left: 0,
              itemStyle: {
                borderWidth: 0,
                opacity: 0.78
              }
            },
            leafDepth: 1,
            levels: [
              {
                // color: ["#37A2DA", "#32C5E9", "#67E0E3", "#9fe6b8"],
                // color: ["#37A2DA", "#32C5E9", "#7bd9a5", "#AAA"],
                // color: ["#23B6C9", "#EBB206", "#AB60B8", "#AAA"],
                color: ["#29B6F6", "#1E88E5", "#5C6BC0", "#90A4AE", "#90A4AE"],
                colorMappingBy: "value",
                squareRatio: 0.000001,
                visualDimension: 1,
                itemStyle: {
                  normal: {
                    borderColor: "#CFD8DC",
                    gapWidth: 0
                  }
                }
              },
              {
                colorSaturation: [0.6, 0.4],
                itemStyle: {
                  normal: {
                    borderColorSaturation: 0.7,
                    gapWidth: 4,
                    borderWidth: 4
                  }
                }
              },
              {
                colorSaturation: [0.6, 0.4],
                itemStyle: {
                  normal: {
                    borderColorSaturation: 0.6,
                    gapWidth: 1
                  }
                }
              }
            ],
            data: floorData
          }
        ]
      };
    },
    clickHouse(obj) {
      if (obj.data && obj.data.to) this.$router.push(obj.data.to);
    }
  }
};
</script>

<style lang="stylus">
.no-data {
  height: 300px;
  line-height: 300px;
  text-align: center;
}
</style>
