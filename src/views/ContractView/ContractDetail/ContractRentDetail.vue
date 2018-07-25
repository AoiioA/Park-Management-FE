<template>
  <v-jumbotron height="auto">
    <v-progress-circular indeterminate color="primary" v-if="networkLoading" class="center-box"></v-progress-circular>
    <v-alert v-else-if="networkError" :value="true" type="error" class="center-box">网络出现异常 - 检查网络后刷新重试</v-alert>
    <v-container grid-list-xl fluid v-else>
      <v-layout justify-center wrap>
        <v-flex xs12>
          <v-subheader>
            <span style="width: 120px">
              <v-select
                @change="val => initialize(val)"
                :items="moneyMenu"
                v-model="moneyType"
                :hint="`切换账单类型`"
                persistent-hint
                single-line
                class="pt-0"
              ></v-select>
            </span>
          </v-subheader>
        </v-flex>
      </v-layout>
      <v-layout justify-center wrap>
        <v-flex xs12 sm4>
          <v-card>
          </v-card>
        </v-flex>
        <v-flex xs12 sm8 v-if="CTRTRentBill.length">
          <v-data-table
            :headers="moneyHeaders"
            :items="CTRTRentBill"
            item-key="id"
            no-data-text="暂无交易明细"
            class="elevation-1"
          >
            <template slot="items" slot-scope="props">
              <td v-if="props.item.rentType">{{ props.item.rentType }}</td>
              <td v-if="props.item.payDate">{{ props.item.payDate.slice(0, 10) }}</td>
              <!-- <td v-if="props.item.fromDate">{{ props.item.fromDate.slice(0, 10) }}</td>
              <td v-if="props.item.endDate">{{ props.item.endDate.slice(0, 10) }}</td> -->
              <td>{{ props.item.totalRent.toFixed(2) }}元</td>
              <td>{{ props.item.realRent.toFixed(2) }}元</td>
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
    networkLoading: false,
    networkError: null,
    moneyMenu: ["租金账单", "水费账单", "电费账单"],
    moneyType: "租金账单",
    CTRTRentBill: {},
    CTRTWaterBill: {},
    CTRTElectricBill: {},
    CTRTRentWA: {},
    CTRTWaterWA: {},
    CTRTElectricWA: {},
    moneyHeaders: [
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
          this.getRent();
          break;
        case "水费账单":
          this.getRent();
          break;
        case "电费账单":
          this.getRent();
          break;
        default:
          this.networkError = "参数错误";
      }
    },
    getRent() {
      this.networkLoading = true;
      this.networkError = null;
      this.$http
        .post(`/cms/rentBill/contractRentList.json`, {
          contractNo: this.CTRTNo,
          limit: 99999,
          page: 1
        })
        .then(res => (this.CTRTRentBill = res.data.data))
        .catch(err => {
          this.networkError = err;
          this.$store.commit("addErrorBar", "合同详情查询失败");
        })
        .finally(() => (this.networkLoading = false));
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
