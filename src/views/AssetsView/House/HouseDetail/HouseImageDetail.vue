<template>
  <v-jumbotron height="auto">
    <v-progress-linear v-if="networkLoading" indeterminate class="my-0"></v-progress-linear>
    <!-- <v-alert v-else-if="networkError" :value="true" type="error">网络出现异常 - 检查网络后刷新重试</v-alert> -->
    <!-- <div v-else-if="houseImageList.length==0" class="no-data">暂无图片 - <a @click.native="1">点击此处添加</a></div> -->
    <v-container v-else grid-list-xs fluid class="px-4 py-4">
      <v-layout row wrap>
        <v-flex v-for="houseImage in houseImageList" :key="houseImage.name" xs12 sm4 md3 xl2>
          <v-card flat>
            <v-card-media
              :src="`http://122.115.50.65/filesystem/2/${$route.params.houseNo}/${houseImage.name}`"
              height="200px"
            ></v-card-media>
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
    houseImageList: []
  }),
  created() {
    this.initialize();
  },
  methods: {
    initialize() {
      this.networkLoading = true;
      this.houseImageList = [];
      this.$http
        .post("/cms/houseInfo/queryInfoByHouseNo.json", {
          houseNo: this.$route.params.houseNo
        })
        .then(res => {
          this.networkLoading = false;
          let resData = res.data.data;
          this.houseImageList = resData;
        })
        .catch(err => {
          this.networkLoading = false;
          this.networkError = true;
          this.$store.commit("addSnackBar", `房源图片查询失败 ${err}`, "error");
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
