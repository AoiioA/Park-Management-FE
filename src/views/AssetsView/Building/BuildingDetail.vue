<template>
  <div class="building-detail">
    <v-jumbotron color="blue-grey lighten-4" height="auto">
      <v-container grid-list-xl>
        <v-layout justify-center align-center>
          <v-flex xs12 lg10>
            <v-subheader class="px-0">
              <span style="min-width: 104px" class="mx-2">
                <v-select
                  @change="val => $router.push({ query: { viewType: val } })"
                  :items="houseViewArr"
                  :value="houseView"
                  item-text="text"
                  item-value="value"
                  :hint="`切换房源视图类型`"
                  persistent-hint
                  single-line
                  class="pt-0"
                ></v-select>
              </span>
              <v-spacer></v-spacer>
              <v-btn depressed color="primary">编辑楼宇信息</v-btn>
            </v-subheader>
          </v-flex>
        </v-layout>
        <v-layout v-if="$route.query.viewType=='table'" align-start align-content-start justify-center wrap>
          <v-flex xs12 md10>
            <v-card>
              <v-card-title class="py-2">
                <v-text-field
                  flat
                  solo
                  prepend-icon="search"
                  label="在列表中搜索..."
                  v-model="search"
                ></v-text-field>
                <v-tooltip v-if="selected.length" bottom>
                  <v-btn icon @click="log([selected])" slot="activator">
                    <v-icon>delete_outline</v-icon>
                  </v-btn>
                  <span>批量删除</span>
                </v-tooltip>
                <v-tooltip v-if="selected.length" bottom>
                  <v-btn icon @click="log([selected])" slot="activator">
                    <v-icon>vertical_align_bottom</v-icon>
                  </v-btn>
                  <span>批量导出至Excel</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <v-btn icon @click="initialize" slot="activator">
                    <v-icon>refresh</v-icon>
                  </v-btn>
                  <span>刷新数据</span>
                </v-tooltip>
                <v-menu offset-y left :nudge-bottom="10">
                  <v-btn icon slot="activator">
                    <v-icon>more_vert</v-icon>
                  </v-btn>
                  <v-list two-line dense>
                    <v-list-tile @click="$router.push({ name: 'house-new' })">
                      <v-list-tile-content>
                        <v-list-tile-title>添加房源</v-list-tile-title>
                        <v-list-tile-sub-title>添加单个房源</v-list-tile-sub-title>
                      </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile @click="1">
                      <v-list-tile-content>
                        <v-list-tile-title>批量导入房源</v-list-tile-title>
                        <v-list-tile-sub-title>通过Excel批量导入</v-list-tile-sub-title>
                      </v-list-tile-content>
                    </v-list-tile>
                    <!-- <v-list-tile @click="1">
                      <v-list-tile-content>
                        <v-list-tile-title>批量导出房源</v-list-tile-title>
                        <v-list-tile-sub-title>批量导出至Excel</v-list-tile-sub-title>
                      </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile @click="1">
                      <v-list-tile-content>
                        <v-list-tile-title>批量删除房源</v-list-tile-title>
                        <v-list-tile-sub-title>请谨慎进行删除操作</v-list-tile-sub-title>
                      </v-list-tile-content>
                    </v-list-tile> -->
                  </v-list>
                </v-menu>
              </v-card-title>
              <v-divider></v-divider>
              <v-data-table
                :search="search"
                :headers="headers"
                :items="getTableData(houseInfoArr)"
                item-key="houseId"
                v-model="selected"
                select-all
                :no-data-text="`暂无数据`"
                :no-results-text="`没能找到“${ search }”的结果...`"
              >
                <template slot="items" slot-scope="props">
                  <td>
                    <v-checkbox
                      v-model="props.selected"
                      color="primary"
                      hide-details
                    ></v-checkbox>
                  </td>
                  <td>{{ props.item.floorNumber }}</td>
                  <td>{{ props.item.doorNumber }}</td>
                  <td>{{ props.item.buildArea }}</td>
                  <td>{{ props.item.houseType }}</td>
                  <td>{{ props.item.resourceStatus }}</td>
                  <td class="px-3">
                    <v-btn icon class="mx-0" :to="{ path: '/home/house/house-detail', query: { houseId: props.item.houseId } }">
                      <v-icon color="primary">visibility</v-icon>
                    </v-btn>
                  </td>
                </template>
              </v-data-table>
            </v-card>
          </v-flex>
        </v-layout>
        <v-data-iterator
          v-else
          :items="houseInfoArr"
          :rows-per-page-items="['']"
          :pagination.sync="pagination"
          content-tag="v-layout"
          row
          wrap
          justify-center
        >
          <v-flex slot="item" slot-scope="props" xs12 lg10>
            <chart
              :options="getOption(props)"
              @click="clickHouse"
              auto-resize
              theme="light"
              style="height:240px;width:100%;"
            ></chart>
          </v-flex>
          <v-flex slot="no-data" style="height: 246px; line-height: 246px;">
            <v-progress-circular indeterminate color="primary" v-if="networkLoading"></v-progress-circular>
            <span v-else-if="networkError">网络出现异常 - 检查网络后刷新重试</span>
            <span v-else>暂无房源记录</span>
          </v-flex>
        </v-data-iterator>
      </v-container>
    </v-jumbotron>
  </div>
</template>
<script>
export default {
  data: () => ({
    networkLoading: false,
    networkError: false,
    buildingInfo: {},
    houseInfoArr: [],
    newHouseInfo: {},
    houseView: "area",
    houseViewArr: [
      {
        text: "面积视图",
        value: "area"
      },
      {
        text: "列表视图",
        value: "table"
      }
    ],
    houseType: ["整租", "工位"],
    houseStatus: ["空置房源", "预定房源", "出租房源", "维护房源"],
    pagination: {
      rowsPerPage: 3
    },
    search: "",
    headers: [
      { text: "楼层", value: "floorNumber" },
      { text: "门牌号", value: "doorNumber" },
      { text: "建筑面积(m²)", value: "buildArea" },
      { text: "房源类型", value: "houseType" },
      { text: "房源状态", value: "resourceStatus" },
      { text: "操作", value: "houseId", sortable: false }
    ],
    selected: []
  }),
  watch: {
    $route: "initialize"
  },
  created() {
    this.$store.commit("changeToolBarTitle", "楼宇详情");
    this.houseView = this.$route.query.viewType || this.houseViewArr[0].value;
    this.initialize();
  },
  methods: {
    initialize() {
      this.networkLoading = true;
      this.buildingInfo = {};
      this.houseInfoArr = [];
      this.$http
        .all([
          this.$http.post("/cms/buildingInfo/list.json", {
            buildingId: this.$route.params.buildingId
          }),
          this.$http.post("/cms/houseInfo/listByFloor.json", {
            buildingId: this.$route.params.buildingId
          })
        ])
        .then(
          this.$http.spread((building, house) => {
            this.networkLoading = false;
            if (building.data.code == 500) {
              this.$store.commit(
                "addSnackBar",
                `楼宇信息查询失败 ${building.data.msg}`,
                "error"
              );
            } else if (house.data.code == 500) {
              this.$store.commit(
                "addSnackBar",
                `房源信息查询失败 ${house.data.msg}`,
                "error"
              );
            } else {
              let bData = building.data.data;
              let hData = house.data.data;
              this.buildingInfo = bData && bData.length ? bData[0] : {};
              this.houseInfoArr = hData && hData.length ? hData : [];
            }
          })
        )
        .catch(err => {
          this.networkLoading = false;
          this.networkError = true;
          this.$store.commit("addSnackBar", `楼宇查询失败${err}`, "error");
        });
    },
    getOption(floor) {
      let floorData = this.houseStatus.map((status, i) => ({
        name: status,
        value: [0, i],
        children: []
      }));

      floor.item.data.forEach(house => {
        floorData[house.resourceStatus].value[0] = (
          parseFloat(house.buildArea) +
          parseFloat(floorData[house.resourceStatus].value[0])
        ).toFixed(2);

        floorData[house.resourceStatus].children.push({
          name: `${house.doorNumber}室`,
          value: [parseFloat(house.buildArea)],
          to: {
            path: "/home/house/house-detail",
            query: { houseId: house.houseId }
          }
        });
      });

      return {
        title: {
          text: `房源 - ${floor.item.floorNo}层`,
          subtext: "",
          top: 10,
          left: 10,
          textStyle: {
            color: "#fff",
            fontWeight: "500"
          }
        },
        tooltip: { formatter: a => `${a.name}: <br />面积：${a.value[0]}m²` },
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
                color: ["#4FC3F7", "#1E88E5", "#5C6BC0", "#90A4AE"],
                colorMappingBy: "value",
                squareRatio: 0.000001,
                visualDimension: 1,
                itemStyle: {
                  normal: {
                    borderColor: "#CFD8DC",
                    gapWidth: 8
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
    getTableData(houseInfo) {
      let houseList = [];
      houseInfo.map(floor => {
        floor.data.map(house =>
          houseList.push({
            houseId: house.houseId,
            floorNumber: `${floor.floorNo}层`,
            doorNumber: `${house.doorNumber}室`,
            buildArea: `${house.buildArea}`,
            houseType: this.houseType[house.houseType],
            resourceStatus: this.houseStatus[house.resourceStatus]
          })
        );
      });
      return houseList;
    },
    clickHouse(obj) {
      if (obj.data && obj.data.to) this.$router.push(obj.data.to);
    },
    log(arr) {
      console.log(...arr);
    }
  }
};
</script>
