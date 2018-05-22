<template>
  <div class="fill-height building">
    <view-tool-bar
      :barTitle="viewToolBarTitle"
      :barTab="viewToolBarTab"
    >
      <span slot="bar-menu">
        <v-dialog v-model="newBuildingDialog" max-width="300px" persistent>
          <v-btn flat slot="activator">添加楼宇</v-btn>
          <v-form ref="newBuildingForm" v-model="newBuildingValid" lazy-validation>
            <v-card>
              <v-card-title>
                <span class="headline">新楼宇即将添加</span>
              </v-card-title>
              <v-card-text>
                <v-container grid-list-xs>
                  <v-layout wrap>
                    <v-flex xs12>
                      <v-text-field
                        v-model="editedBuilding.buildingName"
                        :rules="[$store.state.rules.required]"
                        label="楼宇名称"
                        hint="如 : 望京SOHO"
                        persistent-hint
                        required
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                      <v-select
                        v-model="editedBuilding.parkId"
                        :items="parkArr"
                        item-text="parkName"
                        item-value="parkId"
                        label="所属园区"
                        hint="您可以在稍后选择或修改"
                        persistent-hint
                        autocomplete
                      ></v-select>
                    </v-flex>
                  </v-layout>
                </v-container>
                <small class="px-1 red--text text--accent-2">*&nbsp;标记为必填项</small>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn depressed @click="newBuildingClose(true)">取消操作</v-btn>
                <v-btn :disabled="!newBuildingValid" @click="newBuildingSave" depressed color="primary">确认添加</v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
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
import "@/mock/building-mock";
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
    newBuildingValid: true,
    editedBuilding: {
      buildingName: "",
      park: ""
    },
    defaultBuilding: {
      buildingName: "",
      parkId: ""
    },
    parkArr: [
      { parkName: "Reading", parkId: "Read" },
      { parkName: "Writing", parkId: "Write" },
      { parkName: "Coding", parkId: "Code" }
    ]
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
    newBuildingClose(isCancel) {
      if (!isCancel || confirm("取消后内容将不会保存")) {
        this.editedBuilding = Object.assign({}, this.defaultBuilding);
        this.$refs.newBuildingForm.reset();
        this.newBuildingDialog = false;
      }
    },
    newBuildingSave() {
      if (this.$refs.newBuildingForm.validate()) {
        this.newBuildingClose(false);
        this.addSnackBar("假装添加楼宇成功~", "success");
      }
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
