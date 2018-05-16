<template>
  <div class="fill-height building">
    <view-tool-bar
      :barTitle="viewToolBarTitle"
      :barTab="viewToolBarTab"
    >
      <span slot="bar-menu">
        <v-btn flat @click.native="addSnackBar('假装添加楼宇成功~', 'success')">添加楼宇</v-btn>
        <v-btn icon>
          <v-icon>help</v-icon>
        </v-btn>
      </span>
    </view-tool-bar>
    <v-progress-linear v-if="loading" :size="48" indeterminate class="my-0"></v-progress-linear>
    <v-alert v-else-if="error" :value="true" type="error">网络出现异常 - 检查网络后刷新重试</v-alert>
    <p v-else-if="viewToolBarTab.length==0" class="building-center">暂无楼宇记录 - <a @click.native="addSnackBar('假装添加楼宇成功~', 'success')">点击此处添加</a></p>
    <router-view v-else></router-view>
    <v-container style="width:initial;position:fixed;right:0;bottom:54px;z-index:3" grid-list-md>
      <v-layout column reverse wrap align-end>
        <v-flex
          v-for="(snackItem, index) in $store.state.snackbar"
          :key="index"
          tag="v-snackbar"
          v-model="snackItem.value"
          :color="snackItem.color"
          style="position:static;"
        >
          {{ snackItem.text }}<v-btn flat color="pink" @click.native="closeSnackBar(index)">OK</v-btn>
        </v-flex>
      </v-layout>
    </v-container>
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
    this.$store.commit("changeToolBarTitle", this.viewToolBarTitle);
  },
  watch: {
    $route() {
      if (this.viewToolBarTab.length == 0) this.initialize();
    }
  },
  methods: {
    initialize() {
      this.loading = true;
      this.error = null;

      this.$http
        .post("/cms/buildingInfo/list.json", { delFlag: 1 })
        .then(res => {
          this.loading = false;

          let resData = res.data.data;
          let buildingArr = resData && resData.length ? resData : [];

          this.viewToolBarTab = buildingArr.map(el => ({
            name: el.buildingName,
            to: {
              name: "building-detail",
              params: { buildingId: el.buildingId }
            }
          }));

          if (
            "/building/".indexOf(this.$route.fullPath) > -1 &&
            this.viewToolBarTab.length
          ) {
            this.$router.push(this.viewToolBarTab[0].to);
          }
        })
        .catch(() => {
          this.loading = false;
          this.error = true;
        });
    },
    addSnackBar(text, type) {
      this.$store.commit("addSnackBar", text, type);
    },
    closeSnackBar(index) {
      this.$store.commit("closeSnackBar", index);
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
