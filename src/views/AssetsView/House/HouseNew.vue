<template>
  <v-jumbotron color="grey lighten-4" class="house-new" height="auto">
    <v-container class="px-4 py-4">
      <v-layout align-start align-content-start justify-center wrap>
        <v-flex xs12 md10 lg8>
          <v-stepper v-model="stepNum" vertical class="elevation-0 new-stepper">
            <v-stepper-step :rules="[() => !!formValid]" :complete="stepNum>1" step="1">
              提交基础房源信息
              <!-- <small>包含甲方、承租方、中介方信息</small> -->
            </v-stepper-step>
            <v-stepper-content step="1">
              <v-form ref="houseForm" v-model="formValid" lazy-validation>
                <v-container grid-list-md>
                  <v-layout row wrap>
                    <v-flex xs12 sm4>
                      <v-menu v-model="menu.buildingMenu" :close-on-content-click="false" offset-y nudge-top="20" lazy>
                        <v-text-field slot="activator" :rules="[$store.state.rules.required]" :value="newAssets.buildingName" label="签约楼宇" :hint="newAssets.parkName" persistent-hint box required readonly></v-text-field>
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
                    <v-flex xs12 sm8><v-text-field v-model="newHouse.companyAddress" :rules="[$store.state.rules.required]" label="承租方通讯地址" hint="" persistent-hint box required></v-text-field></v-flex>
                  </v-layout>
                </v-container>
                <v-btn :disabled="!formValid" @click.native="submitHouse()" color="primary" depressed>确认无误并提交</v-btn>
              </v-form>
            </v-stepper-content>
            <v-stepper-step :complete="isUploadImg" step="2">上传房屋照片</v-stepper-step>
            <v-stepper-content step="2">
              <v-progress-circular indeterminate color="primary" v-if="networkLoading" class="center-box"></v-progress-circular>
              <v-alert v-else-if="networkError" :value="true" type="error" class="center-box">网络出现异常 - 检查网络后刷新重试</v-alert>
              <v-container v-else grid-list-xs fluid class="mb-3">
                <v-layout row wrap>
                  <v-flex v-for="n in 2" :key="n" xs12 sm4 md3 xl2>
                    <v-card flat>
                      <v-card-media
                        :src="`https://unsplash.it/150/300?image=${Math.floor(Math.random() * 100) + 1}`"
                        height="150px"
                      >
                        <!-- <v-btn @click.native="1" :loading="uploadLoading" color="primary" outline>上传图片</v-btn> -->
                      </v-card-media>
                    </v-card>
                  </v-flex>
                  <v-flex xs12 sm4 md3 xl2>
                    <v-card flat>
                      <v-btn
                        @click="openUploadImg"
                        tag="v-container"
                        color="primary"
                        outline
                        class="px-0 py-0 text-xs-center"
                        style="height: 150px;cursor: pointer;"
                      >
                        <v-layout column justify-center>
                          <v-flex><v-icon>cloud_upload</v-icon></v-flex>
                          <v-flex>添加图片</v-flex>
                        </v-layout>
                      </v-btn>
                      <v-dialog v-model="menu.uploadDialog" persistent max-width="290">
                        <v-card>
                          <v-card-title class="headline">Use Google's location service?</v-card-title>
                          <v-card-text>Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.</v-card-text>
                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn @click.native="cancelUploadImg()" flat>取消</v-btn>
                            <v-btn @click.native="uploadImg()" :loading="uploadLoading" color="primary" depressed>上传图片</v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-dialog>
                    </v-card>
                  </v-flex>
                </v-layout>
              </v-container>
              <v-btn @click.native="$route.go(-1)" color="primary" depressed>确认完成</v-btn>
              <ul>
                <li v-for="file in fileList" :key="file.id">
                  <span>{{file.name}}</span> -
                  <span>{{file.size | formatSize}}</span> -
                  <span v-if="file.error">{{file.error}}</span>
                  <span v-else-if="file.success">success</span>
                  <span v-else-if="file.active">active</span>
                  <span v-else-if="file.active">active</span>
                  <span v-else></span>
                </li>
              </ul>
              <file-upload
                post-action="/upload/post"
                extensions="gif,jpg,jpeg,png,webp"
                accept="image/png,image/gif,image/jpeg,image/webp"
                :multiple="true"
                :size="1024 * 1024 * 10"
                v-model="fileList"
                @input-filter="inputFilter"
                @input-file="inputFile"
                ref="upload">
                <i class="fa fa-plus"></i>
                Select files
              </file-upload>
              <button type="button" class="btn btn-success" v-if="!$refs.upload || !$refs.upload.active" @click.prevent="$refs.upload.active = true">
                <i class="fa fa-arrow-up" aria-hidden="true"></i>
                Start Upload
              </button>
              <button type="button" class="btn btn-danger"  v-else @click.prevent="$refs.upload.active = false">
                <i class="fa fa-stop" aria-hidden="true"></i>
                Stop Upload
              </button>
            </v-stepper-content>
          </v-stepper>
        </v-flex>
      </v-layout>
    </v-container>
  </v-jumbotron>
</template>

<script>
import FileUpload from "vue-upload-component";
export default {
  components: {
    FileUpload
  },
  data: () => ({
    networkLoading: false,
    networkError: null,
    uploadLoading: false,
    uploadError: null,
    stepNum: 1,
    isUploadImg: false,
    formValid: true,
    fileList: [],
    newHouse: {},
    newAssets: {
      parkId: "",
      parkName: "",
      buildingId: "",
      buildingName: ""
    },
    assetsInfo: [],
    menu: {
      uploadDialog: false,
      buildingMenu: false
    },
    rules: {
      afterSigning: val =>
        Date(this.getDay(this.newHouse.startDate, -1 * val)) >
          Date(this.newHouse.signingDate) || "免租开始日期需晚于合同签订日期"
    }
  }),
  created() {
    this.$store.commit("changeToolBarTitle", "添加房源");
    this.getPark();
  },
  methods: {
    getPark() {
      this.$http
        .post("/cms/AssetsInfo/park.json")
        .then(res => {
          let resData = res.data.data;
          resData = resData && resData.length ? resData : [];
          // 将List形式的数据转换为Tree形式并存入assetsInfo
          let parkInfo = [];
          resData.forEach(item => {
            if (item.parkId === null) {
              item.parkId = 0;
              item.parkName = "无归属楼宇";
            }
            if (!parkInfo[item.parkId]) {
              parkInfo[item.parkId] = {
                parkId: item.parkId,
                parkName: item.parkName,
                building: []
              };
            }
            parkInfo[item.parkId].building.push({
              buildingId: item.buildingId,
              buildingName: item.buildingName
            });
          });
          this.assetsInfo = parkInfo.filter(el => el);
        })
        .catch(() => this.addSnackBar("楼宇信息查询失败", "error"));
    },
    changeBuilding(assetsPark, assetsBuilding) {
      // 关闭菜单
      this.menu.buildingMenu = false;
      // 将assetsFloorInfo置空
      this.assetsFloorInfo = [];
      // 改变表单中楼宇信息
      Object.assign(this.newAssets, {
        parkId: assetsPark.parkId,
        parkName: assetsPark.parkName,
        buildingId: assetsBuilding.buildingId,
        buildingName: assetsBuilding.buildingName
      });
    },
    inputFilter(newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        // Before adding a file
        // 添加文件前
        // Filter system files or hide files
        // 过滤系统文件 和隐藏文件
        if (/(\/|^)(Thumbs\.db|desktop\.ini|\..+)$/.test(newFile.name)) {
          return prevent();
        }
        // Filter php html js file
        // 过滤 php html js 文件
        if (/\.(php5?|html?|jsx?)$/i.test(newFile.name)) {
          return prevent();
        }
      }
    },
    inputFile(newFile, oldFile) {
      if (newFile && !oldFile) {
        // add
        console.log("add", newFile);
      }
      if (newFile && oldFile) {
        // update
        console.log("update", newFile);
      }
      if (!newFile && oldFile) {
        // remove
        console.log("remove", oldFile);
      }
    },
    openUploadImg() {
      console.log(this.$refs.upload);
      this.menu.uploadDialog = true;
    },
    uploadImg() {
      this.menu.uploadDialog = false;
    },
    cancelUploadImg() {
      this.menu.uploadDialog = false;
    },
    submitHouse() {
      this.$refs.houseForm.validate();
      this.stepNum++;
    }
  }
};
</script>
<style lang="stylus" scoped>
.house-new {
  position: relative;

  .center-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .new-stepper {
    background: #f5f5f5;
  }
}
</style>
