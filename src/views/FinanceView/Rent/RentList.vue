<template>
  <div class="fill-height rent-list">
    <view-tool-bar>
      <span slot="bar-menu">
        <v-btn icon>
          <v-icon>help</v-icon>
        </v-btn>
      </span>
      <span slot="bar-extend">
        <v-tabs v-model="activeTab" color="primary" class="px-4" show-arrows>
          <v-tab v-for="tab in viewToolBarTab" :key="tab.value" :to="{ name: 'rent-list', params: { rentType: tab.value } }">{{ tab.name }}</v-tab>
        </v-tabs>
      </span>
    </view-tool-bar>
    <v-jumbotron height="auto">
      <v-container grid-list-xl fill-height>
        <v-layout align-start align-content-start justify-center wrap>
          <v-flex xs12 xl10>
            <v-card>
              <v-toolbar flat dense color="white" style="overflow-x: auto;">
                <v-autocomplete v-model="searchFilter.companyName" @change="getContract" :items="searchFilterData.company" item-text="companyName" item-value="companyName" label="客户名称" class="v-overflow-btn" single-line hide-details dense clearable></v-autocomplete>
                <v-divider vertical></v-divider>
                <v-autocomplete :disabled="!searchFilter.companyName" v-model="searchFilter.contractNo" :items="searchFilterData.contract" item-text="contractName" item-value="contractNo" label="合同名称" class="v-overflow-btn" single-line hide-details dense clearable></v-autocomplete>
                <v-divider vertical></v-divider>
                <v-dialog ref="fromDateDialog" :return-value.sync="searchFilter.fromDate" lazy full-width width="290px" style="min-width: 132px">
                  <v-text-field slot="activator" v-model="searchFilter.fromDate" label="起始日期" flat solo hide-details clearable readonly></v-text-field>
                  <v-date-picker v-model="searchFilter.fromDate" @input="$refs.fromDateDialog.save(searchFilter.fromDate)" :first-day-of-week="0" show-current scrollable locale="zh-cn"></v-date-picker>
                </v-dialog>
                <v-divider vertical></v-divider>
                <v-dialog ref="endDateDialog" :return-value.sync="searchFilter.endDate" lazy full-width width="290px" style="min-width: 132px">
                  <v-text-field slot="activator" v-model="searchFilter.endDate" label="截止日期" flat solo hide-details clearable readonly></v-text-field>
                  <v-date-picker v-model="searchFilter.endDate" @input="$refs.endDateDialog.save(searchFilter.endDate)" :first-day-of-week="0" show-current scrollable locale="zh-cn"></v-date-picker>
                </v-dialog>
                <v-btn @click="initialize" large flat color="primary" class="ma-0">开始搜索</v-btn>
              </v-toolbar>
              <v-divider></v-divider>
              <v-data-table
                :no-data-text="networkError?`网络出现异常 - 检查网络后刷新重试`:`暂无记录`"
                :no-results-text="`没能找到该结果...`"
                :loading="networkLoading"
                :pagination.sync="pagination"
                :total-items="totalItems"
                :headers="headers"
                :items="rentList"
                item-key="id"
              >
                <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
                <template slot="items" slot-scope="props">
                  <td v-for="row in headers" :key="row.value" v-if="row.value" :class="[ row.align ? `text-xs-${row.align}` : '' ]">{{ row.getData(props.item[row.value]) }}</td>
                  <td class="text-xs-center">
                    <v-btn flat icon small color="primary" class="ma-0" :to="{ name: 'rent-detail', params: { rentNo: props.item.id } }">
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
  </div>
</template>

<script>
import ViewToolBar from "@/components/ViewToolBar.vue";

export default {
  components: {
    ViewToolBar
  },
  props: {
    rentType: String
  },
  data: () => ({
    viewToolBarTab: [
      {
        name: "待缴账单",
        value: "toBePaid",
        url: "/cms/rentBill/list.json"
      },
      {
        name: "已缴账单",
        value: "paid",
        url: "/cms/rentBill/receivedList.json"
      },
      {
        name: "失效账单",
        value: "invalid",
        url: "/cms/rentBill/invalidList.json"
      }
    ],
    activeTab: 0,
    networkLoading: false,
    networkError: false,
    searchFilter: {
      companyName: "",
      contractNo: "",
      fromDate: "",
      endDate: ""
    },
    searchFilterData: {
      company: [],
      contract: []
    },
    pagination: {},
    totalItems: 0,
    headers: [
      { text: "应缴日期", value: "payDate", getData: v => v.slice(0, 10) },
      { text: "公司名称", value: "companyName", getData: v => v },
      { text: "合同编号", value: "contractNo", getData: v => v },
      // { text: "合同名称", value: "contractName", getData: v => v },
      // { text: "租赁面积", value: "totalArea", getData: v => v },
      // { text: "实缴日期", value: "paymentDate", getData: v => v.slice(0, 10) },
      // { text: "起始日期", value: "fromDate", getData: v => v.slice(0, 10) },
      // { text: "截止日期", value: "endDate", getData: v => v },
      { text: "账单金额", value: "totalRent", getData: v => v.toFixed(2) },
      { text: "剩余应缴", value: "realRent", getData: v => v.toFixed(2) },
      { text: "费用类型", value: "rentType", getData: v => v },
      { text: "缴纳状态", value: "state", getData: v => v },
      { text: "操作", align: "center", sortable: false }
    ],
    rentList: []
  }),
  watch: {
    pagination: {
      handler() {
        this.initialize();
      },
      deep: true
    },
    rentType() {
      this.initialize();
    }
  },
  created() {
    this.$store.commit("changeToolBarTitle", { title: "租金概览" });
    this.getCompany();
    this.initialize();
  },
  methods: {
    initialize() {
      this.networkLoading = true;
      this.networkError = false;
      this.$http
        .post(
          this.viewToolBarTab.find(item => item.value == this.rentType).url,
          Object.assign(this.searchFilter, {
            limit: this.pagination.rowsPerPage,
            page: this.pagination.page
          })
        )
        .then(res => {
          this.totalItems = res.data.count;
          let resData = res.data.data;
          this.rentList = resData && resData.length ? resData : [];
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
        .catch(() => this.$store.commit("addErrorBar", "客户名称查询失败"));
    },
    getContract() {
      this.searchFilterData.contract = [];
      this.searchFilter.contractNo = "";
      let company = this.searchFilterData.company.find(
        item => item.companyName == this.searchFilter.companyName
      );
      if (company && typeof company.id == "number") {
        this.$http
          .get("/cms/contract/queryContractNameById", {
            params: {
              id: company.id
            }
          })
          .then(
            res =>
              (this.searchFilterData.contract =
                res.data && res.data.length ? res.data : [])
          )
          .catch(() => this.$store.commit("addErrorBar", "客户合同查询失败"));
      }
    }
  }
};
</script>
