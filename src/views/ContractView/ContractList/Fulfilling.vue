<template>
  <v-jumbotron height="auto">
    <v-container grid-list-xl fill-height>
      <v-layout align-start align-content-start justify-center wrap>
        <v-flex xs12 xl10>
          <v-subheader>生效中合同</v-subheader>
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
              :pagination.sync="pagination"
              :headers="headers"
              :loading="networkLoading"
              :items="contractList"
              item-key="id"
            >
              <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
              <template slot="items" slot-scope="props">
                <!-- <tr @click="props.expanded = !props.expanded"> -->
                <td>{{ props.item.signingDate.slice(0, 10) }}</td>
                <td>{{ props.item.contractNo }}</td>
                <td>{{ props.item.contractName }}</td>
                <td>{{ props.item.companyName }}</td>
                <td>{{ props.item.signedPersonA }}</td>
                <td>{{ props.item.startDate.slice(0, 10) }}</td>
                <td>{{ props.item.endDate.slice(0, 10) }}</td>
                <td class="text-xs-center">
                  <v-btn flat icon small color="primary" class="ma-0" :to="{ name: 'contract-detail', query: { contractType: 'fulfilling' }, params: { contractId: props.item.id } }">
                    <v-icon small>visibility</v-icon>
                  </v-btn>
                </td>
                <!-- </tr> -->
              </template>
              <!-- <template slot="expand" slot-scope="props">
                <v-container>
                  <v-layout>
                    <v-flex xs6>
                      <v-list dense subheader>
                        <v-subheader><h3>租金信息</h3></v-subheader>
                        <v-list-tile>
                          <v-list-tile-content class="body-2">记租前免租 : {{ props.item.beforeFree }}天</v-list-tile-content>
                          <v-list-tile-content class="body-2 align-end">记租后免租 : {{ props.item.afterFree }}天</v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile>
                          <v-list-tile-content class="body-2">押金 : {{ props.item.deposit }}元&nbsp;&nbsp;&nbsp;&nbsp;违约金 : {{ props.item.liquidatedDamages }}元</v-list-tile-content>
                          <v-list-tile-content class="body-2 align-end">缴纳周期 : 每{{ props.item.month }}个月</v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile>
                          <v-list-tile-content class="body-2">租金递增率 : {{ 100 * props.item.houseInfo[0].increaseRate }}%</v-list-tile-content>
                          <v-list-tile-content class="body-2 align-end">递增基数 : 基于{{ ["首年", "上一年"][props.item.houseInfo[0].increaseType] }}</v-list-tile-content>
                        </v-list-tile>
                      </v-list>
                    </v-flex>
                    <v-flex xs6>
                      <v-list dense subheader style="height: 164px;overflow: auto;">
                        <v-subheader><h3>相关资产</h3></v-subheader>
                        <v-list-tile v-for="(house, houseIndex) in props.item.houseInfo" :key="houseIndex" avatar ripple>
                          <v-list-tile-content>
                            <v-list-tile-title>{{ `${house.parkName} - ${house.buildName}` }}</v-list-tile-title>
                            <v-list-tile-sub-title>{{`${((n)=>{return n>=0?n:'地下'+Math.abs(n)})(house.floorNumber)}层 ${house.doorNumber}室`}}</v-list-tile-sub-title>
                          </v-list-tile-content>
                          <v-list-tile-action>
                            <v-list-tile-action-text>总面积 : {{ house.buildArea }}m²</v-list-tile-action-text>
                            <v-list-tile-action-text>月租金 : {{ house.rent }}元</v-list-tile-action-text>
                          </v-list-tile-action>
                        </v-list-tile>
                      </v-list>
                    </v-flex>
                  </v-layout>
                </v-container>
              </template> -->
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
      sortBy: "signingDate",
      descending: false
    },
    headers: [
      { text: "签订日期", value: "signingDate" },
      { text: "合同编号", value: "contractNo" },
      { text: "合同名", value: "contractName" },
      { text: "承租方", value: "companyName" },
      { text: "甲方签订人", value: "signedPersonA" },
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
      this.networkError = false;
      this.$http
        .post("/cms/contract/list.json", {})
        .then(res => {
          let resData = res.data.data;
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
