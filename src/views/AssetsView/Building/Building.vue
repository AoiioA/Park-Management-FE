<template>
  <div class="fill-height building">
    <view-tool-bar
      :barTitle="viewToolBarTitle"
      :barTab="viewToolBarTab"
    >
      <span slot="bar-menu">
        <v-btn flat>添加楼宇</v-btn>
        <v-btn icon>
          <v-icon>help</v-icon>
        </v-btn>
      </span>
    </view-tool-bar>
    <v-progress-circular v-if="loading" :size="48" indeterminate color="primary" class="loading"></v-progress-circular>
    <v-alert :value="!loading&&error" type="error">网络出现异常 - 检查网络后刷新重试</v-alert>
    <router-view v-if="!loading&&!error"></router-view>
  </div>
</template>

<script>
import ViewToolBar from "@/components/ViewToolBar.vue";

export default {
  components: {
    ViewToolBar
  },
  props: ["viewToolBarTitle"],
  data: () => ({
    loading: false,
    error: null,
    viewToolBarTab: []
  }),
  created() {
    this.initialize();
  },
  watch: {
    $route: "initialize"
  },
  methods: {
    initialize() {
      this.loading = true;
      this.error = null;

      this.$http
        .post("/cms/houseInfoa/list.json")
        .then(res => {
          this.loading = false;

          let resData = res.data.data;
          let buildingArr = resData && resData.length ? resData : [];
          this.viewToolBarTab = buildingArr.map(el => ({
            name: el.name,
            to: {
              name: "building-detail",
              params: { buildingId: el.buildingId }
            }
          }));

          if (this.$route.fullPath == "/building") {
            this.$router.push({
              name: "building-detail",
              params: { buildingId: 1 }
            });
          }
        })
        .catch(() => {
          this.loading = false;
          // this.error = true;

          this.viewToolBarTab = [
            {
              name: "望京SOHO",
              to: { name: "building-detail", params: { buildingId: 1 } }
            },
            {
              name: "利星行中心",
              to: { name: "building-detail", params: { buildingId: 2 } }
            }
          ];
        });
    }
  }
};
</script>
<style lang="stylus" scoped>
.building {
  position: relative;

  .loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
