<template>
  <v-jumbotron height="auto" class="house-image">
    <v-progress-linear v-if="networkLoading" indeterminate class="my-0"></v-progress-linear>
    <v-alert v-else-if="networkError" :value="true" type="error">网络出现异常 - 检查网络后刷新重试</v-alert>
    <v-container grid-list-xl v-else>
      <v-layout justify-center align-center>
        <v-flex xs12 lg10>
          <v-subheader>
            房源图片
            <v-spacer></v-spacer>
            <file-upload
              ref="uploadEl"
              v-model="newImageList"
              :data="{ type: 2, id: $route.params.houseNo }"
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
            >
              <v-btn tag="span" color="primary" depressed class="mx-0" style="cursor: pointer;">
                <span v-if="!newImageList.length">添加图片</span>
                <span v-else>更换待传图片</span>
              </v-btn>
            </file-upload>
          </v-subheader>
        </v-flex>
      </v-layout>
      <v-layout justify-center align-center>
        <v-flex xs12 lg10>
          <v-layout wrap>
            <v-flex v-if="!houseImageList.length&&!newImageList.length" class="no-data">暂无房源图片</v-flex>
            <v-flex v-for="(imageItem, imageIndex) in houseImageList" :key="imageItem.id" xs12 sm4 md3 xl2>
              <v-card flat>
                <v-card-media
                  :src="`${$store.getters.getBaseUrl}/filesystem/housePhoto/${$route.params.houseNo}/${imageItem.photoNewname}`"
                  height="200px"
                >
                  <v-container fill-height fluid class="image-container">
                    <v-layout column>
                      <v-flex class="text-xs-right">
                        <v-dialog v-model="menu.delDialog" persistent max-width="290">
                          <v-tooltip slot="activator" left>
                            <v-btn slot="activator" :loading="imageItem.loading" icon dark class="mx-0 my-0">
                              <v-icon>cloud_off</v-icon>
                            </v-btn>
                            <span>移除</span>
                          </v-tooltip>
                          <v-card>
                            <v-card-title class="headline">确认删除照片?</v-card-title>
                            <v-card-text>请您谨慎进行此操作。</v-card-text>
                            <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn color="primary" flat @click.native="menu.delDialog = false">再看看</v-btn>
                              <v-btn color="error" flat @click.native="delFile(imageIndex)">我确认</v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-dialog>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-media>
              </v-card>
            </v-flex>
            <v-flex v-for="newImageItem in newImageList" :key="newImageItem.id" xs12 sm4 md3 xl2>
              <v-card flat>
                <v-card-media
                  class="white--text"
                  :src="newImageItem.thumb"
                  height="200px"
                >
                  <v-container fill-height fluid style="background: rgba(128,128,128,.3)">
                    <v-layout column>
                      <v-flex class="text-xs-right">
                        <v-btn
                          slot="activator"
                          :disabled="upload.minSize>newImageItem.size||newImageItem.size>upload.size"
                          :loading="$refs.uploadEl && $refs.uploadEl.active"
                          @click.prevent="$refs.uploadEl.active = true"
                          small icon dark
                          class="mx-0 my-0"
                        ><v-icon>cloud_queue</v-icon></v-btn>
                        <v-btn
                          slot="activator"
                          :disabled="$refs.uploadEl && $refs.uploadEl.active"
                          @click.prevent="$refs.uploadEl.remove(newImageItem)"
                          small icon dark
                          class="mx-0 my-0"
                        ><v-icon>close</v-icon></v-btn>
                      </v-flex>
                      <v-flex xs12></v-flex>
                      <v-flex class="caption" style="white-space:normal; word-break:break-all;">
                        {{newImageItem.name}}<br />{{newImageItem.size | formatSize}}
                        <small v-if="newImageItem.size>upload.size" class="red--text">(过大)</small>
                        <small v-if="upload.minSize>newImageItem.size" class="red--text">(过小)</small>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-media>
              </v-card>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-container>
  </v-jumbotron>
</template>

<script>
import ImageCompressor from "image-compressor.js";
import FileUpload from "vue-upload-component";

export default {
  name: "house-image-detail",
  components: {
    FileUpload
  },
  data: () => ({
    networkLoading: false,
    networkError: null,
    menu: {
      delDialog: false
    },
    rowsPerPageItems: [4, 8, 12],
    pagination: {
      rowsPerPage: 4
    },
    newImageList: [],
    houseImageList: [],
    upload: {
      postAction: "/cms/housePhotoInfo/uploadTypePhoto.json",
      accept: "image/png,image/gif,image/jpeg,image/webp",
      extensions: /\.(gif|jpe?g|png|webp)$/i,
      size: 1024 * 1024 * 2,
      minSize: 128 * 1024,
      multiple: false,
      thread: 1,
      directory: false,
      dropDirectory: false
    }
  }),
  created() {
    this.initialize();
  },
  watch: {
    $route() {
      this.initialize();
    }
  },
  methods: {
    initialize() {
      this.networkLoading = true;
      this.networkError = null;
      this.houseImageList = [];
      this.$http
        .post("/cms/housePhotoInfo/findFileName.json", {
          id: this.$route.params.houseNo,
          type: 2
        })
        .then(res => {
          let resData = res.data.data;
          this.houseImageList = resData;
        })
        .catch(() => {
          this.networkError = true;
          this.$store.commit("addErrorBar", "房源图片查询失败");
        })
        .finally(() => (this.networkLoading = false));
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
              this.$refs.uploadEl.update(newFile, {
                error: "",
                file,
                size: file.size,
                type: file.type
              });
            })
            .catch(err => {
              this.$refs.uploadEl.update(newFile, {
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
            this.$refs.uploadEl.update(newFile, { error: "size" });
          }
        }

        // 上传进度
        if (newFile.progress !== oldFile.progress) {
          // console.log("progress", newFile.progress, newFile);
        }

        // 上传错误
        if (newFile.error && !oldFile.error) {
          // console.log("error", newFile.error, newFile, newFile.xhr.response);
          this.$store.commit("addErrorBar", `图片上传失败: ${newFile.error}`);
        }

        // 上传成功
        if (newFile.success && !oldFile.success) {
          // console.log("success", newFile.success, newFile.xhr);
          let res = JSON.parse(newFile.xhr.response);
          if (res.code == 0) {
            this.$refs.uploadEl.remove(newFile.id);
            // res.data.photoNewname = res.data.name;
            // this.houseImageList.push(res.data);
            this.$store.commit("addSuccessBar", "图片上传成功");
            this.initialize();
          } else {
            this.$store.commit("addErrorBar", `图片上传失败: ${res.msg}`);
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
            this.$store.commit("addSuccessBar", "图片删除成功");
            this.initialize();
          } else {
            throw new Error(res.data.msg);
          }
        })
        .catch(err =>
          this.$store.commit("addErrorBar", `图片删除失败: ${err}`)
        );
    }
  }
};
</script>

<style lang="stylus" scoped>
.no-data {
  height: 300px;
  line-height: 300px;
  text-align: center;
}

.house-image {
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
