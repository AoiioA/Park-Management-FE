<template>
  <div class="building-detail">
    <v-jumbotron height="auto">
      <v-container grid-list-xl>
        <v-layout justify-center align-center>
          <v-flex xs12 xl10>
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
              <v-dialog :disabled="buildingInfo.delFlag === 0" v-model="newBuildingDialog" max-width="500px" persistent>
                <v-btn slot="activator" :disabled="buildingInfo.delFlag === 0" @click="getPark();getProvince();" depressed color="primary">编辑楼宇</v-btn>
                <v-form ref="editBuildingForm" v-model="newBuildingValid" lazy-validation>
                  <v-card>
                    <v-card-title>
                      <span class="headline">修改楼宇信息</span>
                      <v-spacer></v-spacer>
                      <v-btn flat @click="delBuilding" color="error">删除楼宇</v-btn>
                    </v-card-title>
                    <v-card-text>
                      <v-container grid-list-xs>
                        <v-layout wrap>
                          <v-flex xs4><v-select v-model="editedBuilding.parkNo" :items="select.parkInfoArr" item-text="parkName" item-value="parkNo" label="所属园区" :hint="editedBuilding.parkNo!==0?`楼宇将继承省市区县信息`:''" persistent-hint autocomplete required></v-select></v-flex>
                          <v-flex xs4><v-text-field v-model="editedBuilding.buildingName" :rules="[$store.state.rules.required]" label="楼宇名称" :hint="editedBuilding.buildingName?`全称为 : ${fullBuildingName}`:''" persistent-hint required></v-text-field></v-flex>
                          <v-flex xs4><v-text-field v-model="editedBuilding.constructionArea" :rules="[$store.state.rules.noZero, $store.state.rules.nonnegative]" label="建筑面积(m²)" type="number" required></v-text-field></v-flex>
                          <v-flex xs4><v-select v-if="editedBuilding.parkNo==0" @change="getCity" v-model="editedBuilding.province" :items="select.provinceInfoArr" item-text="provinceName" item-value="provinceName" :rules="[$store.state.rules.required]" label="省" autocomplete required></v-select></v-flex>
                          <v-flex xs4><v-select v-if="editedBuilding.parkNo==0" :disabled="!editedBuilding.province" @change="getDistrict" v-model="editedBuilding.city" :items="select.cityInfoArr" item-text="cityName" item-value="cityName" :rules="[$store.state.rules.required]" label="市" autocomplete required></v-select></v-flex>
                          <v-flex xs4><v-select v-if="editedBuilding.parkNo==0" :disabled="!editedBuilding.city" v-model="editedBuilding.district" :items="select.districtInfoArr" item-text="countyName" item-value="countyName" :rules="[$store.state.rules.required]" label="区县" autocomplete required></v-select></v-flex>
                          <!-- <v-flex xs4><v-text-field v-if="editedBuilding.parkNo==0" v-model="editedBuilding.province" :rules="[$store.state.rules.required]" label="省" required></v-text-field></v-flex>
                          <v-flex xs4><v-text-field v-if="editedBuilding.parkNo==0" v-model="editedBuilding.city" :rules="[$store.state.rules.required]" label="市" required></v-text-field></v-flex>
                          <v-flex xs4><v-text-field v-if="editedBuilding.parkNo==0" v-model="editedBuilding.district" :rules="[$store.state.rules.required]" label="区县" required></v-text-field></v-flex> -->
                          <v-flex xs12><v-text-field v-model="editedBuilding.address" :rules="[$store.state.rules.required]" label="详细地址" required></v-text-field></v-flex>
                        </v-layout>
                      </v-container>
                      <small class="px-1 red--text text--accent-2">*&nbsp;标记为必填项</small>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn depressed @click="newBuildingClose(true)">取消操作</v-btn>
                      <v-btn :disabled="!newBuildingValid" @click="newBuildingSave" depressed color="primary">确认修改</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-form>
              </v-dialog>
            </v-subheader>
          </v-flex>
        </v-layout>
        <v-layout v-if="$route.params.buildingDetailType=='table'" align-start align-content-start justify-center wrap>
          <v-flex xs12 xl10>
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
                        <v-list-tile :href="`${$store.getters.getBaseUrl}/cms/houseInfo/downloadTemplate.do`">
                        <!-- <v-list-tile @click="downloadExcel"> -->
                          <v-list-tile-title>下载Excel模板</v-list-tile-title>
                        </v-list-tile>

                        <file-upload
                          ref="upload"
                          v-model="newFileList"
                          :data="{ buildingId: buildingInfo.buildingId, buildingNo: buildingInfo.buildingNo }"
                          :post-action="`${$store.getters.getBaseUrl}${upload.postAction}`"
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
                  <td>{{ props.item.decorationSituation }}</td>
                  <!-- <td>{{ props.item.houseType }}</td> -->
                  <td>{{ props.item.resourceStatus }}</td>
                  <td>{{ props.item.idleDays }}</td>
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
          <v-flex slot="item" slot-scope="props" xs12 xl10>
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
    // 修改房源相关
    newBuildingDialog: false,
    newBuildingValid: true,
    select: {
      parkInfoArr: [{ parkName: "无园区", parkNo: 0 }],
      provinceInfoArr: [],
      cityInfoArr: [],
      districtInfoArr: []
    },
    editedBuilding: {
      buildingName: "",
      parkNo: 0,
      constructionArea: "",
      province: "",
      city: "",
      district: "",
      address: ""
    },
    defaultBuilding: {
      buildingName: "",
      parkNo: 0,
      constructionArea: "",
      province: "",
      city: "",
      district: "",
      address: ""
    },
    // 列表等相关
    buildingInfo: {},
    houseInfoArr: [],
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
    resourceStatus: [
      "空置房源",
      "租赁中房源",
      "预定房源",
      "维护房源",
      "租赁审核房源"
    ],
    decorationSituation: ["毛坯", "简装修", "中等装修", "豪华装修", "精装修"],
    pagination: {
      rowsPerPage: 3
    },
    search: "",
    headers: [
      { text: "楼层", value: "floorNumber" },
      { text: "门牌号", value: "doorNumber" },
      { text: "建筑面积", value: "buildArea" },
      { text: "装修情况", value: "decorationSituation" },
      // { text: "房源类型", value: "houseType" },
      { text: "房源状态", value: "resourceStatus" },
      { text: "空置天数", value: "idleDays" },
      { text: "操作", value: "houseNo", sortable: false }
    ],
    selected: [],
    upload: {
      postAction: "/cms/houseInfo/excelImport",
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
  computed: {
    fullBuildingName() {
      if (
        this.select.parkInfoArr.length > 1 &&
        this.editedBuilding.parkNo !== 0
      ) {
        let parkName = this.select.parkInfoArr.find(
          item => item.parkNo == this.editedBuilding.parkNo
        );
        return `${parkName.parkName} ${this.editedBuilding.buildingName}`;
      }
      return this.editedBuilding.buildingName;
    }
  },
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
          this.$http.post("/cms/buildingInfo/listBuildingInfo.json", {
            buildingNo: Number(this.$route.params.buildingNo)
          }),
          this.$http.post("/cms/houseInfo/listHouseInfoByFloor.json", {
            buildingNo: Number(this.$route.params.buildingNo)
          })
        ])
        .then(
          this.$http.spread((building, house) => {
            this.networkLoading = false;
            if (building.data.code == 500) {
              this.networkError = true;
              this.$store.commit(
                "addSnackBar",
                `楼宇信息查询失败 ${building.data.msg}`,
                "error"
              );
            } else if (house.data.code == 500) {
              this.networkError = true;
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
              for (let key in this.buildingInfo) {
                if (this.defaultBuilding.hasOwnProperty(key)) {
                  this.defaultBuilding[key] = this.buildingInfo[key];
                }
              }
              if (this.buildingInfo.parkNo) {
                this.defaultBuilding.buildingName = this.defaultBuilding.buildingName.split(
                  " "
                )[1];
              } else {
                this.defaultBuilding.parkNo = 0;
              }
              this.editedBuilding = Object.assign({}, this.defaultBuilding);
            }
          })
        )
        .catch(err => {
          this.networkLoading = false;
          this.networkError = true;
          this.$store.commit("addSnackBar", `楼宇查询失败 ${err}`, "error");
        });
    },
    getPark() {
      this.select.parkInfoArr = [{ parkName: "无园区", parkNo: 0 }];
      this.$http
        .post("/cms/parkInfo/listParkInfo.json", {})
        .then(res => {
          let resData = res.data.data;
          this.select.parkInfoArr = resData && resData.length ? resData : [];
          this.select.parkInfoArr.unshift({ parkName: "无园区", parkNo: 0 });
        })
        .catch(err =>
          this.$store.commit("addSnackBar", `园区信息查询失败 ${err}`, "error")
        );
    },
    getProvince() {
      this.select.provinceInfoArr = [];
      this.$http
        .get("/cms/administrativeDivision/province.json", {})
        .then(res => {
          let resData = res.data.data;
          this.select.provinceInfoArr =
            resData && resData.length ? resData : [];
        })
        .catch(err =>
          this.$store.commit("addSnackBar", `省级信息查询失败 ${err}`, "error")
        );
    },
    getCity(province) {
      if (province) {
        this.select.cityInfoArr = [];
        this.$http
          .get("/cms/administrativeDivision/city.json", {
            params: {
              province: province
            }
          })
          .then(res => {
            let resData = res.data.data;
            this.editedBuilding.city = "";
            this.editedBuilding.district = "";
            this.select.cityInfoArr = resData && resData.length ? resData : [];
          })
          .catch(err =>
            this.$store.commit(
              "addSnackBar",
              `市级信息查询失败 ${err}`,
              "error"
            )
          );
      }
    },
    getDistrict(city) {
      if (city) {
        this.select.districtInfoArr = [];
        this.$http
          .get("/cms/administrativeDivision/county.json", {
            params: {
              province: this.editedBuilding.province,
              city: city
            }
          })
          .then(res => {
            let resData = res.data.data;
            this.editedBuilding.district = "";
            this.select.districtInfoArr =
              resData && resData.length ? resData : [];
          })
          .catch(err =>
            this.$store.commit(
              "addSnackBar",
              `区县信息查询失败 ${err}`,
              "error"
            )
          );
      }
    },
    delBuilding() {
      this.$http
        .post(
          `/cms/buildingInfo/deleteBuildingInfo.json?buildingNos=${
            this.buildingInfo.buildingNo
          }`
        )
        .then(res => {
          if (res.data.code != 500) {
            this.$store.commit("addSnackBar", "楼宇删除成功", "success");
            this.$router.go(0);
          }
        })
        .catch(err =>
          this.$store.commit("addSnackBar", `楼宇删除失败${err}`, "error")
        );
    },
    newBuildingClose(isCancel) {
      if (!isCancel || confirm("取消后内容将不会保存")) {
        this.$refs.editBuildingForm.reset();
        this.newBuildingDialog = false;
        this.editedBuilding = Object.assign({}, this.defaultBuilding);
      }
    },
    newBuildingSave() {
      if (this.$refs.editBuildingForm.validate()) {
        let park = this.select.parkInfoArr.find(
          item => item.parkNo == this.editedBuilding.parkNo
        );
        this.$http
          .post("/cms/buildingInfo/updateBuildingInfoByHouseNo.json", {
            buildingId: this.buildingInfo.buildingId,
            buildingNo: this.buildingInfo.buildingNo,
            buildingName: this.fullBuildingName,
            parkNo:
              this.editedBuilding.parkNo != 0 ? this.editedBuilding.parkNo : "",
            parkId: this.editedBuilding.parkNo != 0 ? park.parkId : "",
            constructionArea: this.editedBuilding.constructionArea,
            province:
              this.editedBuilding.parkNo === 0
                ? this.editedBuilding.province
                : park.province,
            city:
              this.editedBuilding.parkNo === 0
                ? this.editedBuilding.city
                : park.city,
            district:
              this.editedBuilding.parkNo === 0
                ? this.editedBuilding.district
                : park.district,
            address: this.editedBuilding.address
          })
          .then(res => {
            if (res.data.code != 500) {
              this.newBuildingClose(false);
              this.initialize();
              this.$store.commit("addSnackBar", "楼宇修改成功", "success");
            } else {
              this.$store.commit(
                "addSnackBar",
                `楼宇修改失败 ${res.data.msg}`,
                "success"
              );
            }
          })
          .catch(err =>
            this.$store.commit("addSnackBar", `楼宇修改失败 ${err}`, "error")
          );
      }
    },
    getOption(floor) {
      let floorData = this.resourceStatus.map((status, i) => ({
        name: status,
        value: [0, i],
        children: []
      }));

      floor.item.room.forEach(house => {
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
        tooltip: {
          formatter: a => `
            <div style="min-width: 120px;">
              <div>${a.name}</div>
              面积 : <h4 style="float: right">${a.value[0]}m²<h4>
            </div>
          `,
          textStyle: {
            color: "rgba(0,0,0,0.87)"
          },
          backgroundColor: "#ECEFF1",
          padding: [8, 12],
          extraCssText: `
            border-radius: 3px;
            box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
          `
        },
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
                color: ["#29B6F6", "#1E88E5", "#5C6BC0", "#90A4AE", "#90A4AE"],
                colorMappingBy: "value",
                squareRatio: 0.000001,
                visualDimension: 1,
                itemStyle: {
                  normal: {
                    borderColor: "#CFD8DC",
                    gapWidth: 0
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
        floor.room.map(house =>
          houseList.push({
            houseId: house.houseId,
            houseNo: house.houseNo,
            floorNumber: `${floor.floorNo}层`,
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
      });
      return houseList;
    },
    batchDeleteHouse() {
      this.$http
        .post(
          `/cms/houseInfo/batchDelHouseInfoByHouseNo.json?houseNos=` +
            `${this.selected.map(item => item.houseNo).toString()}`
        )
        .then(res => {
          if (res.data.code != 500) {
            this.$store.commit("addSnackBar", "批量删除成功", "success");
            this.initialize();
          }
        })
        .catch(err =>
          this.$store.commit("addSnackBar", `批量删除失败${err}`, "error")
        );
    },
    batchExportHouse() {
      this.$http
        .post(
          "/cms/houseInfo/excelExport",
          { ids: this.selected.map(item => item.houseId).toString() },
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
      const fileName = "房源excel.xlsx";
      // const fileName = res.headers['content-disposition'].split('filename=')[1].split(';')[0] || "";
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
            `Excel上传失败 ${newFile.error}`,
            "error"
          );
        }

        // 上传成功
        if (newFile.success && !oldFile.success) {
          let res = JSON.parse(newFile.xhr.response);
          if (res.code == 0) {
            this.$store.commit(
              "addSnackBar",
              `Excel上传成功 ${res.data}`,
              "success"
            );
            this.initialize();
          } else {
            this.$store.commit(
              "addSnackBar",
              `Excel上传失败 ${res.msg}`,
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
  height: 300px;
  line-height: 300px;
  text-align: center;
}
</style>
