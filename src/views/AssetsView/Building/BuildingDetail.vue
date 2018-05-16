<template>
  <div class="building-detail">
    <v-jumbotron color="blue-grey lighten-4" height="auto">
      <v-container grid-list-xl>
        <v-layout>
          <v-flex>
            <v-subheader>
              <span class="subheading">楼层房源视图</span>
              <v-spacer></v-spacer>
              <v-btn-toggle v-model="houseFilter" class="mx-2 elevation-0">
                <v-btn flat value="average">平均分配</v-btn>
                <v-btn flat value="area">房源面积</v-btn>
                <v-btn flat value="date">房源租期</v-btn>
              </v-btn-toggle>
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
            <v-card>
              <chart
                :options="getOption(props)"
                theme="light"
                auto-resize
                style="height:300px;width:100%;"
              ></chart>
            </v-card>
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
import "../../../../tests/mock/building-mock";

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
    houseFilter: "area"
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
    getOption: floor => ({
      title: {
        text: `第${floor.item.floorNumber}层`,
        subtext: "",
        textStyle: {
          color: "#fff",
          fontWeight: "500"
        }
      },
      tooltip: {
        formatter: "{b}: <br />面积：{c}m²"
      },
      series: [
        {
          name: `全部房源`,
          type: "treemap",
          width: "100%",
          height: "100%",
          leafDepth: 1,
          levels: [
            {
              itemStyle: {
                normal: {}
              }
            },
            {
              colorSaturation: [0.3, 0.6],
              itemStyle: {
                normal: {
                  borderColorSaturation: 0.7,
                  gapWidth: 2,
                  borderWidth: 2
                }
              }
            },
            {
              colorSaturation: [0.3, 0.5],
              itemStyle: {
                normal: {
                  borderColorSaturation: 0.6,
                  gapWidth: 1
                }
              }
            },
            {
              colorSaturation: [0.3, 0.5]
            }
          ],
          data: (() => {
            const houseStatus = [
              "空置房源",
              "出租房源",
              "预定房源",
              "维护房源"
            ];
            let floorData = houseStatus.map(status => ({
              name: status,
              value: 0,
              children: []
            }));
            floor.item.data.forEach(house => {
              floorData[house.resourceStatus].value += parseFloat(
                house.buildArea
              );
              floorData[house.resourceStatus].value = parseFloat(
                floorData[house.resourceStatus].value
              ).toFixed(2);
              floorData[house.resourceStatus].children.push({
                name: `${house.doorNumber}室`,
                value: parseFloat(house.buildArea)
              });
            });
            return floorData;
          })()
        }
      ]
    })
  }
};
</script>
<style lang="stylus" scoped>
</style>
