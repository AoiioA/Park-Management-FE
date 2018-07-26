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
          <v-card v-if="moneyType == '租金账单'">
            <v-data-iterator
              :items="CTRTRentWA"
              :pagination.sync="pagination"
              :loading="networkLoading.WA"
              :no-data-text="networkError.WA?'流水账查询失败':'暂无流水账'"
              hide-actions
              content-tag="v-list"
              style="min-height: 319px;"
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
                <v-divider v-if="props.index + 1 < CTRTRentWA.length"></v-divider>
              </template>
            </v-data-iterator>
            <div class="text-xs-center">
              <v-pagination v-model="pagination.page" :length="pages"></v-pagination>
            </div>
          </v-card>
          <v-card v-else>
            <v-data-iterator
              :items="CTRTOtherWA"
              :pagination.sync="pagination"
              :loading="networkLoading.WA"
              :no-data-text="networkError.WA?'流水账查询失败':'暂无流水账'"
              hide-actions
              content-tag="v-list"
              style="min-height: 319px;"
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
                <v-divider v-if="props.index + 1 < CTRTRentWA.length"></v-divider>
              </template>
            </v-data-iterator>
            <div class="text-xs-center">
              <v-pagination v-model="pagination.page" :length="pages"></v-pagination>
            </div>
          </v-card>
        </v-flex>
        <v-flex xs12 sm8>
          <v-data-table
            :headers="moneyHeaders"
            :items="CTRTBill"
            item-key="id"
            :loading="networkLoading.bill"
            :no-data-text="networkError.bill?'交易明细查询失败':'暂无交易明细'"
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
    networkLoading: {
      bill: false,
      WA: false
    },
    networkError: {
      bill: null,
      WA: null
    },
    moneyMenu: ["租金账单", "水费账单", "电费账单"],
    moneyType: "租金账单",
    CTRTBill: [],
    CTRTRentWA: [],
    CTRTOtherWA: [],
    moneyHeaders: [
      { text: "费用类型", value: "rentType", sortable: false },
      { text: "应缴日期", value: "payDate", sortable: false },
      // { text: "计费起始日期", value: "fromDate", sortable: false },
      // { text: "计费截至日期", value: "endDate", sortable: false },
      { text: "应缴金额", value: "totalRent", sortable: false },
      { text: "剩余应缴", value: "realRent", sortable: false },
      { text: "费用状态", value: "state", sortable: false }
    ],
    pagination: {}
  }),
  props: {
    CTRTNo: {
      type: String,
      required: true
    }
  },
  computed: {
    pages() {
      if (
        this.pagination.rowsPerPage == null ||
        this.pagination.totalItems == null
      ) {
        return 0;
      }
      return Math.ceil(
        this.pagination.totalItems / this.pagination.rowsPerPage
      );
    }
  },
  created() {
    this.initialize(this.moneyType);
  },
  methods: {
    initialize(moneyType) {
      switch (moneyType) {
        case "租金账单":
          this.getRentBill();
          this.getRentWA();
          break;
        case "水费账单":
          this.getWaterBill();
          this.getWaterWA();
          break;
        case "电费账单":
          this.getElectricBill();
          this.getElectricWA();
          break;
        default:
          this.networkError = "参数错误";
      }
    },
    getRentBill() {
      this.networkLoading.bill = true;
      this.networkError.bill = null;
      this.CTRTBill = [];
      this.$http
        .post("/cms/rentBill/contractRentList.json", {
          contractNo: this.CTRTNo,
          limit: 99999,
          page: 1
        })
        .then(res => {
          if (res.data.code == 500) {
            throw new Error(res.data.msg);
          }
          this.CTRTBill = res.data.data;
        })
        .catch(err => {
          this.networkError.bill = err;
          this.$store.commit("addErrorBar", "租金明细查询失败");
        })
        .finally(() => (this.networkLoading.bill = false));
    },
    getRentWA() {
      this.networkLoading.WA = true;
      this.networkError.wa = null;
      this.CTRTRentWA = [];
      this.$http
        .post("/cms/rentBill/view.json", {
          contractNo: this.CTRTNo,
          limit: 99999,
          page: 1
        })
        .then(res => {
          if (res.data.code == 500) {
            throw new Error(res.data.msg);
          }
          this.CTRTRentWA = res.data.data;
        })
        .catch(err => {
          this.networkError.wa = err;
          this.$store.commit("addErrorBar", "租金流水账查询失败");
        })
        .finally(() => (this.networkLoading.WA = false));
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
