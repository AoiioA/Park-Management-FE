<template>
  <v-jumbotron height="auto">
    <v-container grid-list-xl fill-height>
      <v-layout align-start align-content-start justify-center wrap>
        <v-flex xs12 xl10>
          <v-subheader>待提交合同</v-subheader>
          <v-card>
            <v-toolbar flat color="white">
              <v-text-field
                flat
                solo
                prepend-icon="search"
                label="在合同中检索..."
                v-model="search"
                hide-details
              ></v-text-field>
              <v-tooltip bottom>
                <v-btn icon @click="initialize" slot="activator">
                  <v-icon>refresh</v-icon>
                </v-btn>
                <span>刷新数据</span>
              </v-tooltip>
            </v-toolbar>
            <v-divider></v-divider>
            <v-data-table
              :no-data-text="networkError?`网络出现异常 - 检查网络后刷新重试`:`暂无记录`"
              :no-results-text="`没能找到“${ search }”的结果...`"
              :search="search"
              :headers="headers"
              :loading="networkLoading"
              :items="contractList"
              item-key="id"
            >
              <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
              <template slot="items" slot-scope="props">
                <td>{{ props.item.contractNo }}</td>
                <td>{{ props.item.contractName }}</td>
                <td>{{ props.item.companyName }}</td>
                <td>{{ props.item.signedPersonA }}</td>
                <td>{{ props.item.signingDate.slice(0, 10) }}</td>
                <td>{{ props.item.startDate.slice(0, 10) }}</td>
                <td>{{ props.item.endDate.slice(0, 10) }}</td>
                <td class="text-xs-center">
                  <v-btn flat icon small color="primary" class="ma-0" :to="{ name: 'contract-detail', query: { contractType: 'editing' }, params: { contractId: props.item.id } }">
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
    headers: [
      { text: "合同编号", value: "contractNo", sortable: false },
      { text: "合同名", value: "contractName" },
      { text: "承租方", value: "companyName" },
      { text: "甲方签订人", value: "signedPersonA" },
      { text: "签订日期", value: "signingDate" },
      { text: "计租日期", value: "startDate" },
      { text: "到期日期", value: "endDate" },
      { text: "操作", value: "id", align: "center", sortable: false }
    ],
    contractList: []
  }),
  watch: {
    $route(val) {
      if (JSON.stringify(val.query) == "{}") this.initialize();
    }
  },
  mounted() {
    this.initialize();
  },
  methods: {
    initialize() {
      this.networkLoading = true;
      this.$http
        .post("/cms/contractSub/queryByState.json", {
          contractState: "待提交"
        })
        .then(res => {
          let resData = res.data.data.list;
          this.contractList = resData && resData.length ? resData : [];
        })
        .catch(() => {
          this.networkError = true;
        })
        .finally(() => (this.networkLoading = false));
    }
  }
};
</script>
