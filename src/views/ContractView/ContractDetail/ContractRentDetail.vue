<template>
  <v-jumbotron height="auto">
    <v-container grid-list-xl fluid>
      <v-layout justify-center wrap>
        <v-flex xs12>
          <div style="width: 180px">
            <v-select @change="val => initialize(val)" v-model="moneyType" :items="moneyMenu" label="切换账单类型" solo hide-details></v-select>
          </div>
        </v-flex>
      </v-layout>
      <v-layout justify-center wrap>
        <v-flex xs12 sm4>
          <v-card>
            <v-data-iterator
              :items="CTRTBill"
              :loading="networkLoading.bill"
              hide-actions
              content-tag="v-list"
              style="height: 356px; overflow-x: auto;"
            >
              <template slot="item" slot-scope="props">
                <v-list-tile avatar>
                  <v-list-tile-content>
                    <v-list-tile-title>{{ props.item.cashReceipts>=0?"支付":"退款" }}{{ props.item.cashReceipts }}元</v-list-tile-title>
                    <v-list-tile-sub-title>交易人 : {{ props.item.payerName }}</v-list-tile-sub-title>
                  </v-list-tile-content>
                  <v-list-tile-action>
                    <v-list-tile-action-text>{{ props.item.rentType }}</v-list-tile-action-text>
                    <v-list-tile-action-text>{{ props.item.paymentTime.slice(0, 10) }}</v-list-tile-action-text>
                  </v-list-tile-action>
                </v-list-tile>
                <v-divider v-if="props.index + 1 < CTRTBill.length"></v-divider>
              </template>
              <template slot="no-data">
                <span class="center-box">{{ networkError.bill?'流水账查询失败':'暂无流水账' }}</span>
              </template>
            </v-data-iterator>
          </v-card>
        </v-flex>
        <v-flex xs12 sm8>
          <v-data-table
            :headers="rentHeaders"
            :items="CTRTRent"
            item-key="id"
            :loading="networkLoading.rent"
            :no-data-text="networkError.rent?'交易明细查询失败':'暂无交易明细'"
            class="elevation-1"
          >
            <template slot="items" slot-scope="props">
              <td v-if="props.item.rentType">{{ props.item.rentType }}</td>
              <td v-if="props.item.payDate">{{ props.item.payDate.slice(0, 10) }}</td>
              <!-- <td v-if="props.item.fromDate">{{ props.item.fromDate.slice(0, 10) }}</td>
              <td v-if="props.item.endDate">{{ props.item.endDate.slice(0, 10) }}</td> -->
              <td>{{ props.item.totalRent }}元</td>
              <td>{{ props.item.realRent }}元</td>
              <td>{{ props.item.state }}</td>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-container>
  </v-jumbotron>
</template>

<script>
export default {
  name: "contract-rent-detail",
  data: () => ({
    networkLoading: {
      rent: false,
      bill: false
    },
    networkError: {
      rent: null,
      bill: null
    },
    moneyMenu: ["租金账单", "水费账单", "电费账单"],
    moneyType: "租金账单",
    CTRTRent: [],
    CTRTBill: [],
    rentHeaders: [
      { text: "费用类型", value: "rentType", sortable: false },
      { text: "应缴日期", value: "payDate", sortable: false },
      // { text: "计费起始日期", value: "fromDate", sortable: false },
      // { text: "计费截至日期", value: "endDate", sortable: false },
      { text: "应缴金额", value: "totalRent", sortable: false },
      { text: "剩余应缴", value: "realRent", sortable: false },
      { text: "费用状态", value: "state", sortable: false }
    ]
  }),
  props: {
    CTRTNo: {
      type: String,
      required: true
    }
  },
  created() {
    this.initialize(this.moneyType);
  },
  methods: {
    initialize(moneyType) {
      switch (moneyType) {
        case "租金账单":
          this.getRentRent();
          this.getRentBill();
          break;
        case "水费账单":
          this.getWaterRent();
          this.getWaterBill();
          break;
        case "电费账单":
          this.getElectricRent();
          this.getElectricBill();
          break;
        default:
          this.networkError = "参数错误";
      }
    },
    getRentRent() {
      this.getRent("/cms/rentBill/contractRentList.json", d => d);
    },
    getRentBill() {
      this.getBill("/cms/rentBill/view.json", d => d);
    },
    getWaterRent() {
      this.getRent("/cms/waterBillSub/queryWaterBillSub.json", d =>
        this.translateWaterRent(d)
      );
    },
    getWaterBill() {
      this.getBill("/cms/waterBillSub/viewWaterBills", d =>
        this.translateWaterBill(d)
      );
    },
    getElectricRent() {
      this.getRent("/cms/electricBillSub/queryElectricBillSub.json", d =>
        this.translateElectricRent(d)
      );
    },
    getElectricBill() {
      this.getBill("/cms/electricBillSub/viewElectricBills", d =>
        this.translateElectricBill(d)
      );
    },
    getRent(url, cb) {
      this.networkLoading.rent = true;
      this.networkError.rent = null;
      this.CTRTRent = [];
      this.$http
        .post(url, {
          contractNo: this.CTRTNo,
          limit: 99999,
          page: 1
        })
        .then(res => {
          if (res.data.code == 500) {
            throw new Error(res.data.msg);
          }
          this.CTRTRent = cb(res.data.data);
        })
        .catch(err => {
          this.networkError.rent = err;
          this.$store.commit("addErrorBar", "租金明细查询失败");
        })
        .finally(() => (this.networkLoading.rent = false));
    },
    getBill(url, cb) {
      this.networkLoading.bill = true;
      this.networkError.bill = null;
      this.CTRTBill = [];
      this.$http
        .post(url, {
          contractNo: this.CTRTNo,
          limit: 99999,
          page: 1
        })
        .then(res => {
          if (res.data.code == 500) {
            throw new Error(res.data.msg);
          }
          this.CTRTBill = cb(res.data.data);
        })
        .catch(err => {
          this.networkError.bill = err;
          this.$store.commit("addErrorBar", "租金流水账查询失败");
        })
        .finally(() => (this.networkLoading.bill = false));
    },
    translateWaterRent(list) {
      return list.map(item => ({
        rentType: "水费账单",
        payDate: item.waterMonth,
        totalRent: item.totalWaterFee,
        realRent: item.residualPayment,
        status: item.status
      }));
    },
    translateWaterBill(list) {
      return list.map(item => ({
        cashReceipts: item.lastPayment,
        rentType: `${item.waterMonth}水单`,
        paymentTime: item.createTime
      }));
    },
    translateElectricRent(list) {
      return list.map(item => ({
        rentType: "电费账单",
        payDate: item.electricMonth,
        totalRent: item.totalElectricityFees,
        realRent: item.residualPayment,
        state: item.status
      }));
    },
    translateElectricBill(list) {
      return list.map(item => ({
        cashReceipts: item.lastPayment,
        rentType: `${item.electricMonth}电单`,
        paymentTime: item.createTime
      }));
    }
  }
};
</script>

<style lang="stylus" scoped>
.center-box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
