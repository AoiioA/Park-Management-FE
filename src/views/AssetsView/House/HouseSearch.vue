<template>
  <div class="fill-height house-detail">
    <view-tool-bar>
      <span slot="bar-menu">
        <v-btn :to="{ name: 'house-new' }" depressed color="primary">添加房源</v-btn>
        <v-btn icon>
          <v-icon>help</v-icon>
        </v-btn>
      </span>
    </view-tool-bar>
    <v-jumbotron height="auto">
      <v-container grid-list-xl>
        <v-layout justify-center align-center>
        </v-layout>
		    <v-layout justify-center wrap>
          <v-flex xs12 xl10>
            <v-subheader>
              筛选搜索您想要的房源
              <v-spacer></v-spacer>
              <!-- <v-btn depressed color="primary" @click="initialize">开始搜索</v-btn> -->
            </v-subheader>
						<v-form ref="searchHouseForm" v-model="searchHouseValid" lazy-validation>
              <v-layout row wrap align-center>
                <v-flex xs12 sm6 lg4>
                  <v-container fill-height fluid grid-list-xs>
                    <v-layout row no-wrap align-center>
                      <v-flex style="width: 50%"><v-text-field v-model.number="searchFilter.buildAreaMin" mask="#####" suffix="m²" :rules="[$store.state.rules.nonnegative]" label="最小面积" flat solo class="elevation-1"></v-text-field></v-flex>
                      <v-flex class="text-xs-center" style="flex:none">至</v-flex>
                      <v-flex style="width: 50%"><v-text-field v-model.number="searchFilter.buildAreaMax" mask="#####" suffix="m²" :rules="[$store.state.rules.nonnegative]" label="最大面积" flat solo class="elevation-1"></v-text-field></v-flex>
                    </v-layout>
                  </v-container>
                </v-flex>
                <v-flex xs6 sm3 lg2 style="min-width: 160px;"><v-select v-model="searchFilter.resourceStatus" :items="searchFilterArr.resourceStatus" solo hide-details single-line class="elevation-1"></v-select></v-flex>
                <v-flex xs6 sm3 lg2 style="min-width: 160px;"><v-select v-model="searchFilter.decorationSituation" :items="searchFilterArr.decorationSituation" solo hide-details single-line class="elevation-1"></v-select></v-flex>
                <v-flex xs6 sm3 lg2 style="min-width: 160px;"><v-select v-model="searchFilter.isRegister" :items="searchFilterArr.isRegister" solo hide-details single-line class="elevation-1"></v-select></v-flex>
                <!-- <v-flex xs6 sm3 lg2 style="min-width: 160px;"><v-select v-model="searchFilter.idleLevel" :items="searchFilterArr.idleLevel" solo hide-details single-line class="elevation-1"></v-select></v-flex> -->
                <v-spacer></v-spacer>
                <v-flex xs12 sm3 lg2><v-btn :disabled="!searchHouseValid||(searchFilter.buildAreaMin>searchFilter.buildAreaMax)" @click="initialize" block large color="primary">开始搜索</v-btn></v-flex>
              </v-layout>
						</v-form>
          </v-flex>
          <v-flex xs12 xl10>
            <v-card>
              <v-card-title class="py-2">
                <v-text-field
                  flat
                  solo
                  prepend-icon="search"
                  label="在筛选结果中继续搜索..."
                  v-model="search"
                ></v-text-field>
                <v-tooltip bottom>
                  <v-btn @click="initialize" slot="activator" icon class="mx-0">
                    <v-icon>refresh</v-icon>
                  </v-btn>
                  <span>刷新数据</span>
                </v-tooltip>
              </v-card-title>
              <v-divider></v-divider>
              <v-data-table
                :search="search"
                :headers="headers"
                :items="getTableData(houseInfoArr)"
                item-key="houseNo"
                :loading="networkLoading"
                :no-data-text="networkError?`网络出现异常 - 检查网络后刷新重试`:`暂无记录`"
                :no-results-text="`没能找到“${ search }”的结果...`"
              >
                <template slot="items" slot-scope="props">
                  <td>{{ props.item.buildingName }}</td>
                  <td>{{ props.item.floorNumber }}</td>
                  <td>{{ props.item.doorNumber }}</td>
                  <td>{{ props.item.buildArea }}</td>
                  <td>{{ props.item.decorationSituation }}</td>
                  <!-- <td>{{ props.item.houseType }}</td> -->
                  <td>{{ props.item.resourceStatus }}</td>
                  <td>{{ props.item.idleDays }}</td>
                  <td class="px-3">
                    <v-btn icon class="mx-0" :to="{ name: 'house-info-detail', params: { houseNo: props.item.houseNo } }">
                      <v-icon color="primary">visibility</v-icon>
                    </v-btn>
                  </td>
                </template>
              </v-data-table>
            </v-card>
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
    houseType: ["整租", "工位"],
    resourceStatus: [
      "空置房源",
      "租赁中房源",
      "预定房源",
      "维护房源",
      "租赁审核房源"
    ],
    decorationSituation: ["毛坯", "简装修", "中等装修", "豪华装修", "精装修"],
    searchHouseValid: true,
    searchFilter: {
      buildAreaMin: "",
      buildAreaMax: "",
      resourceStatus: "",
      decorationSituation: "",
      isRegister: "",
      idleLevel: ""
    },
    searchFilterArr: {
      resourceStatus: [
        { text: "租赁情况", value: "" },
        { text: "空置中", value: 0 },
        { text: "出租中", value: 1 },
        { text: "已预定", value: 2 },
        { text: "维护中", value: 3 },
        { text: "租赁审核", value: 4 }
      ],
      decorationSituation: [
        { text: "装修情况", value: "" },
        { text: "毛坯", value: 0 },
        { text: "简装修", value: 1 },
        { text: "中等装修", value: 2 },
        { text: "豪华装修", value: 3 },
        { text: "精装修", value: 4 }
      ],
      isRegister: [
        { text: "注册状态", value: "" },
        { text: "可注册", value: 1 },
        { text: "不可注册", value: 0 }
      ],
      idleLevel: [
        { text: "预警状态", value: "" },
        { text: "30天内", value: 1 },
        { text: "30-60天", value: 2 },
        { text: "60-90天", value: 3 }
      ]
    },
    search: "",
    headers: [
      { text: "楼宇", value: "buildingName" },
      { text: "楼层", value: "floorNumber" },
      { text: "门牌号", value: "doorNumber" },
      { text: "建筑面积", value: "buildArea" },
      { text: "装修情况", value: "decorationSituation" },
      // { text: "房源类型", value: "houseType" },
      { text: "房源状态", value: "resourceStatus" },
      { text: "空置天数", value: "idleDays" },
      { text: "操作", value: "houseNo", sortable: false }
    ],
    networkLoading: false,
    networkError: null,
    houseInfoArr: []
  }),
  created() {
    this.$store.commit("changeToolBarTitle", { title: "房源概览" });
  },
  mounted() {
    this.initialize();
  },
  methods: {
    initialize() {
      if (this.$refs.searchHouseForm.validate()) {
        this.networkLoading = true;
        this.networkError = null;
        this.buildingInfoArr = [];
        this.houseInfoArr = [];
        let paramsData = {
          limit: 9999,
          page: 1
        };
        for (const key in this.searchFilter) {
          if (this.searchFilter.hasOwnProperty(key)) {
            if (this.searchFilter[key] !== "") {
              paramsData[key] = this.searchFilter[key];
            }
          }
        }
        this.$http
          .all([
            this.$http.post("/cms/AssetsInfo/park.json"),
            this.$http.post("/cms/houseInfo/listHouseInfo.json", paramsData)
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
                  `房源信息搜索失败 ${house.data.msg}`,
                  "error"
                );
              } else {
                let bData = building.data.data;
                let hData = house.data.data;
                this.buildingInfoArr = bData && bData.length ? bData : [];
                this.houseInfoArr = hData && hData.length ? hData : [];
              }
            })
          )
          .catch(err => {
            this.networkLoading = false;
            this.networkError = true;
            this.$store.commit("addSnackBar", `房源搜索失败 ${err}`, "error");
          });
      }
    },
    getTableData(houseInfoArr) {
      let houseList = [];
      houseInfoArr.map(house =>
        houseList.push({
          houseNo: house.houseNo,
          buildingName: this.buildingInfoArr.find(
            item => item.buildingNo == house.buildingNo
          ).buildingName,
          floorNumber: `${(n => {
            return n >= 0 ? n : "地下" + Math.abs(n);
          })(house.floorNumber)}层`,
          doorNumber: `${house.doorNumber}室`,
          buildArea: `${house.buildArea}m²`,
          decorationSituation: this.decorationSituation[
            house.decorationSituation
          ],
          houseType: this.houseType[house.houseType],
          resourceStatus: this.resourceStatus[house.resourceStatus],
          idleDays: `${house.idleDays}天`
        })
      );
      return houseList;
    },
    linkToDetail(houseId) {
      this.$router.push({
        path: "/house/house-info-detail",
        params: { houseId: houseId }
      });
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
