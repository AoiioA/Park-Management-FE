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
      <v-container grid-list-xl>
        <v-layout justify-center align-center column>
          <v-flex xs12 lg10>
            <v-subheader class="px-0">
              <v-btn depressed color="primary" @click="linkToDetail(houseId)">search</v-btn>
            </v-subheader>
          </v-flex>
          <v-flex xs12 lg10>
            <v-progress-circular v-if="loading" :size="48" indeterminate class="my-0 house-center"></v-progress-circular>
            <v-alert v-else-if="error" :value="true" type="error">网络出现异常 - 检查网络后刷新重试</v-alert>
            <p v-else-if="houseArr.length==0" class="house-center">暂无房源记录 - <a>点击此处添加</a></p>
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
    loading: false,
    error: null,
    houseArr: [],
    houseId: 1
  }),
  created() {
    this.$store.commit("changeToolBarTitle", "搜索房源");
    this.initialize();
  },
  methods: {
    initialize() {
      this.networkLoading = true;
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
