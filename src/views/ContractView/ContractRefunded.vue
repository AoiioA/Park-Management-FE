<template>
  <v-container class="contract-refunded px-2">
    <v-layout align-start align-content-start justify-center wrap>
      <v-flex xs12 md10 lg8>
        <v-toolbar dense flat color="blue-grey lighten-5">
          <v-toolbar-side-icon @click="$router.go(-1)">
            <v-icon>close</v-icon>
          </v-toolbar-side-icon>
          <v-toolbar-title>提交退租申请<span v-if="CTRTInfo"> - {{ CTRTInfo.contractName }}<small>({{ CTRTInfo.contractNo }})</small></span></v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
      </v-flex>
      <v-progress-circular indeterminate color="primary" v-if="networkLoading" class="center-box"></v-progress-circular>
      <v-alert v-else-if="networkError" :value="true" type="error" class="center-box">网络出现异常 - 检查网络后刷新重试</v-alert>
      <v-flex xs12 md10 lg8 v-else>
        <v-stepper v-model="stepNum" vertical class="elevation-0 refunded-stepper">
          <v-stepper-step :rules="[() => !!refundedValid]" :complete="stepNum > 1" step="1">
            填写退租信息
            <small>稍后将生成退租明细</small>
          </v-stepper-step>
          <v-stepper-content step="1">
            <v-form ref="refundedForm" v-model="refundedValid" lazy-validation>
              <v-container grid-list-md>
                <v-layout row wrap>
                  <v-flex xs6><v-autocomplete dense v-model="editedRefunded.throwALeaseType" :items="refundedSelect" item-text="text" item-value="value" return-object :rules="[$store.state.rules.required]" label="退租类型" box required></v-autocomplete></v-flex>
                  <v-flex xs6>
                    <v-menu v-model="refundedDateDialog" :close-on-content-click="false" lazy offset-y>
                      <v-text-field slot="activator" v-if="editedRefunded.throwALeaseType.value != '合同期满退租'" v-model="editedRefunded.throwALeaseDate" :rules="[$store.state.rules.required]" label="退租时间" :hint="`将于${CTRTInfo.endDate&&CTRTInfo.endDate.slice(0, 10)}到期`" persistent-hint box required readonly></v-text-field>
                      <v-date-picker v-model="editedRefunded.throwALeaseDate" :min="CTRTInfo.startDate" :max="CTRTInfo.endDate" :first-day-of-week="0" show-current locale="zh-cn" @input="refundedDateDialog = false;"></v-date-picker>
                    </v-menu>
                  </v-flex>
                  <v-flex xs12><v-textarea v-model="editedRefunded.reason" :rules="[$store.state.rules.required, $store.state.rules.lengthLessThan(100)]" label="退租理由" counter="100" box required></v-textarea></v-flex>
                </v-layout>
              </v-container>
            </v-form>
            <v-btn :disabled="!refundedValid" @click.native="checkRefunded" color="primary" depressed>核对退租信息</v-btn>
            <v-btn @click.native="stepNum--" flat>后退</v-btn>
          </v-stepper-content>
          <v-stepper-step :complete="stepNum > 2" step="2">确认退租明细</v-stepper-step>
          <v-stepper-content step="2">
            <v-container grid-list-md>
              <v-layout justify-center wrap>
                <v-flex xs12>
                  <v-subheader>当前合同退租明细</v-subheader>
                  <v-data-table
                    :headers="rentHeaders"
                    :items="refundedRent"
                    no-data-text="暂无退租明细"
                    class="elevation-1 mb-4"
                  >
                    <template slot="items" slot-scope="props">
                      <td v-if="props.item.rentType">{{ props.item.rentType }}</td>
                      <td v-if="props.item.fromDate">{{ props.item.fromDate.slice(0, 10) }}</td>
                      <td v-if="props.item.endDate">{{ props.item.endDate.slice(0, 10) }}</td>
                      <td>{{ props.item.totalRent }}元</td>
                      <td>{{ props.item.state }}</td>
                    </template>
                  </v-data-table>
                  <div v-if="renewCTRTInfo&&renewCTRTInfo.id">
                    <v-alert v-model="renewAlert" dismissible type="warning">
                      该合同已被续签，续签合同将同时被退租
                    </v-alert>
                    <v-subheader>
                      续签合同退租明细 - {{ renewCTRTInfo.contractName }}({{ renewCTRTInfo.contractNo }})
                      <v-spacer></v-spacer>
                      <v-btn :to="{ name: 'contract-detail', query: { contractType: 'fulfilling' }, params: { contractId: renewCTRTInfo.id } }" small color="primary" depressed>查看续签合同</v-btn>
                    </v-subheader>
                    <v-data-table
                      :headers="rentHeaders"
                      :items="renewCTRTInfo.addRefundBillDtos"
                      no-data-text="暂无退租明细"
                      class="elevation-1 mb-4"
                    >
                      <template slot="items" slot-scope="props">
                        <td v-if="props.item.rentType">{{ props.item.rentType }}</td>
                        <td v-if="props.item.fromDate">{{ props.item.fromDate.slice(0, 10) }}</td>
                        <td v-if="props.item.endDate">{{ props.item.endDate.slice(0, 10) }}</td>
                        <td>{{ props.item.totalRent }}元</td>
                        <td>{{ props.item.state }}</td>
                      </template>
                    </v-data-table>
                  </div>
                </v-flex>
              </v-layout>
            </v-container>
            <v-btn :disabled="!refundedValid" @click.native="saveRefunded" color="primary" depressed>申请退租</v-btn>
            <v-btn @click.native="stepNum--" flat>后退</v-btn>
          </v-stepper-content>
        </v-stepper>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: "contract-refunded",
  data: () => ({
    networkLoading: false,
    networkError: null,
    CTRTInfoURL: {
      fulfilling: { name: "生效中", to: "contract/view" },
      expired: { name: "已到期", to: "contract/view" }
    },
    CTRTInfo: {},
    refundedRent: [],
    renewCTRTInfo: {},
    rentHeaders: [
      { text: "费用类型", value: "rentType", sortable: false },
      { text: "计费起始日期", value: "fromDate", sortable: false },
      { text: "计费截至日期", value: "endDate", sortable: false },
      { text: "应缴金额", value: "totalRent", sortable: false },
      { text: "费用状态", value: "state", sortable: false }
    ],
    stepNum: 1,
    refundedValid: true,
    refundedDateDialog: false,
    editedRefunded: {},
    defaultRefunded: {
      throwALeaseType: {
        text: "期满退租",
        value: "合同期满退租"
      },
      throwALeaseDate: "",
      reason: ""
    },
    refundedSelect: [
      {
        text: "期满退租",
        value: "合同期满退租"
      },
      {
        text: "提前退租",
        value: "合同提前退租"
      }
    ],
    renewAlert: true
  }),
  created() {
    this.editedRefunded = Object.assign({}, this.defaultRefunded);
    this.initialize();
  },
  watch: {
    "$route.params.contractId"() {
      this.$router.go(0);
    },
    "$route.query.contractType"() {
      this.$router.go(0);
    }
  },
  methods: {
    initialize() {
      this.networkLoading = true;
      this.networkError = false;
      this.$http
        .get(
          `/cms/${
            this.CTRTInfoURL[this.$route.query.contractType || "fulfilling"].to
          }.json`,
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
    checkRefunded() {
      if (this.$refs.refundedForm.validate()) {
        this.stepNum++;
        this.getRefundedRent();
        this.getRefundedRenewRent();
      }
    },
    getRefundedRent() {
      this.$http
        .post("/cms/contract/contractRefundDetail.json", {
          id: this.CTRTInfo.id,
          realEndDate:
            this.editedRefunded.throwALeaseType.value == "合同期满退租"
              ? this.CTRTInfo.endDate.slice(0, 10)
              : this.editedRefunded.throwALeaseDate
        })
        .then(res => {
          if (res.data.length) {
            this.$store.commit("addSuccessBar", "退租明细生成成功");
            this.refundedRent = res.data;
          } else {
            throw new Error(res.data.msg);
          }
        })
        .catch(err =>
          this.$store.commit("addErrorBar", `退租明细生成出现错误 ${err}`)
        );
    },
    getRefundedRenewRent() {
      if (this.editedRefunded.throwALeaseType.value != "合同期满退租") {
        this.$http
          .post("/cms/contract/throwALeaseRenewList.json", {
            id: this.CTRTInfo.id,
            realEndDate: this.editedRefunded.throwALeaseDate
          })
          .then(res => {
            if (res.data.code != 500) {
              this.renewCTRTInfo = res.data.data;
            } else {
              throw new Error(res.data.msg);
            }
          })
          .catch(err =>
            this.$store.commit(
              "addErrorBar",
              `退租续签合同明细生成出现错误 ${err}`
            )
          );
      }
    },
    saveRefunded() {
      if (this.$refs.refundedForm.validate()) {
        this.$http
          .post("/cms/contract/throwALease.json", {
            id: this.CTRTInfo.id,
            throwALeaseType: this.editedRefunded.throwALeaseType.value,
            throwALeaseDate: this.editedRefunded.throwALeaseDate,
            reason: this.editedRefunded.reason
          })
          .then(res => {
            if (res.data.code == 0) {
              this.$store.commit("addSuccessBar", "合同退租申请成功");
              this.$router.go(-1);
            } else {
              throw new Error(res.data.msg);
            }
          })
          .catch(err =>
            this.$store.commit("addErrorBar", `合同退租出现错误 ${err}`)
          );
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.contract-refunded {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  max-width: 100%;
  min-height: 100%;
  background: #eceff1;
  z-index: 1;

  .center-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .refunded-stepper {
    max-width: 800px;
    background: #eceff1;
  }
}
</style>
