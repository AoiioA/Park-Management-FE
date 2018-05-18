<template>
  <div class="fill-height building">
    <view-tool-bar
      :barTitle="viewToolBarTitle"
      :barTab="viewToolBarTab"
    >
      <span slot="bar-menu">
        <v-dialog v-model="newBuildingDialog" max-width="500px">
          <v-btn flat slot="activator">添加楼宇</v-btn>
          <v-card>
            <v-card-title>
              <span class="headline">添加楼宇</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm6 md4>
                    <v-text-field v-model="editedBuilding.aaa" label="aaa"></v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click.native="dialogClose">取消</v-btn>
              <v-btn color="blue darken-1" flat @click.native="dialogSave">添加</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-btn icon>
          <v-icon>help</v-icon>
        </v-btn>
      </span>
    </view-tool-bar>
    <v-progress-linear v-if="loading" :size="48" indeterminate class="my-0"></v-progress-linear>
    <v-alert v-else-if="error" :value="true" type="error">网络出现异常 - 检查网络后刷新重试</v-alert>
    <p v-else-if="viewToolBarTab.length==0" class="building-center">暂无楼宇记录 - <a @click.native="addSnackBar('假装添加楼宇成功~', 'success')">点击此处添加</a></p>
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
    viewToolBarTab: [],
    newBuildingDialog: false,
    editedBuilding: {
      aaa: "",
      bbb: "",
      ccc: "",
      ddd: "",
      eee: ""
    },
    defaultBuilding: {
      aaa: "",
      bbb: "",
      ccc: "",
      ddd: "",
      eee: ""
    }
  }),
  created() {
    this.initialize();
    this.$store.commit("changeToolBarTitle", this.viewToolBarTitle);
  },
  watch: {
    $route() {
      if (this.viewToolBarTab.length == 0) this.initialize();
    },
    newBuildingDialog: val => val || this.dialogClose()
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
    dialogClose() {
      if (confirm("取消后内容将不会保存")) {
        this.newBuildingDialog = false;
        setTimeout(() => {
          this.editedBuilding = Object.assign({}, this.defaultBuilding);
        }, 300);
      }
    },
    dialogSave() {
      this.dialogClose();
      this.addSnackBar("假装添加楼宇成功~", "success");
    },
    addSnackBar(text, type) {
      this.$store.commit("addSnackBar", text, type);
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
