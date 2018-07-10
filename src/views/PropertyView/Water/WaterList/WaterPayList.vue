<template>
  <v-jumbotron height="auto">
    <v-container grid-list-xl fill-height>
      <v-layout align-start align-content-start justify-center wrap>
        <v-flex xs12 xl10>
          <v-subheader>待缴水费账单</v-subheader>
          <v-form ref="searchHouseForm" v-model="searchHouseValid" lazy-validation>
            <v-layout row wrap align-center>
              <v-flex xs6 sm3 lg2 style="min-width: 160px;"><v-autocomplete dense v-model="searchFilter.userId" @change="getContract(searchFilter.userId)" :items="searchFilterData.company" item-text="companyName" item-value="id" label="客户名称" clearable solo hide-details></v-autocomplete></v-flex>
              <v-flex xs6 sm3 lg2 style="min-width: 160px;"><v-autocomplete dense :disabled="!searchFilter.userId" v-model="searchFilter.contractNo" :items="searchFilterData.contract" item-text="contractName" item-value="contractNo" label="合同名称" clearable solo hide-details></v-autocomplete></v-flex>
              <v-flex xs12 sm3>
                <v-dialog ref="monthdialog" v-model="menu.waterMonthMenu" :return-value.sync="searchFilter.waterMonth" lazy full-width width="290px">
                  <v-text-field slot="activator" v-model="searchFilter.waterMonth" label="月份" clearable solo hide-details readonly></v-text-field>
                  <v-date-picker v-model="searchFilter.waterMonth" @input="$refs.monthdialog.save(searchFilter.waterMonth)" :first-day-of-week="0" show-current scrollable locale="zh-cn" type="month"></v-date-picker>
                </v-dialog>
              </v-flex>
              <v-spacer></v-spacer>
              <v-flex xs12 sm3 lg2><v-btn :disabled="!searchHouseValid" @click="initialize" block large color="primary">开始搜索</v-btn></v-flex>
            </v-layout>
          </v-form>
        </v-flex>
        <v-flex xs12 xl10>
          <v-card>
            <v-data-table
              :no-data-text="networkError?`网络出现异常 - 检查网络后刷新重试`:`暂无记录`"
              :no-results-text="`没能找到“${ search }”的结果...`"
              :search="search"
              :pagination.sync="pagination"
              :headers="headers"
              :loading="networkLoading"
              :items="waterBillList"
              item-key="id"
            >
              <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
              <template slot="items" slot-scope="props">
                <td>{{ props.item.contractNo }}</td>
                <td>{{ props.item.waterMonth }}</td>
                <td>{{ props.item.status }}</td>
                <td class="text-xs-right">{{ props.item.totalAmount }}</td>
                <td class="text-xs-right">{{ props.item.totalWaterFee }}</td>
                <td class="text-xs-right">{{ props.item.lastPayment }}</td>
                <td class="text-xs-right">{{ props.item.residualPayment }}</td>
                <td class="text-xs-center">
                  <v-btn flat icon small color="grey darken-1" class="ma-0" :to="{ name: 'water-detail', params: { waterNo: props.item.no } }">
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
    searchHouseValid: true,
    searchFilter: {
      userId: "",
      contractNo: "",
      waterMonth: ""
    },
    searchFilterData: {
      company: [],
      contract: []
    },
    menu: {
      waterMonthMenu: false
    },
    search: "",
    pagination: {
      sortBy: "waterMonth",
      descending: true
    },
    headers: [
      { text: "合同编号", value: "contractNo" },
      { text: "月份", value: "waterMonth" },
      { text: "状态", value: "status" },
      { text: "用水量", value: "totalAmount", align: "right" },
      { text: "账单总额", value: "totalWaterFee", align: "right" },
      { text: "上次缴纳", value: "lastPayment", align: "right" },
      { text: "剩余应缴", value: "residualPayment", align: "right" },
      { text: "操作", value: "id", align: "center", sortable: false }
    ],
    waterBillList: []
  }),
  mounted() {
    this.initialize();
    this.getCompany();
  },
  methods: {
    initialize() {
      this.networkLoading = true;
      this.$http
        .post("/cms/waterBillSub/selectWaterBillSub.json", this.searchFilter)
        .then(res => {
          let resData = res.data.data;
          this.waterBillList = resData && resData.length ? resData : [];
        })
        .catch(() => {
          this.networkError = true;
        })
        .finally(() => (this.networkLoading = false));
    },
    getCompany() {
      this.$http
        .get("/cms/companyInfo/companyNameList.json")
        .then(
          res =>
            (this.searchFilterData.company =
              res.data && res.data.length ? res.data : [])
        )
        .catch(err =>
          this.$store.commit("addSnackBar", `客户名称查询失败 ${err}`, "error")
        );
    },
    getContract(companyId) {
      this.searchFilterData.contract = [];
      this.$http
        .get("/cms/contract/queryContractNameById", {
          params: {
            id: companyId
          }
        })
        .then(
          res =>
            (this.searchFilterData.contract =
              res.data && res.data.length ? res.data : [])
        )
        .catch(err =>
          this.$store.commit("addSnackBar", `客户合同查询失败 ${err}`, "error")
        );
    }
  }
};
</script>
