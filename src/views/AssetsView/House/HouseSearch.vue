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
      <v-container grid-list-lg>
        <v-layout justify-center align-center>
          <v-flex xs12 lg10>
            <v-subheader class="px-0">
              筛选搜索您想要的房源
              <v-spacer></v-spacer>
              <!-- <v-btn depressed color="primary" @click="initialize">开始搜索</v-btn> -->
            </v-subheader>
          </v-flex>
        </v-layout>
		    <v-layout justify-center wrap>
          <!-- <v-flex xs12 lg10>
            <v-layout row wrap>
              <v-flex xs6 sm3 lg2><v-checkbox v-model="searchFilter.isDecoration" :label="`${searchFilter.isDecoration?'可':'不可'}自行装修`" hide-details></v-checkbox></v-flex>
              <v-flex xs6 sm3 lg2><v-checkbox v-model="searchFilter.isOfficeFurniture" :label="`${searchFilter.isOfficeFurniture?'含':'不含'}办公家具`" hide-details></v-checkbox></v-flex>
              <v-flex xs6 sm3 lg2><v-checkbox v-model="searchFilter.isRegister" :label="`${searchFilter.isRegister?'已':'暂无'}注册`" hide-details></v-checkbox></v-flex>
              <v-flex xs6 sm3 lg2><v-checkbox v-model="searchFilter.isFireProcedure" :label="`${searchFilter.isFireProcedure?'已有':'暂无'}消防手续`" hide-details></v-checkbox></v-flex>
            </v-layout>
          </v-flex> -->
          <v-flex xs12 lg10>
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
                :items="houseArr"
                item-key="houseNo"
                :loading="networkLoading"
                :no-data-text="networkError?`网络出现异常 - 检查网络后刷新重试`:`暂无记录`"
                :no-results-text="`没能找到“${ search }”的结果...`"
              >
                <template slot="items" slot-scope="props">
                  <td>{{ props.item.floorNumber }}</td>
                  <td>{{ props.item.doorNumber }}</td>
                  <td>{{ props.item.buildArea }}</td>
                  <td>{{ props.item.houseType }}</td>
                  <td>{{ props.item.resourceStatus }}</td>
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
    searchFilter: {
      isDecoration: ""
    },
    search: "",
    headers: [
      { text: "楼层", value: "floorNumber" },
      { text: "门牌号", value: "doorNumber" },
      { text: "建筑面积(m²)", value: "buildArea" },
      { text: "房源类型", value: "houseType" },
      { text: "房源状态", value: "resourceStatus" },
      { text: "操作", value: "houseNo", sortable: false }
    ],
    networkLoading: false,
    networkError: null,
    houseArr: []
  }),
  created() {
    this.$store.commit("changeToolBarTitle", "搜索房源");
    this.initialize();
  },
  methods: {
    initialize() {
      this.networkLoading = true;
      this.networkError = null;
      this.houseArr = [];
      this.$http
        .post("/cms/houseInfo/listHouseInfo.json", {})
        .then(res => {
          this.networkLoading = false;
          let hData = res.data.data;
          this.houseArr = hData && hData.length ? hData : [];
        })
        .catch(err => {
          this.networkLoading = false;
          this.networkError = true;
          this.$store.commit("addSnackBar", `失败${err}`, "error");
        });
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
  height 400px;
  line-height 400px;
  text-align: center;
}
</style>
