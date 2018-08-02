<template>
  <div class="fill-height contract-detail">
    <view-tool-bar>
      <span slot="bar-menu">
        <v-btn icon>
          <v-icon>help</v-icon>
        </v-btn>
      </span>
      <span slot="bar-extend">
        <v-tabs v-model="activeTab" color="primary" class="px-4" show-arrows>
          <v-tab v-for="tab in viewToolBarTab" :key="tab.value" :to="tab.to">{{ tab.name }}</v-tab>
        </v-tabs>
      </span>
    </view-tool-bar>
    <v-progress-linear v-if="networkLoading" indeterminate class="my-0"></v-progress-linear>
    <v-alert v-else-if="networkError" :value="true" type="error">网络出现异常 - 检查网络后刷新重试</v-alert>
    <v-tabs-items v-else v-model="activeTab">
      <v-tab-item>
        <contract-info-detail :CTRTInfo="CTRTInfo"></contract-info-detail>
      </v-tab-item>
      <v-tab-item>
        <contract-rent-detail :CTRTNo="CTRTInfo.contractNo"></contract-rent-detail>
      </v-tab-item>
    </v-tabs-items>
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
  </div>
</template>

<script>
import ViewToolBar from "@/components/ViewToolBar.vue";
import ContractInfoDetail from "@/views/ContractView/ContractDetail/ContractInfoDetail.vue";
import ContractRentDetail from "@/views/ContractView/ContractDetail/ContractRentDetail.vue";

export default {
  name: "contract-detail",
  components: {
    ViewToolBar,
    ContractInfoDetail,
    ContractRentDetail
  },
  data: () => ({
    networkLoading: false,
    networkError: null,
    activeTab: null,
    CTRTInfoURL: {
      editing: { name: "待提交", to: "contractSub/queryOne" },
      fulfilling: { name: "生效中", to: "contract/view" },
      expired: { name: "已到期", to: "contract/view" },
      "new-submitted": { name: "签订待审", to: "contractSub/queryOne" },
      "new-success": { name: "新增过审", to: "contractSub/queryOne" },
      "renew-success": { name: "续签过审", to: "contractSub/queryOne" },
      "new-failed": { name: "签订未过审", to: "contractSub/queryOne" }
    },
    dialog: {
      fab: false,
      examineNewDialog: false,
      canNotRenew: false
    },
    formValid: {
      examineNewValid: true
    },
    CTRTInfo: {},
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
  computed: {
    viewToolBarTab() {
      let tabs = [{ name: "合同信息", value: "info" }];
      if (
        ["fulfilling", "expired"].indexOf(this.$route.query.contractType) >= 0
      ) {
        tabs.push({ name: "相关费用", value: "Rent" });
      }
      return tabs;
    }
  },
  watch: {
    "$route.params.contractId"() {
      this.initialize();
    },
    "$route.query.contractType"() {
      this.initialize();
    }
  },
  created() {
    this.$store.commit("changeToolBarTitle", { title: "合同详情" });
    this.initialize();
  },
  methods: {
    initialize() {
      this.examineNewInfo = Object.assign({}, this.defaultExamineNew);
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
          this.$store.commit("changeToolBarTitle", {
            title: `${this.CTRTInfo.contractName}
              <small>${
                this.CTRTInfoURL[this.$route.query.contractType].name
              }</small>
            `,
            isBack: true,
            crumbs: [
              { name: "合同概览", to: { name: "contract-list" } },
              { name: "合同详情" }
            ]
          });
        })
        .catch(err => {
          this.networkError = err;
          this.$store.commit("addErrorBar", "合同详情查询失败");
        })
        .finally(() => (this.networkLoading = false));
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
