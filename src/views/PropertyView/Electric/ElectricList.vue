<template>
  <div class="fill-height electric-list">
    <view-tool-bar>
      <span slot="bar-menu">
        <v-btn :to="{ name: 'electric-new' }" depressed color="primary">添加电费账单</v-btn>
        <v-btn icon>
          <v-icon>help</v-icon>
        </v-btn>
      </span>
      <span slot="bar-extend">
        <v-tabs color="primary" class="px-4" show-arrows>
          <v-tab v-for="tab in viewToolBarTab" :key="tab.value" :to="{ name: 'electric-list', params: { electricType: tab.value } }">{{ tab.name }}</v-tab>
        </v-tabs>
      </span>
    </view-tool-bar>
    <v-jumbotron height="auto">
      <v-container grid-list-xl fill-height>
        <v-layout align-start align-content-start justify-center wrap>
          <v-flex xs12 xl10>
            <v-card>
              <v-toolbar flat dense color="white" style="overflow-x: auto;">
                <v-autocomplete v-model="searchFilter.userId" @change="getContract" :items="searchFilterData.company" item-text="companyName" item-value="id" label="客户名称" class="v-overflow-btn" single-line hide-details dense clearable></v-autocomplete>
                <v-divider vertical></v-divider>
                <v-autocomplete :disabled="!searchFilter.userId" v-model="searchFilter.contractNo" :items="searchFilterData.contract" item-text="contractName" item-value="contractNo" label="合同名称" class="v-overflow-btn" single-line hide-details dense clearable></v-autocomplete>
                <v-divider vertical></v-divider>
                <v-dialog ref="monthdialog" :return-value.sync="searchFilter.electricMonth" lazy full-width width="290px" style="min-width: 132px">
                  <v-text-field slot="activator" v-model="searchFilter.electricMonth" label="月份" flat solo hide-details clearable readonly></v-text-field>
                  <v-date-picker v-model="searchFilter.electricMonth" @input="$refs.monthdialog.save(searchFilter.electricMonth)" :first-day-of-week="0" show-current scrollable locale="zh-cn" type="month"></v-date-picker>
                </v-dialog>
                <v-btn @click="initialize" large flat color="primary" class="ma-0">开始搜索</v-btn>
              </v-toolbar>
              <v-divider></v-divider>
              <v-data-table
                :no-data-text="networkError?`网络出现异常 - 检查网络后刷新重试`:`暂无记录`"
                :no-results-text="`没能找到“${ search }”的结果...`"
                :search="search"
                :pagination.sync="pagination"
                :total-items="totalItems"
                :headers="headers"
                :loading="networkLoading"
                :items="electricBillList"
                item-key="id"
              >
                <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
                <template slot="items" slot-scope="props">
                  <td v-for="row in headers" :key="row.value" v-if="row.value" :class="[ row.align ? `text-xs-${row.align}` : '' ]">{{ row.getData(props.item[row.value]) }}</td>
                  <td class="text-xs-center">
                    <v-btn flat icon small color="primary" class="ma-0" :to="{ name: 'electric-detail', params: { electricNo: props.item.no } }">
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
    electricType: String
  },
  data: () => ({
    viewToolBarTab: [
      {
        name: "待缴账单",
        value: "paid",
        url: "/cms/electricBillSub/selectElectricBillSub.json"
      },
      {
        name: "全部账单",
        value: "all",
        url: "/cms/electricBillSub/queryElectricBillSub.json"
      }
    ],
    networkLoading: false,
    networkError: false,
    searchFilter: {
      userId: "",
      contractNo: "",
      electricMonth: ""
    },
    searchFilterData: {
      company: [],
      contract: []
    },
    search: "",
    pagination: {},
    totalItems: 0,
    headers: [
      { text: "月份", value: "electricMonth", getData: v => v },
      { text: "合同编号", value: "contractNo", getData: v => v },
      {
        text: "用电总量",
        value: "totalElectricQuantity",
        getData: v => v,
        align: "right"
      },
      {
        text: "账单总额",
        value: "totalElectricityFees",
        getData: v => v,
        align: "right"
      },
      {
        text: "上次缴纳",
        value: "lastPayment",
        getData: v => v,
        align: "right"
      },
      {
        text: "剩余应缴",
        value: "residualPayment",
        getData: v => v,
        align: "right"
      },
      { text: "状态", value: "status", getData: v => v },
      { text: "操作", align: "center", sortable: false }
    ],
    electricBillList: []
  }),
  watch: {
    pagination: {
      handler() {
        this.initialize();
      },
      deep: true
    },
    electricType() {
      this.initialize();
    }
  },
  created() {
    this.$store.commit("changeToolBarTitle", { title: "电费管理" });
    this.getCompany();
    this.initialize();
  },
  methods: {
    initialize() {
      this.networkLoading = true;
      this.networkError = false;
      this.$http
        .post(
          this.viewToolBarTab.find(item => item.value == this.electricType).url,
          Object.assign(this.searchFilter, {
            limit: this.pagination.rowsPerPage,
            page: this.pagination.page
          })
        )
        .then(res => {
          this.totalItems = res.data.count;
          let resData = res.data.data;
          this.electricBillList = resData && resData.length ? resData : [];
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
      if (typeof this.searchFilter.userId == "number") {
        this.$http
          .get("/cms/contract/queryContractNameById", {
            params: {
              id: this.searchFilter.userId
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
