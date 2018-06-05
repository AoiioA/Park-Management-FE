<template>
  <div class="fill-height house-detail">
    <view-tool-bar :barTab="viewToolBarTab">
      <span slot="bar-menu">
        <v-btn :to="{ name: 'house-new' }" depressed color="primary">添加房源</v-btn>
        <v-btn icon>
          <v-icon>help</v-icon>
        </v-btn>
      </span>
    </view-tool-bar>
    <!-- <v-tabs-items v-model="model">
      <v-tab-item
        v-for="i in 3"
        :key="i"
        :id="`tab-${i}`"
      >
        <v-card flat>
          <v-card-text v-text="text"></v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items> -->
    <v-jumbotron color="blue-grey lighten-4" height="auto">
      <v-container grid-list-xl>
        <v-layout justify-center align-center>
          <v-flex xs12 lg10>
            <v-subheader class="px-0">
              <v-btn depressed color="primary">button</v-btn>
            </v-subheader>
          </v-flex>
        </v-layout>
      </v-container>
    </v-jumbotron>
  </div>
</template>

<script>
import ViewToolBar from "@/components/ViewToolBar.vue";

export default {
  components: {
    ViewToolBar
  },
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
  computed: {
    viewToolBarTab() {
      return [
        {
          name: "资源",
          to: {
            path: "/home/house/house-detail",
            query: { houseNo: this.$route.query.houseNo, viewType: "info" }
          }
        },
        {
          name: "图片",
          to: {
            path: "/home/house/house-detail",
            query: { houseNo: this.$route.query.houseNo, viewType: "image" }
          }
        }
      ];
    }
  },
  created() {
    this.$store.commit("changeToolBarTitle", "房源详情");
    this.initialize();
  },
  methods: {
    initialize() {
      this.networkLoading = true;
      this.houseInfo = {};
      this.$http
        .post("/cms/houseInfo/queryInfoByHouseNo.json", {
          houseNo: this.$route.query.houseNo
        })
        .then(res => {
          this.networkLoading = false;
          let resData = res.data.data;
          this.houseInfo = resData;
        })
        .catch(err => {
          this.networkLoading = false;
          this.networkError = true;
          this.$store.commit("addSnackBar", `房源详情查询失败 ${err}`, "error");
        });
    }
  }
};
</script>
