<template>
<div class="fill-height house-new">
    <view-tool-bar>
      <span slot="bar-menu">
        <v-btn icon>
          <v-icon>help</v-icon>
        </v-btn>
      </span>
    </view-tool-bar>
    <v-jumbotron color="blue-grey lighten-5" height="auto">
      <v-container class="px-4 py-4">
        <v-layout align-start align-content-start justify-center wrap>
          <v-flex xs12 md10 lg8>
            <v-stepper v-model="stepNum" vertical class="elevation-0" style="background: #eceff1">
              <v-stepper-step :rules="[() => !!formValid]" :complete="stepNum>1" step="1">
                编辑房源信息
                <small v-if="editHouse.resourceStatus===0">{{ `&nbsp;${assetsOfNewHouse.parkName} ${assetsOfNewHouse.buildingName} ${((n)=>{return n>=0?n:'地下'+Math.abs(n)})(editHouse.floorNumber)}层 ${editHouse.doorNumber}室` }}</small>
              </v-stepper-step>
              <v-stepper-content step="1">
                <v-form ref="houseForm" v-model="formValid" lazy-validation>
                  <div class="no-data" v-if="networkLoading.info"><v-progress-circular indeterminate color="primary" class="my-0"></v-progress-circular></div>
                  <v-alert v-else-if="networkError.info" :value="true" type="error">网络出现异常 - 检查网络后刷新重试</v-alert>
                  <v-container v-else grid-list-md>
                    <v-subheader>建筑信息</v-subheader>
                    <v-layout row wrap>
                      <v-flex xs12 sm3>
                        <v-menu v-model="menu.buildingMenu" :disabled="editHouse.resourceStatus===0" :close-on-content-click="false" offset-y nudge-top="20">
                          <v-text-field slot="activator" :disabled="editHouse.resourceStatus===0" :rules="[$store.state.rules.required]" :value="assetsOfNewHouse.buildingName" label="签约楼宇" :hint="assetsOfNewHouse.parkName" persistent-hint box required readonly></v-text-field>
                          <v-list style="max-height: 200px; overflow-y: auto;">
                            <v-list-tile v-if="!assetsInfo.length">
                              <v-list-tile-title>暂无房源可以添加</v-list-tile-title>
                            </v-list-tile>
                            <v-menu v-else v-for="(assetsPark, i) in assetsInfo" :key="i" offset-x style="display:block">
                              <v-list-tile slot="activator" @click="1">
                                <v-list-tile-title>{{ assetsPark.parkName }}</v-list-tile-title>
                              </v-list-tile>
                              <v-list style="max-height: 200px; overflow-y: auto;">
                                <v-list-tile v-for="(assetsBuilding, j) in assetsPark.building" :key="j" @click="changeBuilding(assetsPark, assetsBuilding)">
                                  <v-list-tile-title>{{ assetsBuilding.buildingName }}</v-list-tile-title>
                                </v-list-tile>
                              </v-list>
                            </v-menu>
                          </v-list>
                        </v-menu>
                      </v-flex>
                      <v-flex xs12 sm3><v-text-field v-model.number="newHouse.floorNumber" :rules="[$store.state.rules.required, $store.state.rules.noZero, rules.testFloorNumber]" label="楼层" hint="" persistent-hint box required></v-text-field></v-flex>
                      <v-flex xs12 sm3><v-text-field v-model="newHouse.doorNumber" :rules="[$store.state.rules.required]" label="门牌号" hint="" persistent-hint box required></v-text-field></v-flex>
                      <v-flex xs12 sm3>
                        <v-menu v-model="menu.decorationSituationMenu" offset-y nudge-top="20">
                          <v-text-field slot="activator" :rules="[$store.state.rules.required]" :value="decorationInfo[newHouse.decorationSituation]" label="装修程度" hint="" persistent-hint box required readonly></v-text-field>
                          <v-list>
                            <v-list-tile v-for="(decoration, decorationIndex) in decorationInfo" :key="decorationIndex" @click="newHouse.decorationSituation=decorationIndex">
                              <v-list-tile-title>{{ decoration }}</v-list-tile-title>
                            </v-list-tile>
                          </v-list>
                        </v-menu>
                      </v-flex>
                      <v-flex xs12 sm3><v-text-field v-model.number="newHouse.orientation" :rules="[$store.state.rules.required]" label="房源朝向" hint="" persistent-hint box required></v-text-field></v-flex>
                      <v-flex xs12 sm3><v-text-field v-model.number="newHouse.buildArea" :rules="[$store.state.rules.required, $store.state.rules.noZero]" label="建筑面积(m²)" hint="" persistent-hint type="number" box required></v-text-field></v-flex>
                      <v-flex xs12 sm3><v-text-field v-model.number="newHouse.usageRate" :rules="[$store.state.rules.required, $store.state.rules.noZero, rules.lessThanHundred]" label="使用率(%)" hint="" persistent-hint type="number" box required></v-text-field></v-flex>
                      <v-flex xs12 sm3><v-text-field v-model.number="newHouse.accommodatingNumber" mask="####" :rules="[$store.state.rules.required, $store.state.rules.nonnegative]" label="容纳人数" hint="" persistent-hint box required></v-text-field></v-flex>
                      <v-flex xs6 sm3><v-switch :label="`${newHouse.isDecoration?'可':'不可'}自行装修`" v-model="newHouse.isDecoration" @change="newHouse.isDecoration=Number(newHouse.isDecoration)"></v-switch></v-flex>
                      <v-flex xs6 sm3><v-switch :label="`${newHouse.isOfficeFurniture?'含':'不含'}办公家具`" v-model="newHouse.isOfficeFurniture" @change="newHouse.isOfficeFurniture=Number(newHouse.isOfficeFurniture)"></v-switch></v-flex>
                      <v-flex xs6 sm3><v-switch :label="`${newHouse.isRegister?'已':'暂无'}注册`" v-model="newHouse.isRegister" @change="newHouse.isRegister=Number(newHouse.isRegister)"></v-switch></v-flex>
                      <v-flex xs6 sm3><v-switch :label="`${newHouse.isFireProcedure?'已有':'暂无'}消防手续`" v-model="newHouse.isFireProcedure" @change="newHouse.isFireProcedure=Number(newHouse.isFireProcedure)"></v-switch></v-flex>
                    </v-layout>
                    <v-divider class="my-3"></v-divider>
                    <v-subheader>财务信息</v-subheader>
                    <v-layout row wrap>
                      <v-flex xs12 sm3>
                        <v-menu v-model="menu.houseTypeMenu" offset-y nudge-top="20">
                          <v-text-field slot="activator" :rules="[$store.state.rules.required]" :value="['整租'][newHouse.houseType]" label="房源类型" hint="" persistent-hint box required readonly></v-text-field>
                          <v-list style="max-height: 200px; overflow-y: auto;">
                            <v-list-tile v-for="(type, typeIndex) in ['整租']" :key="typeIndex" @click="newHouse.houseType=typeIndex">
                              <v-list-tile-title>{{ type }}</v-list-tile-title>
                            </v-list-tile>
                          </v-list>
                        </v-menu>
                      </v-flex>
                      <v-flex xs12 sm3><v-text-field v-model.number="newHouse.price" :rules="[$store.state.rules.required, $store.state.rules.nonnegative, $store.state.rules.noZero]" label="起始定价" type="number" hint="" persistent-hint box required></v-text-field></v-flex>
                      <v-flex xs12 sm3>
                        <v-menu v-model="menu.priceUnitMenu" offset-y nudge-top="20">
                          <v-text-field slot="activator" :rules="[$store.state.rules.required]" :value="['元/m²·天'][newHouse.priceUnit]" label="价格单位" hint="" persistent-hint box required readonly></v-text-field>
                          <v-list style="max-height: 200px; overflow-y: auto;">
                            <v-list-tile v-for="(unit, unitIndex) in ['元/m²·天']" :key="unitIndex" @click="newHouse.priceUnit=unitIndex">
                              <v-list-tile-title>{{ unit }}</v-list-tile-title>
                            </v-list-tile>
                          </v-list>
                        </v-menu>
                      </v-flex>
                      <v-flex xs12 sm3><v-text-field v-model.number="newHouse.propertyFee" :rules="[$store.state.rules.required, $store.state.rules.nonnegative, $store.state.rules.noZero]" label="物业费(元/天•m²)" type="number" hint="" persistent-hint box required></v-text-field></v-flex>
                      <v-flex xs12><v-text-field v-model="newHouse.remark" label="备注" hint="" persistent-hint box></v-text-field></v-flex>
                    </v-layout>
                  </v-container>
                  <v-btn :disabled="!formValid" @click.native="submitHouse()" color="primary" depressed>确认无误并提交</v-btn>
                </v-form>
              </v-stepper-content>
              <v-stepper-step :complete="isSubmitHouse" step="2">
                上传房屋照片
                <small v-if="stepNum==2">{{ `&nbsp;${assetsOfNewHouse.parkName} ${assetsOfNewHouse.buildingName} ${((n)=>{return n>=0?n:'地下'+Math.abs(n)})(editHouse.floorNumber)}层 ${editHouse.doorNumber}室` }}</small>
              </v-stepper-step>
              <v-stepper-content step="2">
                <div class="no-data" v-if="networkLoading.image"><v-progress-circular indeterminate color="primary" class="my-0"></v-progress-circular></div>
                <v-alert v-else-if="networkError.image" :value="true" type="error">网络出现异常 - 检查网络后刷新重试</v-alert>
                <v-container v-else grid-list-xs fluid class="mb-3">
                  <v-layout row wrap>
                    <v-flex v-for="(imageItem, imageIndex) in houseImageList" :key="imageItem.name" xs12 sm4 md3 xl2>
                      <v-card flat>
                        <v-card-media
                          :src="`${$store.getters.getBaseUrl}/filesystem/housePhoto/${editHouse.houseNo}/${imageItem.photoNewname}`"
                          height="150px"
                        >
                          <v-container fill-height fluid class="image-container">
                            <v-layout column>
                              <v-flex class="text-xs-right">
                                <v-tooltip top>
                                  <v-btn slot="activator" :loading="imageItem.loading" @click="delFile(imageIndex)" small icon dark class="mx-0 my-0">
                                    <v-icon>cloud_off</v-icon>
                                  </v-btn>
                                  <span>从云端移除</span>
                                </v-tooltip>
                              </v-flex>
                            </v-layout>
                          </v-container>
                        </v-card-media>
                      </v-card>
                    </v-flex>
                    <v-flex v-for="file in newImageList" :key="file.id" xs12 sm4 md3 xl2>
                      <v-card flat>
                        <v-card-media
                          class="white--text"
                          :src="file.thumb"
                          height="150px"
                        >
                          <v-container fill-height fluid style="background: rgba(128,128,128,.3)">
                            <v-layout column>
                              <v-flex class="text-xs-right">
                                <v-btn
                                  slot="activator"
                                  :disabled="upload.minSize>file.size||file.size>upload.size"
                                  :loading="$refs.upload && $refs.upload.active"
                                  @click.prevent="$refs.upload.active = true"
                                  small icon dark
                                  class="mx-0 my-0"
                                ><v-icon>cloud_queue</v-icon></v-btn>
                                <v-btn
                                  slot="activator"
                                  :disabled="$refs.upload && $refs.upload.active"
                                  @click.prevent="$refs.upload.remove(file)"
                                  small icon dark
                                  class="mx-0 my-0"
                                ><v-icon>close</v-icon></v-btn>
                              </v-flex>
                              <v-flex xs12></v-flex>
                              <v-flex class="caption" style="white-space:normal; word-break:break-all;">
                                {{file.name}}<br />{{file.size | formatSize}}
                                <small v-if="file.size>upload.size" class="red--text">(过大)</small>
                                <small v-if="upload.minSize>file.size" class="red--text">(过小)</small>
                              </v-flex>
                            </v-layout>
                          </v-container>
                        </v-card-media>
                      </v-card>
                    </v-flex>
                    <v-flex xs12 sm4 md3 xl2>
                      <v-card flat>
                        <file-upload
                          ref="upload"
                          v-model="newImageList"
                          :data="{ type: 2, id: editHouse.houseNo }"
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
                          <v-btn
                            tag="v-container"
                            color="primary"
                            outline
                            class="px-0 py-0 text-xs-center"
                            style="height: 150px;cursor: pointer;"
                          >
                            <v-layout column justify-center v-if="!newImageList.length">
                              <v-flex><v-icon>add</v-icon></v-flex>
                              <v-flex>添加图片</v-flex>
                            </v-layout>
                            <v-layout column justify-center v-else>
                              <v-flex><v-icon>refresh</v-icon></v-flex>
                              <v-flex>更换待传图片</v-flex>
                            </v-layout>
                          </v-btn>
                        </file-upload>
                      </v-card>
                    </v-flex>
                  </v-layout>
                </v-container>
                <v-btn :to="{ 'name': 'house-info-detail', 'params': { 'houseNo': editHouse.houseNo } }" color="primary" depressed>{{ houseImageList.length?"上传完成":"跳过上传"}}</v-btn>
              </v-stepper-content>
            </v-stepper>
          </v-flex>
        </v-layout>
      </v-container>
    </v-jumbotron>
  </div>
</template>

<script>
import ImageCompressor from "image-compressor.js";
import FileUpload from "vue-upload-component";
import ViewToolBar from "@/components/ViewToolBar.vue";

export default {
  components: {
    FileUpload,
    ViewToolBar
  },
  data: () => ({
    networkLoading: {
      info: false,
      image: false
    },
    networkError: {
      info: null,
      image: null
    },
    menu: {
      buildingMenu: false,
      orientation: false,
      decorationSituationMenu: false,
      houseType: false,
      priceUnit: false
    },
    decorationInfo: ["毛坯", "简装修", "中等装修", "豪华装修", "精装修"],
    stepNum: 1,
    formValid: true,
    editHouse: {},
    newHouse: {
      // 建筑信息
      floorNumber: "",
      doorNumber: "",
      orientation: "",
      buildArea: "",
      usageRate: "",
      accommodatingNumber: "",
      decorationSituation: 0,
      isDecoration: 1,
      isOfficeFurniture: 1,
      isRegister: 1,
      isFireProcedure: 1,
      // 财务信息
      houseType: 0,
      price: "",
      priceUnit: 0,
      propertyFee: "",
      remark: ""
    },
    assetsOfNewHouse: {
      parkNo: "",
      parkName: "",
      buildingNo: "",
      buildingName: ""
    },
    assetsInfo: [],
    isSubmitHouse: false,
    upload: {
      postAction: "/cms/housePhotoInfo/uploadTypePhoto.json",
      accept: "image/png,image/gif,image/jpeg,image/webp",
      extensions: /\.(gif|jpe?g|png|webp)$/i,
      size: 1024 * 1024 * 2,
      minSize: 10 * 1024,
      multiple: false,
      thread: 1,
      directory: false,
      dropDirectory: false
    },
    newImageList: [],
    houseImageList: [],
    rules: {
      testFloorNumber: val =>
        !new RegExp(/[^(\-?)\d+]/gi).test(val) || "楼层需为整数",
      lessThanHundred: val => val <= 100 || "该项需小于一百"
    }
  }),
  created() {
    this.$store.commit("changeToolBarTitle", "添加房源");
    this.initialize();
  },
  methods: {
    initialize() {
      if (this.$route.query.editHouseNo) {
        this.getHouse();
      } else {
        this.getAssets();
      }
    },
    getAssets() {
      this.$http
        .post("/cms/AssetsInfo/park.json")
        .then(res => {
          let resData = res.data.data;
          resData = resData && resData.length ? resData : [];
          this.assetsInfo = this.translateAssets(resData);
        })
        .catch(() =>
          this.$store.commit("addSnackBar", "楼宇信息查询失败", "error")
        );
    },
    getHouse() {
      this.networkLoading.info = true;
      this.networkError.info = null;
      this.editHouse = {};
      this.buildingInfo = {};
      this.$http
        .all([
          this.$http.post("/cms/houseInfo/queryHouseInfoByHouseNo.json", {
            houseNo: Number(this.$route.query.editHouseNo)
          }),
          this.$http.post("/cms/AssetsInfo/park.json")
        ])
        .then(
          this.$http.spread((houseRes, buildingRes) => {
            this.networkLoading.info = false;
            if (houseRes.data.code == 500) {
              this.$store.commit(
                "addSnackBar",
                `房源信息查询失败 ${houseRes.data.msg}`,
                "error"
              );
            } else if (buildingRes.data.code == 500) {
              this.$store.commit(
                "addSnackBar",
                `房源所属楼宇查询失败 ${buildingRes.data.msg}`,
                "error"
              );
            } else {
              this.editHouse = houseRes.data.data;
              if (this.editHouse.resourceStatus === 0) {
                this.$store.commit("changeToolBarTitle", "修改房源");
                for (let key in this.editHouse) {
                  if (this.newHouse.hasOwnProperty(key)) {
                    this.newHouse[key] = this.editHouse[key];
                  }
                }
                Object.assign(
                  this.assetsOfNewHouse,
                  buildingRes.data.data.find(
                    item => item.buildingNo == this.editHouse.buildingNo
                  )
                );
              } else {
                this.getAssets();
              }
            }
          })
        )
        .catch(err => {
          this.networkLoading.info = false;
          this.networkError.info = true;
          this.$store.commit("addSnackBar", `房源查询失败 ${err}`, "error");
        });
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
    changeBuilding(assetsPark, assetsBuilding) {
      // 关闭菜单
      this.menu.buildingMenu = false;
      // 改变表单中楼宇信息
      Object.assign(this.assetsOfNewHouse, {
        parkNo: assetsPark.parkNo,
        parkName: assetsPark.parkName,
        buildingNo: assetsBuilding.buildingNo,
        buildingName: assetsBuilding.buildingName
      });
    },
    submitHouse() {
      // console.log(this.newHouse);
      if (this.$refs.houseForm.validate()) {
        let submitUrl = "/cms/houseInfo/addHouseInfo.json";
        let submitData = Object.assign(
          { buildingNo: this.assetsOfNewHouse.buildingNo },
          this.newHouse
        );
        if (this.editHouse.resourceStatus === 0) {
          submitUrl = "/cms/houseInfo/updateHouseInfoByHouseNo.json";
          submitData = Object.assign(
            {
              houseId: this.editHouse.houseId,
              houseNo: this.editHouse.houseNo,
              resourceStatus: this.editHouse.resourceStatus,
              idleDays: this.editHouse.idleDays,
              delFlag: this.editHouse.delFlag
            },
            submitData
          );
        }
        this.$http
          .post(submitUrl, submitData)
          .then(res => {
            if (res.data.code != 500) {
              if (this.editHouse.resourceStatus !== 0) {
                Object.assign(this.editHouse, this.newHouse);
                this.editHouse.houseNo = res.data.data.houseNo;
              }
              this.$store.commit("addSnackBar", "房源添加成功", "success");
              this.stepNum++;
              this.getHouseImage();
            } else {
              this.$store.commit(
                "addSnackBar",
                `房源添加失败 ${res.data.msg}`,
                "error"
              );
            }
          })
          .catch(err =>
            this.$store.commit("addSnackBar", `房源添加失败: ${err}`, "error")
          );
      }
    },
    getHouseImage() {
      this.networkLoading.image = true;
      this.networkError.image = null;
      this.houseImageList = [];
      this.$http
        .post("/cms/housePhotoInfo/findFileName.json", {
          id: this.editHouse.houseNo,
          type: 2
        })
        .then(res => {
          this.networkLoading.image = false;
          let resData = res.data.data;
          this.houseImageList = resData;
        })
        .catch(err => {
          this.networkLoading.image = false;
          this.networkError.image = true;
          this.$store.commit("addSnackBar", `房源图片查询失败 ${err}`, "error");
        });
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
        // 自动压缩
        if (newFile.file && newFile.type.substr(0, 6) === "image/") {
          newFile.error = "compressing";
          const imageCompressor = new ImageCompressor(null, {
            convertSize: Infinity,
            maxWidth: 1920,
            maxHeight: 1080
          });
          imageCompressor
            .compress(newFile.file)
            .then(file => {
              this.$refs.upload.update(newFile, {
                error: "",
                file,
                size: file.size,
                type: file.type
              });
            })
            .catch(err => {
              this.$refs.upload.update(newFile, {
                error: err.message || "compress"
              });
            });
        }
      }
      if (newFile && (!oldFile || newFile.file !== oldFile.file)) {
        // 创建 blob 字段
        newFile.blob = "";
        let URL = window.URL || window.webkitURL;
        if (URL && URL.createObjectURL) {
          newFile.blob = URL.createObjectURL(newFile.file);
        }
        // Thumbnails
        // 缩略图
        newFile.thumb = "";
        if (newFile.blob && newFile.type.substr(0, 6) === "image/") {
          newFile.thumb = newFile.blob;
        }
      }
    },
    inputFile(newFile, oldFile) {
      if (newFile && !oldFile) {
        // 添加文件
        // console.log("add", newFile);
      }
      if (newFile && oldFile) {
        // 更新文件
        // console.log("update", newFile);

        if (newFile.active && !oldFile.active) {
          // 上传之前
          // 最小尺寸
          if (
            newFile.size >= 0 &&
            this.minSize > 0 &&
            newFile.size < this.minSize
          ) {
            this.$refs.upload.update(newFile, { error: "size" });
          }
        }

        // 上传进度
        if (newFile.progress !== oldFile.progress) {
          // console.log("progress", newFile.progress, newFile);
        }

        // 上传错误
        if (newFile.error && !oldFile.error) {
          // console.log("error", newFile.error, newFile, newFile.xhr.response);
          this.$store.commit(
            "addSnackBar",
            `图片上传失败: ${newFile.error}`,
            "error"
          );
        }

        // 上传成功
        if (newFile.success && !oldFile.success) {
          // console.log("success", newFile.success, newFile.xhr);
          let res = JSON.parse(newFile.xhr.response);
          if (res.code == 0) {
            this.$refs.upload.remove(newFile.id);
            // res.data.photoNewname = res.data.name;
            // this.houseImageList.push(res.data);
            this.getHouseImage();
            this.$store.commit("addSnackBar", "图片上传成功", "success");
          } else {
            this.$store.commit(
              "addSnackBar",
              `图片上传失败: ${res.msg}`,
              "error"
            );
          }
        }
      }
      if (!newFile && oldFile) {
        // 删除文件
        // console.log("remove", oldFile);
      }
    },
    delFile(index) {
      this.$http
        .post("/cms/housePhotoInfo/deleteAttachment.json", {
          name: this.houseImageList[index].photoNewname,
          type: 2
        })
        .then(res => {
          if (res.data.code != 500) {
            // this.houseImageList.splice(index, 1);
            this.getHouseImage();
            this.$store.commit("addSnackBar", "图片删除成功", "success");
          } else {
            this.$store.commit(
              "addSnackBar",
              `图片删除失败: ${res.data.msg}`,
              "error"
            );
          }
        })
        .catch(err =>
          this.$store.commit("addSnackBar", `图片删除失败: ${err}`, "error")
        );
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

.house-new {
  .image-container {
    opacity: 0;
    background: rgba(128, 128, 128, 0.3);
    transition: 0.3s ease;

    &:hover {
      opacity: 1;
    }
  }
}
</style>
