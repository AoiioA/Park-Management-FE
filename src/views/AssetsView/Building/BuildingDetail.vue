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
              :items="parkInfoList"
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
                <div v-else>暂无园区记录 - 点击左侧添加</div>
              </v-flex>
            </v-data-iterator>
          </v-flex>
        </v-layout>
      </v-container>
    </v-jumbotron>
  </div>
</template>
<script>
export default {
  data: () => ({
    networkLoading: false,
    networkError: false,
    parkInfoList: [],
    newParkInfo: {
      parkName: { text: "园区名称", value: "" },
      acreage: { text: "面积(m²)", value: "" },
      buildingNumber: { text: "建筑数量", value: "" },
      fullAddress: { text: "地址", value: "" },
      environment: { text: "环境描述", value: "" }
    },
    pagination: {
      rowsPerPage: 3
    }
  }),
  mounted() {
    this.initialize();
  },
  methods: {
    initialize() {
      this.networkLoading = true;
      this.$http
        .post("/cms/parkInfo/list.json")
        .then(res => {
          this.networkLoading = false;

          let resData = res.data.data;
          this.parkInfoList = resData && resData.length ? resData : [];
        })
        .catch(() => {
          this.networkLoading = false;
          this.networkError = true;
        });
    }
  }
};
</script>
<style lang="stylus" scoped></style>
