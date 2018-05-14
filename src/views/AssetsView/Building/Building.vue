<template>
  <div class="fill-height building">
    <view-tool-bar
      :barTitle="viewToolBarTitle"
      :barTab="viewToolBarTab"
    >
      <span slot="bar-menu">
        <v-btn flat onclick="alert('Add building~')">添加楼宇</v-btn>
        <v-btn icon>
          <v-icon>help</v-icon>
        </v-btn>
      </span>
    </view-tool-bar>
    <v-progress-circular v-if="loading" :size="48" indeterminate color="primary" class="building-center"></v-progress-circular>
    <v-alert v-else-if="error" :value="true" type="error">网络出现异常 - 检查网络后刷新重试</v-alert>
    <p v-else-if="viewToolBarTab.length==0" class="building-center">暂无楼宇记录 - <a onclick="alert('Add building~')">点击此处添加</a></p>
    <router-view v-else></router-view>
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
        .post("/cms/houseInfo/list.json")
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

          if (
            this.$route.fullPath == "/building" &&
            this.viewToolBarTab.length
          ) {
            this.$router.push(this.viewToolBarTab[0].to);
          }
        })
        .catch(() => {
          this.loading = false;
          this.error = true;
        });
    }
  }
};
</script>
<style lang="stylus" scoped>
.building {
  position: relative;

  .building-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
