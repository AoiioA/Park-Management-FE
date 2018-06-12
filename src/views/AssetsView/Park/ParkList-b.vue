<template>
  <div class="park-list" v-resize="onResize">
    <v-jumbotron height="auto">
      <v-container grid-list-xl fill-height>
        <v-layout align-start align-content-start wrap>
          <v-flex xs12 sm4 md3 xl2 offset-xl1>
            <v-card>
              <v-btn
                tag="v-container"
                flat
                block
                color="primary"
                class="px-0 py-0 text-xs-center"
                @click="1"
                style="height: 168px;cursor: pointer;"
              >
                <v-layout column justify-center>
                  <span><v-icon size="48">add</v-icon></span>
                  <span>添加园区</span>
                </v-layout>
              </v-btn>
              <v-divider></v-divider>
              <v-btn
                tag="v-container"
                flat
                block
                color="primary"
                class="px-0"
                style="height: 53px;cursor: pointer;"
                @click="1"
              >
                <v-icon>link</v-icon>
                了解更多
              </v-btn>
            </v-card>
          </v-flex>
          <v-flex xs12 sm8 md9 xl8>
            <v-data-iterator
              content-tag="v-layout"
              :column="$vuetify.breakpoint.xs"
              no-wrap
              :items="parkInfoList"
              :rows-per-page-items="['']"
              :pagination.sync="pagination"
            >
              <v-flex
                slot="item"
                slot-scope="props"
                xs12
                sm6
                md4
                xl3
              >
                <v-card>
                  <v-card-title><h4>{{ props.item.parkName }}</h4></v-card-title>
                  <v-divider></v-divider>
                  <v-list dense>
                    <v-list-tile>
                      <v-list-tile-content>面积(m²):</v-list-tile-content>
                      <v-list-tile-content class="align-end">{{ props.item.acreage }}</v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile>
                      <v-list-tile-content>建筑数量:</v-list-tile-content>
                      <v-list-tile-content class="align-end">{{ props.item.buildingNumber }}</v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile>
                      <v-list-tile-content>地址:</v-list-tile-content>
                      <v-list-tile-content class="align-end">{{ `${props.item.city} ${props.item.district}` }}</v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile>
                      <v-list-tile-content>环境描述:</v-list-tile-content>
                      <v-list-tile-content class="align-end">{{ props.item.environment }}</v-list-tile-content>
                    </v-list-tile>
                  </v-list>
                </v-card>
              </v-flex>
              <v-flex slot="no-data" style="height: 246px; line-height: 246px;">
                <v-progress-circular indeterminate color="primary" v-if="networkLoading"></v-progress-circular>
                <div v-else-if="networkError">网络出现异常 - 检查网络后刷新重试</div>
                <div v-else>暂无园区记录 - 点击左侧添加</div>
              </v-flex>
            </v-data-iterator>
          </v-flex>
        </v-layout>
      </v-container>
    </v-jumbotron>
  </div>
</template>
<script>
export default {
  data: () => ({
    networkLoading: false,
    networkError: false,
    parkInfoList: [],
    newParkInfo: {
      parkName: { text: "园区名称", value: "" },
      acreage: { text: "面积(m²)", value: "" },
      buildingNumber: { text: "建筑数量", value: "" },
      fullAddress: { text: "地址", value: "" },
      environment: { text: "环境描述", value: "" }
    },
    pagination: {
      rowsPerPage: 3
    },
    pageSize: ["xs", "sm", "md", "lg", "xl"]
  }),
  mounted() {
    this.initialize();
  },
  methods: {
    onResize() {
      // 判断页面宽度，调整显示个数
      let num = 1 + this.pageSize.indexOf(this.$vuetify.breakpoint.name);
      if (num <= 1) {
        // 不存在或为xs时，显示5个
        this.pagination.rowsPerPage = 5;
      } else if (num > 3) {
        // 出现侧边栏时，数量减一
        this.pagination.rowsPerPage = num - 1;
      } else {
        this.pagination.rowsPerPage = num;
      }
    },
    initialize() {
      this.networkLoading = true;
      this.$http
        .post("/cms/parkInfo/listParkInfo.json", {})
        .then(res => {
          let resData = res.data.data;
          this.parkInfoList = resData && resData.length ? resData : [];
          // this.parkInfoList.map(el => {
          //   return Object.assign(el, {
          //     fullAddress: `${el.province} ${el.city} ${el.district} ${el.address}`
          //   });
          // });
          this.networkLoading = false;
        })
        .catch(() => {
          this.networkLoading = false;
          this.networkError = true;
        });
    }
  }
};
</script>
<style lang="stylus" scoped></style>
