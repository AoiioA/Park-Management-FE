<template>
  <div class="building-detail">
    <v-jumbotron color="blue-grey lighten-4" height="auto">
      <v-container grid-list-xl>
        <v-layout justify-center align-center>
          <v-flex xs12 lg10>
            <v-subheader class="px-0">
              <span style="min-width: 104px" class="mx-2">
                <v-select
                  @change="val => $router.push({ params: { buildingNo: $route.params.buildingNo, buildingDetailType: val } })"
                  :items="houseViewArr"
                  :value="houseView"
                  item-text="text"
                  item-value="value"
                  :hint="`切换房源视图类型`"
                  persistent-hint
                  single-line
                  class="pt-0"
                ></v-select>
              </span>
              <v-spacer></v-spacer>
              <v-btn depressed color="primary">编辑楼宇信息</v-btn>
            </v-subheader>
          </v-flex>
        </v-layout>
        <v-layout v-if="$route.params.buildingDetailType=='table'" align-start align-content-start justify-center wrap>
          <v-flex xs12 lg10>
            <v-card>
              <v-card-title class="py-2">
                <v-text-field
                  flat
                  solo
                  prepend-icon="search"
                  label="在列表中搜索..."
                  v-model="search"
                ></v-text-field>
                <v-tooltip v-if="selected.length" bottom>
                  <v-btn @click="batchDeleteHouse" slot="activator" icon class="mx-0">
                    <v-icon>delete_outline</v-icon>
                  </v-btn>
                  <span>批量删除</span>
                </v-tooltip>
                <v-tooltip v-if="selected.length" bottom>
                  <v-btn @click="batchExportHouse" slot="activator" icon class="mx-0">
                    <v-icon>vertical_align_bottom</v-icon>
                  </v-btn>
                  <span>批量导出至Excel</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <v-btn @click="initialize" slot="activator" icon class="mx-0">
                    <v-icon>refresh</v-icon>
                  </v-btn>
                  <span>刷新数据</span>
                </v-tooltip>
                <v-menu :close-on-content-click="false" offset-y left :nudge-bottom="10">
                  <v-btn slot="activator" icon>
                    <v-icon>more_vert</v-icon>
                  </v-btn>
                  <v-list two-line dense>
                    <v-list-tile @click="$router.push({ name: 'house-new' })">
                      <v-list-tile-content>
                        <v-list-tile-title>添加房源</v-list-tile-title>
                        <v-list-tile-sub-title>添加单个房源</v-list-tile-sub-title>
                      </v-list-tile-content>
                    </v-list-tile>
                    <v-menu offset-x left style="display:block">
                      <v-list-tile slot="activator" @click="1">
                        <v-list-tile-content>
                          <v-list-tile-title>批量导入房源</v-list-tile-title>
                          <v-list-tile-sub-title>通过Excel批量导入</v-list-tile-sub-title>
                        </v-list-tile-content>
                      </v-list-tile>
                      <v-list dense>
                        <v-list-tile href="http://122.115.50.65:8080/cms/houseInfo/downloadTemplate.do">
                        <!-- <v-list-tile @click="downloadExcel"> -->
                          <v-list-tile-title>下载Excel模板</v-list-tile-title>
                        </v-list-tile>

                        <file-upload
                          ref="upload"
                          v-model="newFileList"
                          :data="{ buildingId: buildingInfo.buildingId }"
                          :post-action="upload.postAction"
                          :accept="upload.accept"
                          :extensions="upload.extensions"
                          :size="upload.size || 0"
                          :multiple="upload.multiple"
                          :thread="upload.thread < 1 ? 1 : (upload.thread > 5 ? 5 : upload.thread)"
                          :directory="upload.directory"
                          :drop-directory="upload.dropDirectory"
                          @input-filter="inputFilter"
                          @input-file="inputFile"
                          style="display: block;"
                        >
                          <v-list-tile @click="1">
                            <v-list-tile-title>上传Excel文件</v-list-tile-title>
                          </v-list-tile>
                        </file-upload>
                      </v-list>
                    </v-menu>
                  </v-list>
                </v-menu>
              </v-card-title>
              <v-divider></v-divider>
              <v-data-table
                :search="search"
                :headers="headers"
                :items="getTableData(houseInfoArr)"
                item-key="houseNo"
                v-model="selected"
                :loading="networkLoading"
                :no-data-text="networkError?`网络出现异常 - 检查网络后刷新重试`:`暂无记录`"
                :no-results-text="`没能找到“${ search }”的结果...`"
                select-all
              >
                <template slot="items" slot-scope="props">
                  <td>
                    <v-checkbox
                      v-model="props.selected"
                      color="primary"
                      hide-details
                    ></v-checkbox>
                  </td>
                  <td>{{ props.item.floorNumber }}</td>
                  <td>{{ props.item.doorNumber }}</td>
                  <td>{{ props.item.buildArea }}</td>
                  <td>{{ props.item.houseType }}</td>
                  <td>{{ props.item.resourceStatus }}</td>
                  <td class="px-3">
                    <v-btn icon class="mx-0" :to="{ name: 'house-info-detail', params: { houseNo: props.item.houseNo } }">
                      <v-icon color="primary">visibility</v-icon>
                    </v-btn>
                  </td>
                </template>
              </v-data-table>
            </v-card>
          </v-flex>
        </v-layout>
        <v-data-iterator
          v-else
          :items="houseInfoArr"
          :rows-per-page-items="['']"
          :pagination.sync="pagination"
          content-tag="v-layout"
          row
          wrap
          justify-center
        >
          <v-flex slot="item" slot-scope="props" xs12 lg10>
            <chart
              :options="getOption(props)"
              @click="clickHouse"
              auto-resize
              theme="light"
              style="height:240px;width:100%;"
            ></chart>
          </v-flex>
          <v-flex slot="no-data" class="no-data">
            <v-progress-circular indeterminate color="primary" v-if="networkLoading"></v-progress-circular>
            <span v-else-if="networkError">网络出现异常 - 检查网络后刷新重试</span>
            <span v-else>暂无房源记录</span>
          </v-flex>
        </v-data-iterator>
      </v-container>
    </v-jumbotron>
  </div>
</template>
<script>
import FileUpload from "vue-upload-component";

export default {
  components: {
    FileUpload
  },
  data: () => ({
    networkLoading: false,
    networkError: false,
    buildingInfo: {},
    houseInfoArr: [],
    newHouseInfo: {},
    houseView: "area",
    houseViewArr: [
      {
        text: "面积视图",
        value: "area"
      },
      {
        text: "列表视图",
        value: "table"
      }
    ],
    houseType: ["整租", "工位"],
    houseStatus: ["空置房源", "预定房源", "出租房源", "维护房源"],
    pagination: {
      rowsPerPage: 3
    },
    search: "",
    headers: [
      { text: "楼层", value: "floorNumber" },
      { text: "门牌号", value: "doorNumber" },
      { text: "建筑面积(m²)", value: "buildArea" },
      { text: "房源类型", value: "houseType" },
      { text: "房源状态", value: "resourceStatus" },
      { text: "操作", value: "houseNo", sortable: false }
    ],
    selected: [],
    upload: {
      postAction: "http://122.115.50.65:8080/cms/houseInfo/excelImport",
      accept: "",
      extensions: /\.(xls?x)$/i,
      size: 1024 * 1024 * 2,
      minSize: 128 * 1024,
      multiple: false,
      thread: 1,
      directory: false,
      dropDirectory: false
    },
    newFileList: []
  }),
  watch: {
    $route: "initialize"
  },
  created() {
    this.$store.commit("changeToolBarTitle", "楼宇详情");
    this.houseView =
      this.$route.params.buildingDetailType || this.houseViewArr[0].value;
    this.initialize();
  },
  methods: {
    initialize() {
      this.networkLoading = true;
      this.networkError = null;
      this.buildingInfo = {};
      this.houseInfoArr = [];
      this.$http
        .all([
          this.$http.post("/cms/buildingInfo/list.json", {
            buildingNo: this.$route.params.buildingNo
          }),
          this.$http.post("/cms/houseInfo/listHouseInfoByFloor.json", {
            buildingNo: this.$route.params.buildingNo
          })
        ])
        .then(
          this.$http.spread((building, house) => {
            this.networkLoading = false;
            if (building.data.code == 500) {
              this.$store.commit(
                "addSnackBar",
                `楼宇信息查询失败 ${building.data.msg}`,
                "error"
              );
            } else if (house.data.code == 500) {
              this.$store.commit(
                "addSnackBar",
                `房源信息查询失败 ${house.data.msg}`,
                "error"
              );
            } else {
              let bData = building.data.data;
              let hData = house.data.data;
              this.buildingInfo = bData && bData.length ? bData[0] : {};
              this.houseInfoArr = hData && hData.length ? hData : [];
            }
          })
        )
        .catch(err => {
          this.networkLoading = false;
          this.networkError = true;
          this.$store.commit("addSnackBar", `楼宇查询失败${err}`, "error");
        });
    },
    getOption(floor) {
      let floorData = this.houseStatus.map((status, i) => ({
        name: status,
        value: [0, i],
        children: []
      }));

      floor.item.data.forEach(house => {
        floorData[house.resourceStatus].value[0] = (
          parseFloat(house.buildArea) +
          parseFloat(floorData[house.resourceStatus].value[0])
        ).toFixed(2);

        floorData[house.resourceStatus].children.push({
          name: `${house.doorNumber}室`,
          value: [parseFloat(house.buildArea)],
          to: {
            name: "house-info-detail",
            params: { houseNo: house.houseNo }
          }
        });
      });

      return {
        title: {
          text: `房源 - ${floor.item.floorNo}层`,
          subtext: "",
          top: 10,
          left: 10,
          textStyle: {
            color: "#fff",
            fontWeight: "500"
          }
        },
        tooltip: { formatter: a => `${a.name}: <br />面积：${a.value[0]}m²` },
        series: [
          {
            name: `全部房源`,
            value: 111,
            type: "treemap",
            width: "100%",
            height: "100%",
            // roam: "false",
            nodeClick: "link",
            breadcrumb: {
              left: 0,
              itemStyle: {
                borderWidth: 0,
                opacity: 0.78
              }
            },
            leafDepth: 1,
            levels: [
              {
                // color: ["#37A2DA", "#32C5E9", "#67E0E3", "#9fe6b8"],
                // color: ["#37A2DA", "#32C5E9", "#7bd9a5", "#AAA"],
                // color: ["#23B6C9", "#EBB206", "#AB60B8", "#AAA"],
                color: ["#4FC3F7", "#1E88E5", "#5C6BC0", "#90A4AE"],
                colorMappingBy: "value",
                squareRatio: 0.000001,
                visualDimension: 1,
                itemStyle: {
                  normal: {
                    borderColor: "#CFD8DC",
                    gapWidth: 8
                  }
                }
              },
              {
                colorSaturation: [0.6, 0.4],
                itemStyle: {
                  normal: {
                    borderColorSaturation: 0.7,
                    gapWidth: 4,
                    borderWidth: 4
                  }
                }
              },
              {
                colorSaturation: [0.6, 0.4],
                itemStyle: {
                  normal: {
                    borderColorSaturation: 0.6,
                    gapWidth: 1
                  }
                }
              }
            ],
            data: floorData
          }
        ]
      };
    },
    clickHouse(obj) {
      if (obj.data && obj.data.to) this.$router.push(obj.data.to);
    },
    getTableData(houseInfo) {
      let houseList = [];
      houseInfo.map(floor => {
        floor.data.map(house =>
          houseList.push({
            houseNo: house.houseNo,
            floorNumber: `${floor.floorNo}层`,
            doorNumber: `${house.doorNumber}室`,
            buildArea: `${house.buildArea}`,
            houseType: this.houseType[house.houseType],
            resourceStatus: this.houseStatus[house.resourceStatus]
          })
        );
      });
      return houseList;
    },
    batchDeleteHouse() {
      this.$http
        .post("/cms/houseInfo/delete.json", {
          ids: this.selected.map(item => item.houseNo).toString()
        })
        .then(res => {
          if (res.data.code != 500)
            this.$store.commit("addSnackBar", "批量删除成功", "success");
        })
        .catch(err =>
          this.$store.commit("addSnackBar", `批量删除失败${err}`, "error")
        );
    },
    batchExportHouse() {
      this.$http
        .post(
          "/cms/houseInfo/excelExport",
          { ids: this.selected.map(item => item.houseNo).toString() },
          { responseType: "blob" }
        )
        .then(res => {
          if (res.data.code != 500) this.createDownloadEl(res);
        })
        .catch(err =>
          this.$store.commit("addSnackBar", `批量导出失败${err}`, "error")
        );
    },
    downloadExcel() {
      this.$http
        .post(
          "/cms/houseInfo/downloadTemplate.do",
          {},
          { responseType: "blob" }
        )
        .then(res => {
          if (res.data.code != 500) this.createDownloadEl(res);
        })
        .catch(err =>
          this.$store.commit("addSnackBar", `Excel模板下载失败${err}`, "error")
        );
    },
    createDownloadEl(res) {
      const fileName = "批量上传房源.xlsx";
      // const fileName = response.headers['content-disposition'].split('filename=')[1].split(';')[0] || "";
      const blob = new Blob([res]);
      // if ("download" in document.createElement("a")) {
      const url = window.URL.createObjectURL(blob);
      let link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      link.setAttribute("download", fileName);

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(blob);
      // } else {
      //   navigator.msSaveBlob(blob, fileName);
      // }
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
          this.$store.commit(
            "addSnackBar",
            `Excel上传失败: ${newFile.error}`,
            "error"
          );
        }

        // 上传成功
        if (newFile.success && !oldFile.success) {
          let res = JSON.parse(newFile.xhr.response);
          if (res.code == 0) {
            this.saveFile.push(res.data);
            this.$refs.upload.remove(newFile.id);
          } else {
            this.$store.commit(
              "addSnackBar",
              `Excel上传失败: ${res.msg}`,
              "error"
            );
          }
        }
      }
      // 自动上传
      if (
        Boolean(newFile) !== Boolean(oldFile) ||
        oldFile.error !== newFile.error
      ) {
        if (!this.$refs.upload.active) {
          this.$refs.upload.active = true;
        }
      }
    }
  }
};
</script>
<style lang="stylus">
.no-data {
  height 300px;
  line-height 300px;
  text-align: center;
}
</style>
