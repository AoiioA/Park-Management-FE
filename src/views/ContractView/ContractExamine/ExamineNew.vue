<template>
  <v-jumbotron height="auto">
    <v-container grid-list-xl fill-height>
      <v-layout align-start align-content-start justify-center wrap>
        <v-flex xs12 xl10>
          <v-subheader>
            <span>
              <v-select
                @change="val => initialize(val.urlParams)"
                :items="contractViewArr"
                v-model="contractView"
                item-text="text"
                item-value="value"
                return-object
                :hint="`切换合同类型`"
                persistent-hint
                single-line
                class="pt-0"
              ></v-select>
            </span>
            <v-spacer></v-spacer>
          </v-subheader>
        </v-flex>
        <v-flex xs12 xl10>
          <v-card>
            <v-card-title class="py-2">
              <v-text-field
                flat
                solo
                prepend-icon="search"
                label="在合同中检索..."
                v-model="search"
              ></v-text-field>
              <v-tooltip bottom>
                <v-btn icon @click="initialize(contractView.urlParams)" slot="activator">
                  <v-icon>refresh</v-icon>
                </v-btn>
                <span>刷新数据</span>
              </v-tooltip>
            </v-card-title>
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
                <td class="px-3">
                  <v-btn icon class="mx-0" :to="{ query: { detailType: contractViewArr.find(item => item.urlParams == props.item.contractState).link, detailId: props.item.id } }">
                    <v-icon color="primary">visibility</v-icon>
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
    contractView: {
      text: "签订待审",
      value: "submitted",
      urlParams: "待审核",
      link: "submitted"
    },
    contractViewArr: [
      {
        text: "签订待审",
        value: "submitted",
        urlParams: "待审核",
        link: "submitted"
      },
      {
        text: "新签过审",
        value: "new-success",
        urlParams: "已签订",
        link: "new-success"
      },
      {
        text: "续签过审",
        value: "renew-success",
        urlParams: "已续签",
        link: "renew-success"
      },
      {
        text: "未过审",
        value: "failed",
        urlParams: "审核未通过",
        link: "failed"
      }
    ],
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
      if (JSON.stringify(val.query) == "{}") {
        this.initialize(this.contractView.urlParams);
      }
    }
  },
  mounted() {
    this.initialize(this.contractView.urlParams);
  },
  methods: {
    initialize(val) {
      this.networkLoading = true;
      this.$http
        .post("/cms/contractSub/queryByState.json", {
          contractState: val
        })
        .then(res => {
          this.networkLoading = false;
          let resData = res.data.length ? res.data : res.data.data;
          this.contractList = resData && resData.length ? resData : [];
        })
        .catch(() => {
          this.networkLoading = false;
          this.networkError = true;
        });
    }
  }
};
</script>
