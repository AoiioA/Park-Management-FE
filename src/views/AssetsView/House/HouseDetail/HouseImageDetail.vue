<template>
  <v-jumbotron height="auto" class="house-image">
    <v-container grid-list-lg>
      <v-layout justify-center align-center>
        <v-flex xs12 lg10>
          <v-subheader class="px-0">
            房源图片
            <v-spacer></v-spacer>
            <file-upload
              ref="uploadEl"
              v-model="newFileList"
              :data="{ type: 2, id: $route.params.houseNo }"
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
            >
              <v-btn color="primary" depressed class="mx-0">添加图片</v-btn>
            </file-upload>
          </v-subheader>
        </v-flex>
      </v-layout>
      <v-data-iterator
        :items="houseImageList"
        :rows-per-page-items="rowsPerPageItems"
        :pagination.sync="pagination"
        content-tag="v-layout"
        row
        wrap
      >
        <v-flex slot="item" slot-scope="props" xs12 sm4 md3 xl2>
          <v-card flat>
            <v-card-media
              :src="`http://122.115.50.65/filesystem/housePhoto/${$route.params.houseNo}/${props.item.photoNewname}`"
              height="200px"
            >
              <v-container fill-height fluid class="image-container">
                <v-layout column>
                  <v-flex class="text-xs-right">
                    <v-tooltip top>
                      <v-btn slot="activator" :loading="props.item.loading" @click="delFile(props.index)" icon dark class="mx-0 my-0">
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
        <v-flex slot="no-data" class="no-data">
          <v-progress-circular indeterminate color="primary" v-if="networkLoading"></v-progress-circular>
          <span v-else-if="networkError">网络出现异常 - 检查网络后刷新重试</span>
          <span v-else>暂无图片 - <a @click.native="1">点击此处添加</a></span>
        </v-flex>
      </v-data-iterator>
    </v-container>
  </v-jumbotron>
</template>

<script>
import ImageCompressor from "image-compressor.js";
import FileUpload from "vue-upload-component";

export default {
  components: {
    FileUpload
  },
  data: () => ({
    networkLoading: false,
    networkError: null,
    rowsPerPageItems: [4, 8, 12],
    pagination: {
      rowsPerPage: 4
    },
    newFileList: [],
    houseImageList: [],
    upload: {
      postAction:
        "http://122.115.50.65/cms/housePhotoInfo/uploadTypePhoto.json",
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
      this.houseImageList = [];
      this.$http
        .post("/cms/housePhotoInfo/findFileName.json", {
          id: this.$route.params.houseNo,
          type: 2
        })
        .then(res => {
          this.networkLoading = false;
          let resData = res.data.data;
          this.houseImageList = resData;
        })
        .catch(err => {
          this.networkLoading = false;
          this.networkError = true;
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
            this.houseImageList.push(res.data);
            this.$refs.uploadEl.remove(newFile.id);
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
            this.houseImageList.splice(index, 1);
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
.no-data
  height 300px
  line-height 300px
  text-align center

.house-image
  .image-container
    opacity 0
    background rgba(128, 128, 128, 0.3)
    transition 0.3s ease
    &:hover
      opacity 1
</style>
