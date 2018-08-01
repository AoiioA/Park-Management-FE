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
    <v-jumbotron height="auto">
      <v-container grid-list-xl>
        <v-layout justify-center wrap>
          <v-flex xs12 xl10>
            <v-subheader>
              筛选搜索您想要的房源
              <v-spacer></v-spacer>
              <!-- <v-btn depressed color="primary" @click="initialize">开始搜索</v-btn> -->
            </v-subheader>
            <v-form ref="searchHouseForm" v-model="searchHouseValid" lazy-validation>
              <v-layout row wrap align-center>
                <v-flex xs6 sm3 lg2 style="min-width: 160px;">
                  <v-menu v-model="menu.buildingMenu" :close-on-content-click="false">
                    <v-text-field slot="activator" :value="searchFilterData.buildingName" label="所属楼宇" solo readonly hide-details></v-text-field>
                    <v-list style="max-height: 200px; overflow-y: auto;">
                      <v-list-tile v-if="!assetsInfo.length">
                        <v-list-tile-title>暂无楼宇可选择</v-list-tile-title>
                      </v-list-tile>
                      <div v-else>
                        <v-list-tile @click="changeBuilding('', '全部楼宇')">
                          <v-list-tile-title>全部楼宇</v-list-tile-title>
                        </v-list-tile>
                        <v-menu v-for="(assetsPark, i) in assetsInfo" :key="i" offset-x style="display:block">
                          <v-list-tile slot="activator" @click="1">
                            <v-list-tile-title>{{ assetsPark.parkName }}</v-list-tile-title>
                          </v-list-tile>
                          <v-list style="max-height: 200px; overflow-y: auto;">
                            <v-list-tile v-for="(assetsBuilding, j) in assetsPark.building" :key="j" @click="changeBuilding(assetsBuilding.buildingNo, assetsBuilding.buildingName)">
                              <v-list-tile-title>{{ assetsBuilding.buildingName }}</v-list-tile-title>
                            </v-list-tile>
                          </v-list>
                        </v-menu>
                      </div>
                    </v-list>
                  </v-menu>
                </v-flex>
                <v-flex xs6 sm3 lg2 style="min-width: 160px;"><v-select v-model="searchFilter.resourceStatus" :items="searchFilterData.resourceStatus" label="租赁情况" solo hide-details clearable></v-select></v-flex>
                <v-flex xs12 sm6 lg4>
                  <v-container fill-height fluid grid-list-xs class="pa-0">
                    <v-layout row no-wrap align-center>
                      <v-flex style="width: 50%"><v-text-field v-model.number="searchFilter.buildAreaMin" mask="#####" suffix="m²" :rules="[$store.state.rules.nonnegative]" label="最小面积" solo hide-details></v-text-field></v-flex>
                      <v-flex class="text-xs-center" style="flex:none">至</v-flex>
                      <v-flex style="width: 50%"><v-text-field v-model.number="searchFilter.buildAreaMax" mask="#####" suffix="m²" :rules="[$store.state.rules.nonnegative]" label="最大面积" solo hide-details></v-text-field></v-flex>
                    </v-layout>
                  </v-container>
                </v-flex>
                <v-flex xs6 sm3 lg2 style="min-width: 160px;"><v-select v-model="searchFilter.decorationSituation" :items="searchFilterData.decorationSituation" label="装修情况" solo hide-details clearable></v-select></v-flex>
                <!-- <v-flex xs6 sm3 lg2 style="min-width: 160px;"><v-select v-model="searchFilter.isRegister" :items="searchFilterData.isRegister" label="注册状态" solo hide-details clearable></v-select></v-flex> -->
                <!-- <v-flex xs6 sm3 lg2 style="min-width: 160px;"><v-select v-model="searchFilter.idleLevel" :items="searchFilterData.idleLevel" label="预警状态" solo hide-details clearable></v-select></v-flex> -->
                <v-spacer></v-spacer>
                <v-flex xs12 sm3 lg2><v-btn :disabled="!searchHouseValid||(searchFilter.buildAreaMin>searchFilter.buildAreaMax)" @click="initialize" block large color="primary">开始搜索</v-btn></v-flex>
              </v-layout>
            </v-form>
          </v-flex>
          <v-flex xs12 xl10>
            <v-card>
              <v-toolbar flat color="white">
                <span class="subheading">发现{{ totalItems }}处房源</span>
                <v-spacer></v-spacer>
                <v-menu v-if="tableActionMode=='view'" v-model="menu.tableMoreDialog" :close-on-content-click="false" offset-y left :nudge-bottom="10">
                  <v-btn slot="activator" icon>
                    <v-icon>more_vert</v-icon>
                  </v-btn>
                  <v-list two-line dense>
                    <v-menu offset-x left style="display:block">
                      <v-list-tile slot="activator" @click="1">
                        <v-list-tile-content>
                          <v-list-tile-title>批量导入房源</v-list-tile-title>
                          <v-list-tile-sub-title>下载模板并上传单楼宇房源</v-list-tile-sub-title>
                        </v-list-tile-content>
                      </v-list-tile>
                      <v-list dense>
                        <!-- <v-list-tile :href="`${$store.getters.getBaseUrl}/cms/houseInfo/downloadTemplate.do`"> -->
                        <v-list-tile @click="menu.tableMoreDialog=false;downloadExcel()">
                          <v-list-tile-title>下载Excel模板</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="menu.tableMoreDialog=false;menu.uploadDialog=true;">
                          <v-list-tile-title>上传Excel文件</v-list-tile-title>
                        </v-list-tile>
                        <v-dialog v-model="menu.uploadDialog" persistent max-width="290">
                          <v-card>
                            <v-card-title class="headline">选择房源所属楼宇</v-card-title>
                            <v-card-text>
                              <v-layout column>
                                <v-flex xs12>
                                  <v-form ref="uploadForm" v-model="uploadValid" lazy-validation>
                                    <v-menu v-model="menu.uploadMenu" :close-on-content-click="false" offset-y nudge-top="20" style="display:block;">
                                      <v-text-field slot="activator" :value="uploadInfo.buildingName" :rules="[$store.state.rules.required]" label="所属楼宇" readonly required></v-text-field>
                                      <v-list style="max-height: 200px; overflow-y: auto;">
                                        <v-list-tile v-if="!assetsInfo.length">
                                          <v-list-tile-title>暂无楼宇可选择</v-list-tile-title>
                                        </v-list-tile>
                                        <v-menu v-else v-for="(assetsPark, i) in assetsInfo" :key="i" offset-x style="display:block">
                                          <v-list-tile slot="activator" @click="1">
                                            <v-list-tile-title>{{ assetsPark.parkName }}</v-list-tile-title>
                                          </v-list-tile>
                                          <v-list style="max-height: 200px; overflow-y: auto;">
                                            <v-list-tile v-for="(assetsBuilding, j) in assetsPark.building" :key="j" @click="changeUploadInfo(assetsBuilding.buildingNo, assetsBuilding.buildingName)">
                                              <v-list-tile-title>{{ assetsBuilding.buildingName }}</v-list-tile-title>
                                            </v-list-tile>
                                          </v-list>
                                        </v-menu>
                                      </v-list>
                                    </v-menu>
                                    <v-text-field @click="$refs.uploadEl.$el.click()" :value="uploadInfo.fileList[0]&&uploadInfo.fileList[0].name" :rules="[$store.state.rules.required]" label="选择文件" readonly required></v-text-field>
                                    <file-upload
                                      ref="uploadEl"
                                      v-model="uploadInfo.fileList"
                                      :post-action="`${$store.getters.getBaseUrl}${upload.postAction}`"
                                      :data="{ buildingNo: uploadInfo.buildingNo }"
                                      :accept="upload.accept"
                                      :extensions="upload.extensions"
                                      :size="upload.size || 0"
                                      :multiple="upload.multiple"
                                      :thread="upload.thread < 1 ? 1 : (upload.thread > 5 ? 5 : upload.thread)"
                                      :directory="upload.directory"
                                      :drop-directory="upload.dropDirectory"
                                      @input-filter="inputFilter"
                                      @input-file="inputFile"
                                    >
                                    </file-upload>
                                  </v-form>
                                </v-flex>
                              </v-layout>
                            </v-card-text>
                            <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn flat @click.native="menu.uploadDialog = false">取消操作</v-btn>
                              <v-btn :disabled="!uploadValid||!uploadInfo.fileList.length" @click.native="uploadFile" :loading="$refs.uploadEl && $refs.uploadEl.active" color="primary" flat>确认上传</v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-dialog>
                      </v-list>
                    </v-menu>
                    <v-list-tile @click="menu.tableMoreDialog=false;tableActionMode='export';">
                      <v-list-tile-content>
                        <v-list-tile-title>批量导出房源</v-list-tile-title>
                        <v-list-tile-sub-title>选择房源并导出至Excel</v-list-tile-sub-title>
                      </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile @click="menu.tableMoreDialog=false;tableActionMode='delete';">
                      <v-list-tile-content>
                        <v-list-tile-title>批量删除房源</v-list-tile-title>
                        <v-list-tile-sub-title>选择房源并删除记录</v-list-tile-sub-title>
                      </v-list-tile-content>
                    </v-list-tile>
                  </v-list>
                </v-menu>
                <v-tooltip bottom v-if="tableActionMode=='export'">
                  <v-btn slot="activator" :disabled="!selected.length" @click="batchExportHouse" icon flat color="primary">
                    <v-icon>get_app</v-icon>
                  </v-btn>
                  <span>确认导出</span>
                </v-tooltip>
                <v-tooltip bottom v-if="tableActionMode=='delete'">
                  <v-dialog slot="activator" :disabled="!selected.length" v-model="menu.delDialog" persistent max-width="290">
                    <v-btn slot="activator" :disabled="!selected.length" icon flat color="error">
                      <v-icon>delete_outline</v-icon>
                    </v-btn>
                    <v-card>
                      <v-card-title class="headline">确认删除房源?</v-card-title>
                      <v-card-text>请谨慎操作。</v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" flat @click.native="menu.delDialog = false">再看看</v-btn>
                        <v-btn color="error" flat @click.native="batchDeleteHouse">我确认</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                  <span>确认删除</span>
                </v-tooltip>
                <v-tooltip bottom v-if="tableActionMode!='view'">
                  <v-btn slot="activator" @click="tableActionMode='view';selected = [];" icon>
                    <v-icon>clear</v-icon>
                  </v-btn>
                  <span>取消操作</span>
                </v-tooltip>
              </v-toolbar>
              <v-divider></v-divider>
              <v-data-table
                v-model="selected"
                :headers="headers"
                :items="getTableData(houseInfoArr)"
                item-key="houseNo"
                :pagination.sync="pagination"
                :total-items="totalItems"
                :loading="networkLoading"
                :no-data-text="networkError?`网络出现异常 - 检查网络后刷新重试`:`暂无记录`"
                :select-all="tableActionMode!='view'"
              >
                <template slot="items" slot-scope="props">
                  <td v-if="tableActionMode!='view'">
                    <v-checkbox
                      v-model="props.selected"
                      color="primary"
                      hide-details
                    ></v-checkbox>
                  </td>
                  <td>{{ props.item.buildingName }}</td>
                  <td>{{ props.item.floorNumber }}</td>
                  <td>{{ props.item.doorNumber }}</td>
                  <td>{{ props.item.buildArea }}</td>
                  <td>{{ props.item.decorationSituation }}</td>
                  <!-- <td>{{ props.item.houseType }}</td> -->
                  <td>{{ props.item.resourceStatus }}</td>
                  <td>{{ props.item.idleDays }}</td>
                  <td class="px-3">
                    <v-btn icon class="mx-0" :to="{ name: 'house-detail', params: { houseNo: props.item.houseNo } }">
                      <v-icon color="primary">visibility</v-icon>
                    </v-btn>
                  </td>
                </template>
              </v-data-table>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-jumbotron>
  </div>
</template>

<script>
import FileUpload from "vue-upload-component";
import ViewToolBar from "@/components/ViewToolBar.vue";

export default {
  components: {
    FileUpload,
    ViewToolBar
  },
  data: () => ({
    searchHouseValid: true,
    searchFilter: {
      buildingNo: "",
      buildAreaMin: "",
      buildAreaMax: "",
      resourceStatus: "",
      decorationSituation: "",
      isRegister: "",
      idleLevel: ""
    },
    searchFilterData: {
      buildingName: "",
      resourceStatus: [
        { text: "空置中", value: 0 },
        { text: "出租中", value: 1 },
        { text: "已预定", value: 2 },
        { text: "维护中", value: 3 },
        { text: "租赁审核", value: 4 }
      ],
      decorationSituation: [
        { text: "毛坯", value: 0 },
        { text: "简装修", value: 1 },
        { text: "中等装修", value: 2 },
        { text: "豪华装修", value: 3 },
        { text: "精装修", value: 4 }
      ],
      isRegister: [
        { text: "可注册", value: 1 },
        { text: "不可注册", value: 0 }
      ],
      idleLevel: [
        { text: "30天内", value: 1 },
        { text: "30-60天", value: 2 },
        { text: "60-90天", value: 3 }
      ]
    },
    menu: {
      buildingMenu: false,
      tableMoreDialog: false,
      uploadDialog: false,
      uploadMenu: false,
      delDialog: false
    },
    assetsInfo: [],
    // 表格相关
    houseInfoArr: [],
    houseType: ["整租", "工位"],
    resourceStatus: [
      "空置房源",
      "租赁中房源",
      "预定房源",
      "维护房源",
      "租赁审核房源"
    ],
    decorationSituation: ["毛坯", "简装修", "中等装修", "豪华装修", "精装修"],
    networkLoading: false,
    networkError: null,
    pagination: {},
    totalItems: 0,
    tableActionMode: "view",
    headers: [
      { text: "楼宇", value: "buildingName" },
      { text: "楼层", value: "floorNumber" },
      { text: "门牌号", value: "doorNumber" },
      { text: "建筑面积", value: "buildArea" },
      { text: "装修情况", value: "decorationSituation" },
      // { text: "房源类型", value: "houseType" },
      { text: "房源状态", value: "resourceStatus" },
      { text: "空置天数", value: "idleDays" },
      { text: "操作", value: "houseNo", sortable: false }
    ],
    search: "",
    selected: [],
    upload: {
      postAction: "/cms/houseInfo/excelImport",
      accept: "",
      extensions: /\.(xls?x)$/i,
      size: 1024 * 1024 * 2,
      multiple: false,
      thread: 1,
      directory: false,
      dropDirectory: false
    },
    uploadValid: true,
    uploadInfo: {
      buildingName: "",
      buildingNo: "",
      fileList: []
    }
  }),
  watch: {
    pagination: {
      handler() {
        this.initialize();
      },
      deep: true
    }
  },
  created() {
    this.$store.commit("changeToolBarTitle", { title: "房源概览" });
  },
  mounted() {
    this.initialize();
  },
  methods: {
    initialize() {
      if (this.$refs.searchHouseForm.validate()) {
        this.networkLoading = true;
        this.networkError = null;
        let paramsData = {};
        for (const key in this.searchFilter) {
          if (this.searchFilter.hasOwnProperty(key)) {
            if (this.searchFilter[key] !== "") {
              paramsData[key] = this.searchFilter[key];
            }
          }
        }
        paramsData = Object.assign(paramsData, {
          limit: this.pagination.rowsPerPage,
          page: this.pagination.page
        });
        this.$http
          .all([
            this.$http.post("/cms/AssetsInfo/park.json"),
            this.$http.post("/cms/houseInfo/listHouseInfo.json", paramsData)
          ])
          .then(
            this.$http.spread((building, house) => {
              if (building.data.code == 500) {
                throw new Error(building.data.msg);
              } else if (house.data.code == 500) {
                throw new Error(house.data.msg);
              } else {
                this.totalItems = house.data.count;
                let bData = building.data.data;
                let hData = house.data.data;
                this.buildingInfoArr = bData && bData.length ? bData : [];
                this.houseInfoArr = hData && hData.length ? hData : [];
                this.assetsInfo = this.translateAssets(this.buildingInfoArr);
              }
            })
          )
          .catch(err => {
            this.networkError = true;
            this.$store.commit("addErrorBar", `房源搜索失败 ${err}`);
          })
          .finally(() => (this.networkLoading = false));
      }
    },
    translateAssets(assetsData) {
      // 将List形式的数据转换为Tree形式并存入assetsInfo
      let parkInfo = [];
      assetsData.forEach(item => {
        if (item.parkNo === null) {
          item.parkNo = 0;
          item.parkName = "无归属楼宇";
        }
        if (!parkInfo[item.parkNo]) {
          parkInfo[item.parkNo] = {
            parkNo: item.parkNo,
            parkName: item.parkName,
            building: []
          };
        }
        parkInfo[item.parkNo].building.push({
          buildingNo: item.buildingNo,
          buildingName: item.buildingName
        });
      });
      return parkInfo.filter(el => el);
    },
    changeBuilding(buildingNo, buildingName) {
      // 关闭菜单
      this.menu.buildingMenu = false;
      this.searchFilterData.buildingName = buildingName;
      this.searchFilter.buildingNo = buildingNo;
    },
    getTableData(houseInfoArr) {
      let houseList = [];
      houseInfoArr.map(house =>
        houseList.push({
          houseId: house.houseId,
          houseNo: house.houseNo,
          buildingName: this.buildingInfoArr.find(
            item => item.buildingNo == house.buildingNo
          ).buildingName,
          floorNumber: `${(n => {
            return n >= 0 ? n : "地下" + Math.abs(n);
          })(house.floorNumber)}层`,
          doorNumber: `${house.doorNumber}室`,
          buildArea: `${house.buildArea}m²`,
          decorationSituation: this.decorationSituation[
            house.decorationSituation
          ],
          houseType: this.houseType[house.houseType],
          resourceStatus: this.resourceStatus[house.resourceStatus],
          idleDays: `${house.idleDays}天`
        })
      );
      return houseList;
    },
    changeUploadInfo(buildingNo, buildingName) {
      this.menu.uploadMenu = false;
      this.uploadInfo.buildingNo = buildingNo;
      this.uploadInfo.buildingName = buildingName;
    },
    uploadFile() {
      if (this.$refs.uploadForm.validate()) {
        this.$refs.uploadEl.active = true;
      }
    },
    inputFilter(newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        // 添加文件前
        // 过滤系统文件 和隐藏文件
        if (/(\/|^)(Thumbs\.db|desktop\.ini|\..+)$/.test(newFile.name)) {
          return prevent();
        }
        // 过滤 php html js 文件
        if (/\.(php5?|html?|jsx?)$/i.test(newFile.name)) {
          return prevent();
        }
      }
    },
    inputFile(newFile, oldFile) {
      if (newFile) {
        // 上传错误
        if (newFile.error && !oldFile.error) {
          // console.log("error", newFile.error, newFile, newFile.xhr.response);
          this.$store.commit("addErrorBar", `Excel上传失败 ${newFile.error}`);
        }

        // 上传成功
        if (newFile.success && !oldFile.success) {
          let res = JSON.parse(newFile.xhr.response);
          if (res.code == 0) {
            this.$store.commit("addSuccessBar", `Excel上传成功 ${res.data}`);
            this.menu.uploadDialog = false;
            this.initialize();
          } else {
            this.$store.commit("addErrorBar", `Excel上传失败 ${res.msg}`);
          }
        }
      }
      // 自动上传
      // if (
      //   Boolean(newFile) !== Boolean(oldFile) ||
      //   oldFile.error !== newFile.error
      // ) {
      //   if (!this.$refs.uploadEl.active) {
      //     this.$refs.uploadEl.active = true;
      //   }
      // }
    },
    batchDeleteHouse() {
      if (this.selected.length) {
        this.$http
          .post(
            `/cms/houseInfo/batchDelHouseInfoByHouseNo.json?houseNos=` +
              `${this.selected.map(item => item.houseNo).toString()}`
          )
          .then(res => {
            if (res.data.code != 500) {
              this.$store.commit("addSuccessBar", "批量删除成功");
              this.initialize();
              this.selected = [];
              this.tableActionMode = "view";
            } else {
              throw new Error(res.data.msg);
            }
          })
          .catch(err =>
            this.$store.commit("addErrorBar", `批量删除失败 ${err}`)
          );
      }
    },
    batchExportHouse() {
      if (this.selected.length) {
        this.$http
          .post(
            "/cms/houseInfo/excelExport",
            { ids: this.selected.map(item => item.houseId).toString() },
            { responseType: "blob" }
          )
          .then(res => {
            if (res.data.code != 500) {
              this.createDownloadEl(res);
              this.selected = [];
              this.tableActionMode = "view";
            } else {
              throw new Error(res.data.msg);
            }
          })
          .catch(err =>
            this.$store.commit("addErrorBar", `批量导出失败 ${err}`)
          );
      }
    },
    downloadExcel() {
      this.$http
        .get("/cms/houseInfo/downloadTemplate.do", { responseType: "blob" })
        .then(res => {
          if (res.data.code != 500) {
            this.createDownloadEl(res);
          } else {
            throw new Error(res.data.msg);
          }
        })
        .catch(err =>
          this.$store.commit("addErrorBar", `Excel模板下载失败 ${err}`)
        );
    },
    createDownloadEl(res) {
      const fileName = "房源excel.xlsx";
      // const fileName = res.headers['content-disposition'].split('filename=')[1].split(';')[0] || "";
      const blob = new Blob([res.data]);
      // if ("download" in document.createElement("a")) {
      const imgUrl = window.URL.createObjectURL(blob);
      let link = document.createElement("a");
      link.style.display = "none";
      link.href = imgUrl;
      link.setAttribute("download", fileName);

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(blob);
      // } else {
      //   navigator.msSaveBlob(blob, fileName);
      // }
    }
  }
};
</script>

<style lang="stylus" scoped>
.no-data {
  height: 400px;
  line-height: 400px;
  text-align: center;
}
</style>
