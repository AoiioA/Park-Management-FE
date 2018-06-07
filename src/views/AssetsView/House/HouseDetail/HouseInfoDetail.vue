<template>
  <v-jumbotron height="auto">
    <v-progress-linear v-if="networkLoading" indeterminate class="my-0"></v-progress-linear>
    <v-alert v-else-if="networkError" :value="true" type="error">网络出现异常 - 检查网络后刷新重试</v-alert>
    <v-container v-else grid-list-xl>
      <v-layout justify-center align-center>
        <v-flex xs12 lg10>
          <v-subheader class="px-0">
            <v-spacer></v-spacer>
            <v-btn depressed color="primary">编辑房源信息</v-btn>
          </v-subheader>
        </v-flex>
      </v-layout>
      <v-layout justify-center align-center>
        <v-flex xs12 lg10></v-flex>
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
          params: {
            houseNo: this.$route.params.houseNo
          }
        })
        .then(res => {
          this.networkLoading = false;
          let resData = res.data.data;
          this.houseInfo = resData;
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
