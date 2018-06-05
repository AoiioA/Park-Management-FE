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
    <v-jumbotron color="blue-grey lighten-4" height="auto">
      <v-progress-linear v-if="networkLoading" :size="48" indeterminate class="my-0"></v-progress-linear>
      <v-alert v-else-if="networkError" :value="true" type="error">网络出现异常 - 检查网络后刷新重试</v-alert>
      <div v-else-if="houseArr.length==0" class="no-data">暂无房源记录 - <a>点击此处添加</a></div>
      <v-container v-else grid-list-xl>
        <v-layout justify-center align-center column>
          <v-flex xs12 lg10>
            <v-subheader class="px-0">
              <v-btn depressed color="primary" @click="initialize">search</v-btn>
            </v-subheader>
          </v-flex>
        </v-layout>
        <v-layout justify-center align-center column>
          <v-flex xs12 lg10></v-flex>
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
    networkLoading: false,
    networkError: null,
    houseArr: [],
    houseId: 1
  }),
  created() {
    this.$store.commit("changeToolBarTitle", "搜索房源");
    // this.initialize();
  },
  methods: {
    initialize() {
      this.networkLoading = true;
      this.networkError = null;
      this.houseArr = [];
      this.$http
        .post("/cms/houseInfo/list.json", {
          houseId: this.houseId
        })
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
        path: "/house/house-detail",
        query: { houseId: houseId }
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
