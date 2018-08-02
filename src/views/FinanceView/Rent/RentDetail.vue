<template>
  <div class="fill-height rent-detail">
    <view-tool-bar>
      <span slot="bar-menu">
        <v-dialog v-model="menu.payDialog" :disabled="!rentInfo || ['未支付', '未结清'].indexOf(rentInfo.state) < 0" persistent max-width="290">
          <v-btn slot="activator" :disabled="!rentInfo || ['未支付', '未结清'].indexOf(rentInfo.state) < 0" flat class="mr-0">缴纳账单</v-btn>
          <v-form ref="payRentForm" v-model="payRentFormValid" lazy-validation>
            <v-card>
              <v-card-title primary-title class="headline">缴纳账单</v-card-title>
              <v-card-text class="pt-0">
                <v-container grid-list-md class="pa-0">
                  <v-layout wrap>
                    <v-flex xs12><v-text-field v-model.number="editedPay.cashReceipts" :rules="[$store.state.rules.required, $store.state.rules.noZero, $store.state.rules.nonnegative, v => v <= rentInfo.realRent  || '缴纳金额需小于剩余应缴纳金额']" label="缴纳金额" :hint="`剩余应缴${rentInfo.realRent}元`" persistent-hint required type="number"></v-text-field></v-flex>
                    <v-flex xs12><v-text-field v-model="editedPay.payerName" :rules="[$store.state.rules.required]" label="缴纳人" hint="" persistent-hint required></v-text-field></v-flex>
                  </v-layout>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="payRentClose(true)" flat>再看看</v-btn>
                <v-btn :disabled="!payRentFormValid" @click="payRentSave" color="primary" flat>我确认</v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-dialog>
      </span>
    </view-tool-bar>
    <v-jumbotron height="auto">
      <v-progress-linear v-if="networkLoading" indeterminate class="my-0"></v-progress-linear>
      <v-alert v-else-if="networkError" :value="true" type="error">网络出现异常 - 检查网络后刷新重试</v-alert>
      <v-container v-else grid-list-xl fluid fill-height>
        <v-layout justify-center wrap>
          <v-flex xs12 sm5 xl2>
            <v-subheader>基础信息</v-subheader>
            <v-card>
              <v-list dense>
                <v-list-tile v-for="rentData in rentDataList" :key="rentData.text">
                  <v-list-tile-content>{{ rentData.text }} : </v-list-tile-content>
                  <v-list-tile-content class="align-end">{{ rentData.getData(rentInfo[rentData.value]) }}</v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-card>
          </v-flex>
          <v-flex xs12 sm5 xl2>
            <v-subheader>缴纳信息</v-subheader>
            <v-card height="288">
              <v-list dense>
                <v-list-tile v-for="rentPay in rentPayList" :key="rentPay.text">
                  <v-list-tile-content>{{ rentPay.text }} : </v-list-tile-content>
                  <v-list-tile-content class="align-end">{{ rentPay.getData(rentInfo[rentPay.value]) }}</v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-card>
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
    menu: {
      payDialog: false
    },
    // 租金账单
    rentInfo: {},
    rentDataList: [
      { text: "公司名称", value: "companyName", getData: v => v },
      { text: "合同编号", value: "contractNo", getData: v => v },
      { text: "合同名称", value: "contractName", getData: v => v },
      { text: "租赁面积", value: "totalArea", getData: v => `${v}m²` },
      { text: "起始日期", value: "fromDate", getData: v => v.slice(0, 10) },
      { text: "截止日期", value: "endDate", getData: v => v.slice(0, 10) },
      { text: "费用类型", value: "rentType", getData: v => v }
    ],
    rentPayList: [
      { text: "账单金额", value: "totalRent", getData: v => `${v}元` },
      { text: "剩余应缴", value: "realRent", getData: v => `${v}元` },
      { text: "应缴日期", value: "payDate", getData: v => v.slice(0, 10) },
      {
        text: "实缴日期",
        value: "paymentDate",
        getData: v => (v ? v.slice(0, 10) : "-")
      },
      { text: "缴纳状态", value: "state", getData: v => v }
    ],
    // 缴纳账单
    payRentFormValid: true,
    editedPay: {},
    defaultPay: {
      cashReceipts: 0,
      payerName: ""
    }
  }),
  watch: {
    "$route.params.rentNo"() {
      this.$router.go(0);
    }
  },
  created() {
    this.$store.commit("changeToolBarTitle", {
      title: "租金账单详情",
      isBack: true,
      crumbs: [
        {
          name: "租金账单概览",
          to: { name: "rent-list", params: { rentType: "toBePaid" } }
        },
        { name: "租金账单详情" }
      ]
    });
    this.editedPay = Object.assign({}, this.defaultPay);
    this.initialize();
  },
  methods: {
    initialize() {
      this.networkLoading = true;
      this.networkError = false;
      this.$http
        .get("/cms/rentBill/rentBillDetail.json", {
          params: {
            id: this.$route.params.rentNo
          }
        })
        .then(res => {
          if (res.data.code != 0 || !res.data.data) {
            throw new Error("未找到该帐单");
          }
          this.rentInfo = res.data.data;
        })
        .catch(() => {
          this.networkError = true;
        })
        .finally(() => (this.networkLoading = false));
    },
    payRentClose(isCancel) {
      if (!isCancel || confirm("取消后内容将不会保存")) {
        this.menu.payDialog = false;
        setTimeout(() => {
          this.$refs.payRentForm.reset();
          this.editedPay = Object.assign({}, this.defaultPay);
        }, 300);
      }
    },
    payRentSave() {
      if (this.$refs.payRentForm.validate()) {
        this.$http
          .post(
            "/cms/rentBill/update.json",
            Object.assign({ id: this.rentInfo.id }, this.editedPay)
          )
          .then(res => {
            if (res.data.code != 500) {
              this.$store.commit("addSuccessBar", "租金账单编辑成功");
              this.payRentClose(false);
              this.initialize();
            } else {
              throw new Error(res.data.msg);
            }
          })
          .catch(err =>
            this.$store.commit("addErrorBar", `租金账单编辑失败 ${err}`)
          );
      }
    }
  }
};
</script>
