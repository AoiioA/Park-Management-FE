<template>
  <v-container class="contract-refunded-detail px-2 pb-5">
    <v-layout align-start align-content-start justify-center wrap>
      <v-flex xs12 md10 lg8>
        <v-toolbar dense flat color="blue-grey lighten-5">
          <v-toolbar-side-icon @click="$router.go(-1)">
            <v-icon>close</v-icon>
          </v-toolbar-side-icon>
          <v-toolbar-title>{{ `${CTRTInfo.contractName?CTRTInfo.contractName:"合同详情"}` }}<br /><small>{{ CTRTInfoURL[$route.query.contractType].name }}</small></v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
      </v-flex>
      <v-progress-circular indeterminate color="primary" v-if="networkLoading" class="center-box"></v-progress-circular>
      <v-alert v-else-if="networkError" :value="true" type="error" class="center-box">网络出现异常 - 检查网络后刷新重试</v-alert>
      <v-flex xs12 md10 lg8 v-else>
        <v-jumbotron height="auto">
          <v-container grid-list-xl>
            <v-layout wrap>
              <v-flex xs12 md6>
                <v-subheader>出租方</v-subheader>
                <v-card>
                  <v-list dense style="height: 288px;">
                    <v-list-tile>
                      <v-list-tile-content>出租方公司:</v-list-tile-content>
                      <v-list-tile-content class="align-end">{{ CTRTInfo.partyA }}</v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile>
                      <v-list-tile-content>出租方签订人:</v-list-tile-content>
                      <v-list-tile-content class="align-end">{{ CTRTInfo.signedPersonA }}</v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile>
                      <v-list-tile-content>经纪公司:</v-list-tile-content>
                      <v-list-tile-content class="align-end">{{ CTRTInfo.agency || "无" }}</v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile>
                      <v-list-tile-content>经纪人姓名:</v-list-tile-content>
                      <v-list-tile-content class="align-end">{{ CTRTInfo.intermediatorName || "无" }}</v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile>
                      <v-list-tile-content>经纪人身份证:</v-list-tile-content>
                      <v-list-tile-content class="align-end">{{ CTRTInfo.idCode || "无" }}</v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile>
                      <v-list-tile-content>经纪人联系方式:</v-list-tile-content>
                      <v-list-tile-content class="align-end">{{ CTRTInfo.intermediatorTel || "无" }}</v-list-tile-content>
                    </v-list-tile>
                  </v-list>
                </v-card>
              </v-flex>
              <v-flex xs12 md6>
                <v-subheader>租赁方</v-subheader>
                <v-card>
                  <v-list dense style="height: 288px;">
                    <v-list-tile>
                      <v-list-tile-content>租赁方公司:</v-list-tile-content>
                      <v-list-tile-content class="align-end">{{ CTRTInfo.companyName }}</v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile>
                      <v-list-tile-content>租赁方签订人:</v-list-tile-content>
                      <v-list-tile-content class="align-end">{{ CTRTInfo.signedPersonB }}</v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile>
                      <v-list-tile-content>所属行业:</v-list-tile-content>
                      <v-list-tile-content class="align-end">{{ CTRTInfo.companyIndustry }}</v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile>
                      <v-list-tile-content>营业执照:</v-list-tile-content>
                      <v-list-tile-content class="align-end">{{ CTRTInfo.businessLicense }}</v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile>
                      <v-list-tile-content>公司法人:</v-list-tile-content>
                      <v-list-tile-content class="align-end">{{ CTRTInfo.legalPerson }}</v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile>
                      <v-list-tile-content>联系方式:</v-list-tile-content>
                      <v-list-tile-content class="align-end">{{ CTRTInfo.companyTel }}</v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile>
                      <v-list-tile-content>通讯地址:</v-list-tile-content>
                      <v-list-tile-content class="align-end">{{ CTRTInfo.address }}</v-list-tile-content>
                    </v-list-tile>
                  </v-list>
                </v-card>
              </v-flex>
              <v-flex xs12 md6>
                <v-subheader>合同信息</v-subheader>
                <v-card>
                  <v-list dense style="height: 288px;overflow: auto;">
                    <v-list-tile>
                      <v-list-tile-content>合同名称:</v-list-tile-content>
                      <v-list-tile-content class="align-end">{{ CTRTInfo.contractName }}</v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile>
                      <v-list-tile-content>编号:</v-list-tile-content>
                      <v-list-tile-content class="align-end">{{ CTRTInfo.contractNo }}</v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile>
                      <v-list-tile-content>签署地址:</v-list-tile-content>
                      <v-list-tile-content class="align-end">{{ CTRTInfo.address }}</v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile>
                      <v-list-tile-content>签订日期:</v-list-tile-content>
                      <v-list-tile-content v-if="CTRTInfo.signingDate" class="align-end">{{ CTRTInfo.signingDate.slice(0, 10) }}</v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile>
                      <v-list-tile-content>记租开始日期:</v-list-tile-content>
                      <v-list-tile-content v-if="CTRTInfo.startDate" class="align-end">{{ CTRTInfo.startDate.slice(0, 10) }}</v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile>
                      <v-list-tile-content>记租结束日期:</v-list-tile-content>
                      <v-list-tile-content v-if="CTRTInfo.endDate" class="align-end">{{ CTRTInfo.endDate.slice(0, 10) }}</v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile>
                      <v-list-tile-content>记租前免租:</v-list-tile-content>
                      <v-list-tile-content class="align-end">{{ CTRTInfo.beforeFree }}天</v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile>
                      <v-list-tile-content>记租后免租:</v-list-tile-content>
                      <v-list-tile-content class="align-end">{{ CTRTInfo.afterFree }}天</v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile>
                      <v-list-tile-content>租金缴纳周期:</v-list-tile-content>
                      <v-list-tile-content class="align-end">每{{ CTRTInfo.month }}个月</v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile>
                      <v-list-tile-content>年递增率:</v-list-tile-content>
                      <v-list-tile-content class="align-end">{{ 100 * CTRTInfo.houseAndBuildingDtos[0].increaseRate }}%</v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile>
                      <v-list-tile-content>年递增率基数:</v-list-tile-content>
                      <v-list-tile-content class="align-end">{{ ['首年租金', '上一年租金'][CTRTInfo.houseAndBuildingDtos[0].increaseType] }}</v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile>
                      <v-list-tile-content>押金:</v-list-tile-content>
                      <v-list-tile-content class="align-end">{{ CTRTInfo.deposit }}元</v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile>
                      <v-list-tile-content>违约金:</v-list-tile-content>
                      <v-list-tile-content class="align-end">{{ CTRTInfo.liquidatedDamages }}元</v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile>
                      <v-list-tile-content>物业费:</v-list-tile-content>
                      <v-list-tile-content class="align-end">{{ CTRTInfo.propertyFee }}元/m²·天</v-list-tile-content>
                    </v-list-tile>
                  </v-list>
                </v-card>
              </v-flex>
              <v-flex xs12 md6>
                <v-subheader>租赁资产</v-subheader>
                <v-card>
                  <v-list dense style="height: 288px;overflow: auto;">
                    <v-list-tile v-for="(house, houseIndex) in CTRTInfo.houseAndBuildingDtos" :key="houseIndex" avatar ripple>
                      <v-list-tile-content>
                        <v-list-tile-title>{{ `${house.doorNumber}室` }}</v-list-tile-title>
                        <v-list-tile-sub-title>{{ `${house.parkName ? house.parkName + ' - ' : ''}${house.buildingName} ${((n)=>{return n>=0?n:'地下'+Math.abs(n)})(house.floorNumber)}层` }}</v-list-tile-sub-title>
                      </v-list-tile-content>
                      <v-list-tile-action>
                        <v-list-tile-action-text>{{ house.buildArea }}m²</v-list-tile-action-text>
                        <v-list-tile-action-text>{{ house.rent.toFixed(2) }}元/m²·天</v-list-tile-action-text>
                      </v-list-tile-action>
                    </v-list-tile>
                  </v-list>
                </v-card>
              </v-flex>
            </v-layout>
            <v-layout wrap>
              <v-flex xs12 md6>
                <v-subheader>退租申请信息</v-subheader>
                <v-card>
                  <v-list dense style="height: 128px;">
                    <v-list-tile>
                      <v-list-tile-content>申请时间:</v-list-tile-content>
                      <v-list-tile-content class="align-end">{{ CTRTInfo.realEndDate.slice(0, 10) }}</v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile>
                      <v-list-tile-content>申请备注:</v-list-tile-content>
                      <v-list-tile-content class="align-end">{{ CTRTInfo.reason }}</v-list-tile-content>
                    </v-list-tile>
                  </v-list>
                </v-card>
              </v-flex>
              <v-flex xs12 md6 v-if="['refunded-submitted'].indexOf($route.query.contractType)==-1">
                <v-subheader>退租审批信息</v-subheader>
                <v-card>
                  <v-list dense style="height: 128px;">
                    <v-list-tile>
                      <v-list-tile-content>审批结果:</v-list-tile-content>
                      <v-list-tile-content class="align-end">{{ CTRTInfo.contractState }}</v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile>
                      <v-list-tile-content>审批时间:</v-list-tile-content>
                      <v-list-tile-content class="align-end">{{ CTRTInfo.verifyTime.slice(0, 10) }}</v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile>
                      <v-list-tile-content>审批备注:</v-list-tile-content>
                      <v-list-tile-content class="align-end">{{ CTRTInfo.verifyDescription }}</v-list-tile-content>
                    </v-list-tile>
                  </v-list>
                </v-card>
              </v-flex>
              <v-flex xs12 v-if="CTRTInfo.addRefundBillDtos">
                <v-subheader>当前合同退租明细</v-subheader>
                <v-data-table
                  :headers="rentHeaders"
                  :items="CTRTInfo.addRefundBillDtos"
                  item-key="id"
                  no-data-text="暂无退租明细"
                  class="elevation-1"
                >
                  <template slot="items" slot-scope="props">
                    <td v-if="props.item.rentType">{{ props.item.rentType }}</td>
                    <td v-if="props.item.payDate">{{ props.item.payDate.slice(0, 10) }}</td>
                    <td v-if="props.item.fromDate">{{ props.item.fromDate.slice(0, 10) }}</td>
                    <td v-if="props.item.endDate">{{ props.item.endDate.slice(0, 10) }}</td>
                    <td>{{ props.item.totalRent }}元</td>
                    <td>{{ props.item.state }}</td>
                  </template>
                </v-data-table>
              </v-flex>
              <v-flex xs12 v-if="renewCTRTInfo">
                <v-subheader>
                  续签合同退租明细 - {{ renewCTRTInfo.contractName }}({{ renewCTRTInfo.contractNo }})
                  <v-spacer></v-spacer>
                  <v-btn :to="{ name: 'contract-detail', query: { contractType: 'fulfilling' }, params: { contractId: renewCTRTInfo.id } }" small color="primary" depressed>查看续签合同</v-btn>
                </v-subheader>
                <v-data-table
                  :headers="rentHeaders"
                  :items="renewCTRTInfo.addRefundBillDtos"
                  item-key="id"
                  no-data-text="暂无退租明细"
                  class="elevation-1"
                >
                  <template slot="items" slot-scope="props">
                    <td v-if="props.item.rentType">{{ props.item.rentType }}</td>
                    <td v-if="props.item.payDate">{{ props.item.payDate.slice(0, 10) }}</td>
                    <td v-if="props.item.fromDate">{{ props.item.fromDate.slice(0, 10) }}</td>
                    <td v-if="props.item.endDate">{{ props.item.endDate.slice(0, 10) }}</td>
                    <td>{{ props.item.totalRent }}元</td>
                    <td>{{ props.item.state }}</td>
                  </template>
                </v-data-table>
              </v-flex>
            </v-layout>
          </v-container>
        </v-jumbotron>
        <v-speed-dial v-model="dialog.fab" fixed bottom right>
          <v-tooltip left slot="activator">
            <v-btn slot="activator" v-model="dialog.fab" fab dark color="primary">
              <v-icon>add</v-icon>
              <v-icon>close</v-icon>
            </v-btn>
            <span>展开操作</span>
          </v-tooltip>
          <v-dialog v-if="['refunded-submitted'].indexOf($route.query.contractType)>=0" v-model="dialog.examineRefundedDialog" persistent max-width="480">
            <v-tooltip left slot="activator">
              <v-btn slot="activator" fab small dark color="pink">
                <v-icon>how_to_reg</v-icon>
              </v-btn>
              <span>提交审核</span>
            </v-tooltip>
            <v-card>
              <v-card-title class="headline">即将提交退租审核</v-card-title>
              <v-form ref="examineRefundedForm" v-model="examineRefundedValid" lazy-validation style="overflow: hidden">
                <v-overflow-btn v-model="examineRefundedInfo.result" :items="examineRefundedSelect" item-text="text" item-value="value" return-object :rules="[$store.state.rules.required]" label="审核结果" single-line required hide-details></v-overflow-btn>
                <v-divider></v-divider>
                <v-textarea v-model="examineRefundedInfo.reason" :rules="[$store.state.rules.required, $store.state.rules.lengthLessThan(100)]" label="审核理由" counter="100" solo flat single-line required></v-textarea>
                <v-divider></v-divider>
              </v-form>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click.native="closeExamineRefunded" flat>取消操作</v-btn>
                <v-btn :disabled="!examineRefundedValid" @click.native="saveExamineRefunded" color="primary" depressed>提交审核</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-speed-dial>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: "contract-refunded-detail",
  data: () => ({
    networkLoading: false,
    networkError: null,
    CTRTInfoURL: {
      "refunded-submitted": {
        name: "退租待审",
        to: "contract/viewThrowALease"
      },
      "refunded-success": { name: "退租过审", to: "contract/viewThrowALease" },
      "refunded-failed": { name: "退租未过审", to: "contract/viewThrowALease" }
    },
    dialog: {
      fab: false,
      examineRefundedDialog: false
    },
    examineRefundedValid: true,
    CTRTInfo: {},
    renewCTRTInfo: {},
    // 租金列表
    rentHeaders: [
      { text: "费用类型", value: "rentType", sortable: false },
      { text: "应缴日期", value: "payDate", sortable: false },
      { text: "计费起始日期", value: "fromDate", sortable: false },
      { text: "计费截至日期", value: "endDate", sortable: false },
      { text: "应缴金额", value: "totalRent", sortable: false },
      { text: "费用状态", value: "state", sortable: false }
    ],
    // 退租审核
    refundedRent: [],
    examineRefundedInfo: {},
    defaultExamineRefunded: {
      reason: "",
      result: {
        text: "通过",
        value: "审核通过"
      }
    },
    examineRefundedSelect: [
      {
        text: "通过",
        value: "审核通过"
      },
      {
        text: "驳回",
        value: "审核未通过"
      }
    ]
  }),
  created() {
    this.initialize();
  },
  watch: {
    "$route.params.contractId"() {
      this.initialize();
    },
    "$route.query.contractType"() {
      this.initialize();
    }
  },
  methods: {
    initialize() {
      this.examineRefundInfo = Object.assign({}, this.defaultExamineRefund);
      this.networkLoading = true;
      this.networkError = false;
      this.$http
        .get(
          `/cms/${this.CTRTInfoURL[this.$route.query.contractType].to}.json`,
          {
            params: {
              id: this.$route.params.contractId
            }
          }
        )
        .then(res => {
          let resData = res.data.data;
          this.CTRTInfo = resData.oldContractRefundDto;
          this.renewCTRTInfo = resData.renewContractRefundDtos;
        })
        .catch(err => {
          this.networkError = err;
          this.$store.commit("addErrorBar", "合同详情查询失败");
        })
        .finally(() => (this.networkLoading = false));
    },
    closeExamineRefunded() {
      this.dialog.examineRefundedDialog = false;
      setTimeout(() => {
        this.$refs.examineRefundedForm.reset();
        this.examineRefundedInfo = Object.assign(
          {},
          this.defaultExamineRefunded
        );
      }, 300);
    },
    saveExamineRefunded() {
      if (this.$refs.examineRefundedForm.validate()) {
        this.$http
          .post("/cms/contract/verifyThrowALease.json", {
            id: this.CTRTInfo.id,
            contractState: this.examineRefundedInfo.result.value,
            verifyDescription: this.examineRefundedInfo.reason
          })
          .then(res => {
            if (res.data.code != 500) {
              this.$store.commit("addSuccessBar", "合同已审核成功");
              this.$router.go(-1);
            } else {
              throw new Error(res.data.msg);
            }
          })
          .catch(err =>
            this.$store.commit("addErrorBar", `合同审核出现错误 ${err}`)
          );
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.contract-refunded-detail {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  max-width: 100%;
  min-height: 100%;
  background: #ECEFF1;
  z-index: 1;

  .center-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
