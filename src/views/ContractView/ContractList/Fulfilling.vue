<template>
  <v-jumbotron color="blue-grey lighten-4" height="auto">
    <v-container grid-list-xl fill-height>
      <v-layout align-start align-content-start justify-center wrap>
        <v-flex xs12 xl10 tag="h1" class="title grey--text text--darken-1">合同列表</v-flex>
        <v-flex xs12 xl10>
          <v-card>
            <v-card-title class="py-2">
              <v-text-field
                flat
                solo
                prepend-icon="search"
                label="在全部合同中检索..."
                v-model="search"
              ></v-text-field>
              <!-- <v-btn color="primary" @click="1">添加合同</v-btn> -->
              <v-tooltip bottom>
                <v-btn icon @click="initialize" slot="activator">
                  <v-icon>refresh</v-icon>
                </v-btn>
                <span>刷新数据</span>
              </v-tooltip>
              <v-menu offset-y left :nudge-bottom="10">
                <v-btn icon slot="activator">
                  <v-icon>more_vert</v-icon>
                </v-btn>
                <v-list two-line>
                  <v-list-tile disabled @click="1">
                    <v-list-tile-content>
                      <v-list-tile-title>列表菜单选项一</v-list-tile-title>
                      <v-list-tile-sub-title>这是一条列表菜单的选择项</v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-list-tile @click="1">
                    <v-list-tile-content>
                      <v-list-tile-title>列表菜单选项二</v-list-tile-title>
                      <v-list-tile-sub-title>这是一条列表菜单的选择项</v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </v-list>
              </v-menu>
            </v-card-title>
            <v-divider></v-divider>
            <v-data-table
              :no-data-text="networkError?`网络出现异常 - 检查网络后刷新重试`:`暂无记录 - 点击上方按钮添加`"
              :no-results-text="`没能找到“${ search }”的结果...`"
              :search="search"
              :headers="headers"
              :loading="networkLoading"
              :items="contractList"
              item-key="id"
            >
              <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
              <template slot="items" slot-scope="props">
                <tr @click="props.expanded = !props.expanded">
                  <td>{{ props.item.contractNo }}</td>
                  <td>{{ props.item.contractName }}</td>
                  <td>{{ props.item.companyName }}</td>
                  <td>{{ props.item.agency }}</td>
                  <td>{{ props.item.signingDate.slice(0, 10) }}</td>
                  <td>{{ props.item.startDate.slice(0, 10) }}</td>
                  <td>{{ props.item.endDate.slice(0, 10) }}</td>
                  <td class="text-xs-center px-0">
                    <v-btn icon class="mx-0" @click.stop="1">
                      <v-icon color="primary">edit</v-icon>
                    </v-btn>
                    <v-btn icon class="mx-0" @click.stop="1">
                      <v-icon color="purple lighten-1">file_download</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </template>
              <template slot="expand" slot-scope="props">
                <v-container>
                  <v-list two-line subheader>
                    <v-subheader>相关资产</v-subheader>
                    <template v-for="(house, houseIndex) in props.item.house">
                      <v-list-tile :key="houseIndex" avatar ripple>
                        <v-list-tile-content>
                          <v-list-tile-title>{{ house.buildName }}</v-list-tile-title>
                          <v-list-tile-sub-title>{{ house.buildName }} 5层 504室</v-list-tile-sub-title>
                          <v-list-tile-sub-title>月租金: {{ house.rent }}&nbsp;&nbsp;&nbsp;租金年递增率(%): {{ house.increaseRate }}</v-list-tile-sub-title>
                        </v-list-tile-content>
                        <v-list-tile-content>
                          <v-list-tile-title>月租金(元) : {{ house.rent }}</v-list-tile-title>
                          <v-list-tile-sub-title>年递增率(%) : {{ house.increaseRate }}</v-list-tile-sub-title>
                        </v-list-tile-content>
                        <v-list-tile-content>
                          <v-list-tile-title>月租金(元) : {{ house.rent }}</v-list-tile-title>
                          <v-list-tile-sub-title>年递增率(%) : {{ house.increaseRate }}</v-list-tile-sub-title>
                        </v-list-tile-content>
                        <v-list-tile-action>
                          <v-list-tile-action-text>总面积 : 532m²</v-list-tile-action-text>
                          <v-list-tile-action-text>月租金(元) : {{ house.rent }}&nbsp;&nbsp;&nbsp;年递增率(%) : {{ house.increaseRate }}</v-list-tile-action-text>
                        </v-list-tile-action>
                      </v-list-tile>
                      <!-- <v-divider v-if="houseIndex + 1 < props.item.house.length" :key="`line${houseIndex}`"></v-divider> -->
                    </template>
                  </v-list>
                </v-container>
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
      { text: "中介方", value: "agency" },
      { text: "签署日期", value: "signingDate" },
      { text: "计租日期", value: "startDate" },
      { text: "到期日期", value: "endDate" },
      { text: "操作", value: "id", align: "center", sortable: false }
    ],
    contractList: []
  }),
  mounted() {
    this.initialize();
  },
  methods: {
    initialize() {
      this.networkLoading = true;
      this.$http
        .post("/cms/contract/list.json")
        .then(res => {
          this.networkLoading = false;
          let resData = res.data.data;
          this.contractList = resData && resData.length ? resData : [];
          this.contractList = [
            {
              id: 1,
              contractNo: "zhrkj-20180808-1234",
              partyA: "中海融科技有限公司",
              contractName: "写字楼租赁合同",
              partyB: 1,
              type: 1,
              signingDate: "2018-05-04 00:00:00",
              startDate: "2018-05-04 00:00:00",
              endDate: "2018-06-27 00:00:00",
              beforeFree: 30,
              afterFree: 30,
              deposit: 29999,
              signedPersonA: "甲方A",
              signedPersonB: "客户B",
              address: "北京市海淀区资本大厦",
              createTime: "2018-05-04 15:09:55",
              intermediator: "中介A",
              idCode: "123456199608086666",
              agency: "链家网",
              intermediatorTel: 13888888888,
              companyTel: 13666666666,
              companyName: "信息技术有限公司",
              businessLicense: "123456789012345",
              house: [
                {
                  houseId: 1,
                  buildName: "望京SOHO",
                  increaseRate: "2.00",
                  rent: 9999
                },
                {
                  houseId: 1,
                  buildName: "望京SOHO",
                  increaseRate: "3.00",
                  rent: 8999
                }
              ]
            },
            {
              id: 2,
              contractNo: "zhrkj-20180808-1234",
              partyA: "中海融科技有限公司",
              contractName: "写字楼租赁合同",
              partyB: 1,
              type: 1,
              signingDate: "2018-05-04 00:00:00",
              startDate: "2018-05-04 00:00:00",
              endDate: "2018-06-27 00:00:00",
              beforeFree: 30,
              afterFree: 30,
              deposit: 29999,
              signedPersonA: "甲方A",
              signedPersonB: "客户B",
              address: "北京市海淀区资本大厦",
              createTime: "2018-05-04 15:09:55",
              intermediator: "中介A",
              idCode: "123456199608086666",
              agency: "链家网",
              intermediatorTel: 13888888888,
              companyTel: 13666666666,
              companyName: "信息技术有限公司",
              businessLicense: "123456789012345",
              house: [
                {
                  houseId: 1,
                  buildName: "望京SOHO",
                  increaseRate: "2.00",
                  rent: 9999
                },
                {
                  houseId: 1,
                  buildName: "望京SOHO",
                  increaseRate: "3.00",
                  rent: 8999
                }
              ]
            },
            {
              id: 3,
              contractNo: "zhrkj-20180808-1234",
              partyA: "中海融科技有限公司",
              contractName: "写字楼租赁合同",
              partyB: 1,
              type: 1,
              signingDate: "2018-05-04 00:00:00",
              startDate: "2018-05-04 00:00:00",
              endDate: "2018-06-27 00:00:00",
              beforeFree: 30,
              afterFree: 30,
              deposit: 29999,
              signedPersonA: "甲方A",
              signedPersonB: "客户B",
              address: "北京市海淀区资本大厦",
              createTime: "2018-05-04 15:09:55",
              intermediator: "中介A",
              idCode: "123456199608086666",
              agency: "链家网",
              intermediatorTel: 13888888888,
              companyTel: 13666666666,
              companyName: "信息技术有限公司",
              businessLicense: "123456789012345",
              house: [
                {
                  houseId: 1,
                  buildName: "望京SOHO",
                  increaseRate: "2.00",
                  rent: 9999
                },
                {
                  houseId: 1,
                  buildName: "望京SOHO",
                  increaseRate: "3.00",
                  rent: 8999
                }
              ]
            }
          ];
        })
        .catch(() => {
          this.networkLoading = false;
          this.networkError = true;
          this.contractList = [
            {
              id: 1,
              contractNo: "zhrkj-20180808-1234",
              partyA: "中海融科技有限公司",
              contractName: "写字楼租赁合同",
              partyB: 1,
              type: 1,
              signingDate: "2018-05-04 00:00:00",
              startDate: "2018-05-04 00:00:00",
              endDate: "2018-06-27 00:00:00",
              beforeFree: 30,
              afterFree: 30,
              deposit: 29999,
              signedPersonA: "甲方A",
              signedPersonB: "客户B",
              address: "北京市海淀区资本大厦",
              createTime: "2018-05-04 15:09:55",
              intermediator: "中介A",
              idCode: "123456199608086666",
              agency: "链家网",
              intermediatorTel: 13888888888,
              companyTel: 13666666666,
              companyName: "信息技术有限公司",
              businessLicense: "123456789012345",
              house: [
                {
                  houseId: 1,
                  buildName: "望京SOHO",
                  increaseRate: "2.00",
                  rent: 9999
                },
                {
                  houseId: 1,
                  buildName: "望京SOHO",
                  increaseRate: "3.00",
                  rent: 8999
                }
              ]
            },
            {
              id: 2,
              contractNo: "zhrkj-20180808-1234",
              partyA: "中海融科技有限公司",
              contractName: "写字楼租赁合同",
              partyB: 1,
              type: 1,
              signingDate: "2018-05-04 00:00:00",
              startDate: "2018-05-04 00:00:00",
              endDate: "2018-06-27 00:00:00",
              beforeFree: 30,
              afterFree: 30,
              deposit: 29999,
              signedPersonA: "甲方A",
              signedPersonB: "客户B",
              address: "北京市海淀区资本大厦",
              createTime: "2018-05-04 15:09:55",
              intermediator: "中介A",
              idCode: "123456199608086666",
              agency: "链家网",
              intermediatorTel: 13888888888,
              companyTel: 13666666666,
              companyName: "信息技术有限公司",
              businessLicense: "123456789012345",
              house: [
                {
                  houseId: 1,
                  buildName: "望京SOHO",
                  increaseRate: "2.00",
                  rent: 9999
                },
                {
                  houseId: 1,
                  buildName: "望京SOHO",
                  increaseRate: "3.00",
                  rent: 8999
                }
              ]
            },
            {
              id: 3,
              contractNo: "zhrkj-20180808-1234",
              partyA: "中海融科技有限公司",
              contractName: "写字楼租赁合同",
              partyB: 1,
              type: 1,
              signingDate: "2018-05-04 00:00:00",
              startDate: "2018-05-04 00:00:00",
              endDate: "2018-06-27 00:00:00",
              beforeFree: 30,
              afterFree: 30,
              deposit: 29999,
              signedPersonA: "甲方A",
              signedPersonB: "客户B",
              address: "北京市海淀区资本大厦",
              createTime: "2018-05-04 15:09:55",
              intermediator: "中介A",
              idCode: "123456199608086666",
              agency: "链家网",
              intermediatorTel: 13888888888,
              companyTel: 13666666666,
              companyName: "信息技术有限公司",
              businessLicense: "123456789012345",
              house: [
                {
                  houseId: 1,
                  buildName: "望京SOHO",
                  increaseRate: "2.00",
                  rent: 9999
                },
                {
                  houseId: 1,
                  buildName: "望京SOHO",
                  increaseRate: "3.00",
                  rent: 8999
                }
              ]
            }
          ];
        });
    }
  }
};
</script>
