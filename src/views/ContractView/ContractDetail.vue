<template>
  <v-container class="contract-detail px-2 pb-5">
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
          <v-container grid-list-xl fill-height>
            <v-layout wrap>
              <!-- <v-flex xs12 md12 class="subheading grey--text text--darken-1">合同明细</v-flex> -->
              <v-flex xs12 md6>
                <v-subheader>出租方</v-subheader>
                <v-card>
                  <!-- <v-card-title><h4>{{ CTRTInfo.partyA }}</h4></v-card-title>
                  <v-divider></v-divider> -->
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
              <v-flex xs12 v-if="CTRTInfo.contractRentTotalDto">
                <v-subheader>金额明细</v-subheader>
                <v-data-table
                  :headers="rentPreHeaders"
                  :items="CTRTInfo.contractRentTotalDto.contractRentDetailDtoList"
                  item-key="payDay"
                  no-data-text="暂无租金明细"
                  class="elevation-1"
                >
                  <template slot="items" slot-scope="props">
                    <!-- <tr @click="props.expanded = !props.expanded"> -->
                    <td v-if="props.item.payDay">{{ props.item.payDay.slice(0, 10) }}</td>
                    <td v-if="props.item.fromDate">{{ props.item.fromDate.slice(0, 10) }}</td>
                    <td v-if="props.item.endDate">{{ props.item.endDate.slice(0, 10) }}</td>
                    <td>{{ props.item.houseTotal }}元</td>
                    <td>{{ props.item.propertyFees }}元</td>
                    <!-- </tr> -->
                  </template>
                  <!-- <template slot="expand" slot-scope="props">
                    <v-card flat>
                      <v-card-text>Peek-a-boo!</v-card-text>
                    </v-card>
                  </template> -->
                  <template slot="footer">
                    <td colspan="100%">
                      <small v-if="CTRTInfo.contractRentTotalDto.contractRentDetailDtoList">租金总计 : {{ CTRTInfo.contractRentTotalDto.contractRentDetailDtoList.map(el=>el.houseTotal).reduce((all, el, i) => parseFloat(all) + parseFloat(el)).toFixed(0) }}元</small>
                      &nbsp;&nbsp;<small>物业费总计 : {{ CTRTInfo.contractRentTotalDto.propertyFeeTotal }}元</small>
                      &nbsp;&nbsp;<small>押金 : {{ CTRTInfo.contractRentTotalDto.deposit }}元</small>
                      &nbsp;&nbsp;<small>违约金 : {{ CTRTInfo.contractRentTotalDto.liquidatedDamages }}元</small>
                    </td>
                  </template>
                </v-data-table>
              </v-flex>
              <v-flex xs12 v-if="CTRTInfo.rentBillListDtos">
                <v-subheader>所含交易明细</v-subheader>
                <v-data-table
                  :headers="rentHeaders"
                  :items="CTRTInfo.rentBillListDtos"
                  item-key="id"
                  no-data-text="暂无交易明细"
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
                  <template slot="footer">
                    <td colspan="100%">
                      <small v-if="CTRTInfo.rentBillListDtos">金额总计 : {{ CTRTInfo.rentBillListDtos.map(el=>el.totalRent).reduce((all, el, i) => parseFloat(all) + parseFloat(el)) }}元</small>
                    </td>
                  </template>
                </v-data-table>
              </v-flex>
            </v-layout>
          </v-container>
        </v-jumbotron>
        <v-dialog v-model="dialog.canNotRenew" persistent max-width="290">
          <v-card>
            <v-card-title class="headline">不符合续签条件</v-card-title>
            <v-card-text>可能已有续签合同或前序合同尚未失效。</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" flat @click.native="dialog.canNotRenew = false">知道了</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-speed-dial v-model="dialog.fab" fixed bottom right>
          <v-tooltip left slot="activator">
            <v-btn slot="activator" v-model="dialog.fab" fab dark color="primary">
              <v-icon>add</v-icon>
              <v-icon>close</v-icon>
            </v-btn>
            <span>展开操作</span>
          </v-tooltip>
          <v-tooltip left v-if="['editing', 'new-failed'].indexOf($route.query.contractType)>=0">
            <v-btn slot="activator" fab small dark color="pink" :to="{ name: 'contract-new', query: { newType: 'edit', newId: CTRTInfo.id } }">
              <v-icon>edit</v-icon>
            </v-btn>
            <span>编辑</span>
          </v-tooltip>
          <v-tooltip left v-if="['fulfilling', 'expired'].indexOf($route.query.contractType)>=0">
            <v-btn slot="activator" fab small dark color="pink" :to="{ name: 'contract-new', query: { newType: 'change', newId: CTRTInfo.id } }">
              <v-icon>edit</v-icon>
            </v-btn>
            <span>变更</span>
          </v-tooltip>
          <v-tooltip left v-if="['fulfilling'].indexOf($route.query.contractType)>=0">
            <v-btn slot="activator" fab small dark color="pink" @click="checkRenewable">
              <v-icon>file_copy</v-icon>
            </v-btn>
            <span>续签</span>
          </v-tooltip>
          <v-tooltip left v-if="['fulfilling', 'expired'].indexOf($route.query.contractType)>=0">
            <v-btn slot="activator" fab small dark color="pink" :to="{ name: 'contract-refunded', params: { contractId: CTRTInfo.id }, query: { contractType: $route.query.contractType } }">
              <v-icon>delete_sweep</v-icon>
            </v-btn>
            <span>退租</span>
          </v-tooltip>
          <v-dialog v-if="['new-submitted', 'renew-submitted'].indexOf($route.query.contractType)>=0" v-model="dialog.examineNewDialog" persistent max-width="480">
            <v-tooltip left slot="activator">
              <v-btn slot="activator" fab small dark color="pink">
                <v-icon>how_to_reg</v-icon>
              </v-btn>
              <span>签订审核</span>
            </v-tooltip>
            <v-card>
              <v-card-title class="headline">提交审核结果</v-card-title>
              <v-form ref="examineNewForm" v-model="formValid.examineNewValid" lazy-validation style="overflow: hidden">
                <v-overflow-btn v-model="examineNewInfo.result" :items="examineNewSelect" item-text="text" item-value="value" return-object :rules="[$store.state.rules.required]" label="审核结果" single-line required hide-details></v-overflow-btn>
                <v-divider></v-divider>
                <v-textarea v-model="examineNewInfo.reason" :rules="[$store.state.rules.lengthLessThan(100)]" label="审核理由" counter="100" solo flat single-line required></v-textarea>
                <v-divider></v-divider>
              </v-form>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click.native="closeExamineNew" flat>取消操作</v-btn>
                <v-btn :disabled="!formValid.examineNewValid" @click.native="saveExamineNew" color="primary" depressed>提交审核</v-btn>
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
  name: "contract-detail",
  data: () => ({
    networkLoading: false,
    networkError: null,
    CTRTInfoURL: {
      editing: { name: "待提交", to: "contractSub/queryOne" },
      fulfilling: { name: "生效中", to: "contract/view" },
      expired: { name: "已到期", to: "contract/view" },
      "new-submitted": { name: "签订待审", to: "contractSub/queryOne" },
      "new-success": { name: "新增过审", to: "contractSub/queryOne" },
      "renew-success": { name: "续签过审", to: "contractSub/queryOne" },
      "new-failed": { name: "签订未过审", to: "contractSub/queryOne" },
      "changed-submitted": {
        name: "变更待审",
        to: "contract/viewCancelContract"
      },
      "changed-success": {
        name: "变更过审",
        to: "contract/viewCancelContract"
      },
      "changed-failed": {
        name: "变更未过审",
        to: "contract/viewCancelContract"
      }
    },
    dialog: {
      fab: false,
      examineNewDialog: false,
      changedDialog: false,
      canNotRenew: false
    },
    formValid: {
      examineNewValid: true,
      changedValid: true
    },
    CTRTInfo: {},
    renewCTRTInfo: {},
    // 租金列表
    rentPreHeaders: [
      { text: "应缴日期", value: "payDay", sortable: false },
      { text: "计费起始日期", value: "fromDate", sortable: false },
      { text: "计费截至日期", value: "endDate", sortable: false },
      { text: "应缴租金", value: "total", sortable: false },
      { text: "应缴物业费", value: "propertyFees", sortable: false }
    ],
    rentHeaders: [
      { text: "费用类型", value: "rentType", sortable: false },
      { text: "应缴日期", value: "payDate", sortable: false },
      { text: "计费起始日期", value: "fromDate", sortable: false },
      { text: "计费截至日期", value: "endDate", sortable: false },
      { text: "应缴金额", value: "totalRent", sortable: false },
      { text: "费用状态", value: "state", sortable: false }
    ],
    // 变更
    changedInfo: {},
    defaultChanged: {
      time: "",
      reason: ""
    },
    // 新增审核
    examineNewInfo: {},
    defaultExamineNew: {
      reason: "",
      result: {
        text: "通过",
        value: "审核通过"
      }
    },
    examineNewSelect: [
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
  watch: {
    "$route.params.contractId"() {
      this.$router.go(0);
    },
    "$route.query.contractType"() {
      this.$router.go(0);
    }
  },
  created() {
    this.changedInfo = Object.assign({}, this.defaultChanged);
    this.examineNewInfo = Object.assign({}, this.defaultExamineNew);
    this.initialize();
  },
  methods: {
    initialize() {
      this.networkLoading = true;
      this.networkError = null;
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
          this.CTRTInfo = resData;
        })
        .catch(err => {
          this.networkError = err;
          this.$store.commit("addErrorBar", "合同详情查询失败");
        })
        .finally(() => (this.networkLoading = false));
    },
    getDay(date, day) {
      let t = new Date(
        new Date(date).getTime() + parseInt(day) * 24 * 60 * 60 * 1000
      );
      return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(
        2,
        0
      )}-${String(t.getDate()).padStart(2, 0)}`;
    },
    checkRenewable() {
      this.$http
        .get(`/cms/contract/checkRenewable.json`, {
          params: {
            id: this.$route.params.contractId
          }
        })
        .then(res => {
          if (res.data.code != 500) {
            if (res.data.data == "true") {
              this.$router.push({
                name: "contract-new",
                query: { newType: "renew", newId: this.CTRTInfo.id }
              });
            } else {
              this.dialog.canNotRenew = true;
            }
          } else {
            throw new Error(res.data.msg);
          }
        })
        .catch(err => {
          this.$store.commit("addErrorBar", `查询可否续签失败 ${err}`);
        });
    },
    closeChanged() {
      this.dialog.changedDialog = false;
      setTimeout(() => {
        this.$refs.changedForm.reset();
        this.changedInfo = Object.assign({}, this.defaultChanged);
      }, 300);
    },
    saveChanged() {
      if (this.$refs.changedForm.validate()) {
        this.$http
          .post("/cms/contract/cancel.json", {
            id: this.CTRTInfo.id,
            cancelDate: this.changedInfo.cancelDate,
            reason: this.changedInfo.reason
          })
          .then(res => {
            if (res.data.code == 0) {
              this.$store.commit("addSuccessBar", "合同变更成功");
              this.closeChanged();
            } else {
              throw new Error(res.data.msg);
            }
          })
          .catch(err =>
            this.$store.commit("addErrorBar", `合同变更出现错误 ${err}`)
          );
      }
    },
    closeExamineNew() {
      this.dialog.examineNewDialog = false;
      setTimeout(() => {
        this.$refs.examineNewForm.reset();
        this.examineNewInfo = Object.assign({}, this.defaultExamineNew);
      }, 300);
    },
    saveExamineNew() {
      if (this.$refs.examineNewForm.validate()) {
        this.$http
          .post("/cms/contractSub/checkContract.json", {
            id: this.CTRTInfo.id,
            contractState: this.examineNewInfo.result.value,
            reason: this.examineNewInfo.reason
          })
          .then(res => {
            if (res.data.code == 0) {
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
.contract-detail {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  max-width: 100%;
  min-height: 100%;
  background: #ECEFF1;
  z-index: 1;
}

.dialog-stepper {
  background: #eceff1 !important;
}

.center-box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
