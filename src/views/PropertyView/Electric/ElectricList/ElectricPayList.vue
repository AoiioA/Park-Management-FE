<template>
  <v-jumbotron height="auto">
    <v-container grid-list-xl fill-height>
      <v-layout align-start align-content-start justify-center wrap>
        <v-flex xs12 xl10>
          <v-subheader>待缴电费账单</v-subheader>
          <v-card>
            <v-data-table
              :no-data-text="networkError?`网络出现异常 - 检查网络后刷新重试`:`暂无记录`"
              :no-results-text="`没能找到“${ search }”的结果...`"
              :search="search"
              :pagination.sync="pagination"
              :headers="headers"
              :loading="networkLoading"
              :items="electricBillList"
              item-key="id"
            >
              <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
              <template slot="items" slot-scope="props">
                <td>{{ props.item.contractNo }}</td>
                <td>{{ props.item.waterMonth }}</td>
                <td class="text-xs-right">{{ props.item.totalAmount }}</td>
                <td class="text-xs-right">{{ props.item.totalCost }}</td>
                <td class="text-xs-right">{{ props.item.totalWaterFee }}</td>
                <td class="text-xs-right">{{ props.item.lastPayment }}</td>
                <td class="text-xs-right">{{ props.item.residualPayment }}</td>
                <td class="text-xs-center">
                  <v-btn flat icon small color="grey darken-1" class="ma-0" :to="{ name: 'electric-detail', params: { electricNo: props.item.no } }">
                    <v-icon small>visibility</v-icon>
                  </v-btn>
                </td>
              </template>
            </v-data-table>
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
    networkError: false,
    search: "",
    pagination: {
      sortBy: "waterMonth",
      descending: true
    },
    headers: [
      { text: "合同编号", value: "contractNo" },
      { text: "月份", value: "waterMonth" },
      { text: "用电量", value: "totalAmount", align: "right" },
      { text: "用电费用", value: "totalCost", align: "right" },
      { text: "账单总额", value: "totalWaterFee", align: "right" },
      { text: "上次缴纳", value: "lastPayment", align: "right" },
      { text: "剩余应缴", value: "residualPayment", align: "right" },
      { text: "操作", value: "id", align: "center", sortable: false }
    ],
    electricBillList: []
  }),
  mounted() {
    this.initialize();
  },
  methods: {
    initialize() {
      this.networkLoading = true;
      this.$http
        .post("/cms/waterBillSub/selectWaterBillSub.json", {
          contractNo: "ASDF-20180601-0005"
        })
        .then(res => {
          this.networkLoading = false;
          let resData = res.data.data;
          this.electricBillList = resData && resData.length ? resData : [];
        })
        .catch(() => {
          this.networkLoading = false;
          this.networkError = true;
        });
    }
  }
};
</script>
