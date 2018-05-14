<template>
  <div class="building-detail">
    <v-jumbotron color="blue-grey lighten-4" height="auto">
      <v-container grid-list-xl fill-height>
        <v-layout align-start align-content-start wrap>
          <v-flex xs12>
            <v-data-iterator
              content-tag="v-layout"
              column
              wrap
              :items="houseInfoArr"
              :rows-per-page-items="['']"
              :pagination.sync="pagination"
            >
              <v-flex
                slot="item"
                slot-scope="props"
                xs12
              >
                <v-card>111</v-card>
              </v-flex>
              <v-flex slot="no-data" style="height: 246px; line-height: 246px;">
                <v-progress-circular indeterminate color="primary" v-if="networkLoading"></v-progress-circular>
                <div v-else-if="networkError">网络出现异常 - 检查网络后刷新重试</div>
                <div v-else>暂无房屋记录</div>
              </v-flex>
            </v-data-iterator>
          </v-flex>
        </v-layout>
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
      rowsPerPage: 5
    }
  }),
  mounted() {
    this.initialize();
  },
  watch: {
    $route: "initialize"
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
    }
  }
};
</script>
<style lang="stylus" scoped></style>
