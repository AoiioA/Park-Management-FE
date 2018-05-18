<template>
  <div class="building-detail">
    <v-jumbotron color="blue-grey lighten-4" height="auto">
      <v-container grid-list-xl>
        <v-layout justify-center align-center>
          <v-flex xs12 lg10>
            <v-subheader class="px-0">
              <span style="min-width: 104px" class="mx-2">
                <v-select
                  disabled
                  :items="houseFilterArr"
                  v-model="houseFilter"
                  item-text="text"
                  item-value="value"
                  return-object
                  :hint="`切换房源视图类型`"
                  persistent-hint
                  single-line
                  class="pt-0"
                ></v-select>
              </span>
              <v-spacer></v-spacer>
              <v-btn depressed>编辑楼宇</v-btn>
              <v-btn depressed color="primary">添加房源</v-btn>
            </v-subheader>
          </v-flex>
        </v-layout>
        <v-data-iterator
          :items="houseInfoArr"
          :rows-per-page-items="['']"
          :pagination.sync="pagination"
          content-tag="v-layout"
          row
          wrap
          justify-center
        >
          <!-- <v-layout ></v-layout> -->
          <v-flex slot="item" slot-scope="props" xs12 lg10>
            <chart
              :options="getOption(props)"
              theme="light"
              auto-resize
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
import "@/mock/building-mock";

export default {
  data: () => ({
    networkLoading: false,
    networkError: false,
    buildingInfo: {},
    houseInfoArr: [],
    newHouseInfo: {},
    pagination: {
      rowsPerPage: 3
    },
    houseFilter: {
      text: "面积视图",
      value: "area"
    },
    houseFilterArr: [
      {
        text: "平均视图",
        value: "average"
      },
      {
        text: "面积视图",
        value: "area"
      },
      {
        text: "期限视图",
        value: "date"
      }
    ]
  }),
  watch: {
    $route: "initialize"
  },
  mounted() {
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
            let bData = building.data.data;
            let hData = house.data.data;
            console.log(bData, hData);
            this.buildingInfo = bData && bData.length ? bData[0] : {};
            this.houseInfoArr = hData && hData.length ? hData : [];
          })
        )
        .catch(err => {
          this.networkLoading = false;
          this.networkError = true;
          console.log(err);
        });
    },
    getOption: floor => {
      const houseStatus = ["空置房源", "预定房源", "出租房源", "维护房源"];

      let floorData = houseStatus.map((status, i) => ({
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
          value: [parseFloat(house.buildArea)]
          // link: "aaa"
        });
      });

      return {
        title: {
          text: `第${floor.item.floorNo}层`,
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
    }
  }
};
</script>
