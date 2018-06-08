<template>
  <v-jumbotron height="auto">
    <v-progress-linear v-if="networkLoading" indeterminate class="my-0"></v-progress-linear>
    <v-alert v-else-if="networkError" :value="true" type="error">网络出现异常 - 检查网络后刷新重试</v-alert>
    <v-container v-else grid-list-lg>
      <v-layout justify-center align-center>
        <v-flex xs12 lg10>
          <v-subheader class="px-0">
            {{ `${houseInfo.floorNumber}层 - ${houseInfo.doorNumber}室` }}
            <small v-if="houseInfo.parkName">{{ `${houseInfo.parkName} - ` }}</small>
            <small>{{ houseInfo.buildingName }}</small>
            <v-spacer></v-spacer>
            <v-btn depressed color="primary">编辑房源信息</v-btn>
          </v-subheader>
        </v-flex>
      </v-layout>
      <v-layout wrap>
        <v-flex xs12 md6>
          <!-- <v-subheader></v-subheader> -->
          <v-card>
            <!-- <v-card-title><h4>{{ houseInfo.doorNumber }}</h4></v-card-title>
            <v-divider></v-divider> -->
            <v-list dense style="height: 208px;overflow: auto;">
              <v-list-tile>
                <v-list-tile-content>编号:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ houseInfo.contractNo }}</v-list-tile-content>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-content>签署地址:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ houseInfo.address }}</v-list-tile-content>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-content>记租前免租:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ houseInfo.beforeFree }}天</v-list-tile-content>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-content>记租后免租:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ houseInfo.afterFree }}天</v-list-tile-content>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-content>押金:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ houseInfo.deposit }}元</v-list-tile-content>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-content>违约金:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ houseInfo.liquidatedDamages }}元</v-list-tile-content>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-content>租金缴纳间隔:</v-list-tile-content>
                <v-list-tile-content class="align-end">每{{ houseInfo.month }}个月</v-list-tile-content>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-content>创建日期:</v-list-tile-content>
                <v-list-tile-content v-if="houseInfo.createDate" class="align-end">{{ houseInfo.createDate.slice(0, 10) }}</v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-jumbotron>
</template>

<script>
export default {
  data: () => ({
    networkLoading: false,
    networkError: null,
    decorationInfo: ["毛坯", "简装修", "中等装修", "豪华装修", "精装修"],
    houseInfo: {
      // 建筑信息
      parkId: "",
      parkName: "",
      buildingId: "",
      buildingName: "",
      floorNumber: "",
      doorNumber: "",
      orientation: "",
      buildArea: "",
      usageRate: "",
      accommodatingNumber: "",
      decorationSituation: "",
      isDecoration: 1,
      isOfficeFurniture: 1,
      isRegister: 1,
      isFireProcedure: 1,
      // 财务信息
      houseType: "",
      price: "",
      priceUnit: "",
      propertyFee: "",
      remark: ""
    }
  }),
  created() {
    this.initialize();
  },
  methods: {
    initialize() {
      this.networkLoading = true;
      this.houseInfo = {};
      this.$http
        .post("/cms/houseInfo/queryHouseInfoByHouseNo.json", {
          houseNo: Number(this.$route.params.houseNo)
        })
        .then(res => {
          this.networkLoading = false;
          let resData = res.data.data;
          this.houseInfo = resData;
          this.$store.commit(
            "changeToolBarTitle",
            `${this.houseInfo.floorNumber}层 - ${this.houseInfo.doorNumber}室`
          );
        })
        .catch(err => {
          this.networkLoading = false;
          this.networkError = true;
          this.$store.commit("addSnackBar", `房源信息查询失败 ${err}`, "error");
        });
    }
  }
};
</script>
