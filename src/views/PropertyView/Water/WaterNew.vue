<template>
  <div class="fill-height water-list">
    <view-tool-bar>
      <span slot="bar-menu">
        <v-btn icon>
          <v-icon>help</v-icon>
        </v-btn>
      </span>
    </view-tool-bar>
    <v-jumbotron color="blue-grey lighten-5" height="auto">
			<div class="no-data" v-if="networkLoading"><v-progress-circular indeterminate color="primary" class="my-0"></v-progress-circular></div>
			<v-alert v-else-if="networkError" :value="true" type="error">网络出现异常 - 检查网络后刷新重试</v-alert>
      <v-container v-else class="px-4 py-4">
        <v-layout align-start align-content-start justify-center wrap>
          <v-flex xs12 md10 lg8>
            <v-stepper v-model="stepNum" vertical class="elevation-0" style="background: #eceff1">
              <v-stepper-step :rules="[() => !!waterBillFormValid]" :complete="stepNum>1" step="1">
                水费账单信息
              </v-stepper-step>
              <v-stepper-content step="1">
                <v-form ref="waterBillForm" v-model="waterBillFormValid" lazy-validation>
                  <v-container grid-list-md>
                    <v-subheader>建筑信息</v-subheader>
                    <v-layout row wrap>
                      <v-flex xs12 sm4>
                        <v-menu v-model="menu.companyMenu" offset-y nudge-top="20">
                          <v-text-field slot="activator" :rules="[$store.state.rules.required]" :value="selectedCompany.companyName" label="客户名称" :hint="selectedCompany.businessLicense" persistent-hint box required readonly></v-text-field>
                          <v-list style="max-height: 200px; overflow-y: auto;">
                            <v-list-tile v-for="(company, companyIndex) in companyList" :key="companyIndex" @click="selectedCompany = company;newWaterBill.userId = company.id;getContract(company.id)">
                              <v-list-tile-title>{{ company.companyName }}</v-list-tile-title>
                            </v-list-tile>
                          </v-list>
                        </v-menu>
                      </v-flex>
                      <v-flex xs12 sm4>
                        <v-menu :disabled="!selectedCompany.id" v-model="menu.contractMenu" offset-y nudge-top="20">
                          <v-text-field :disabled="!selectedCompany.id" slot="activator" :rules="[$store.state.rules.required]" :value="selectedContract.contractName" label="合同名称" :hint="selectedContract.contractNo" persistent-hint box required readonly></v-text-field>
                          <v-list style="max-height: 200px; overflow-y: auto;">
                            <v-list-tile v-for="(contract, contractIndex) in contractList" :key="contractIndex" @click="selectedContract = contract;newWaterBill.contractNo = contract.contractNo">
                              <v-list-tile-title>{{ contract.contractName }}</v-list-tile-title>
                            </v-list-tile>
                          </v-list>
                        </v-menu>
                      </v-flex>
                      <v-flex xs12 sm4>
                        <v-dialog ref="monthdialog" v-model="menu.waterMonthMenu" :return-value.sync="newWaterBill.waterMonth" lazy full-width width="290px">
                          <v-text-field slot="activator" v-model="newWaterBill.waterMonth" :rules="[$store.state.rules.required]" label="月份" hint="" persistent-hint box required readonly></v-text-field>
                          <v-date-picker v-model="newWaterBill.waterMonth" @input="$refs.monthdialog.save(newWaterBill.waterMonth)" :first-day-of-week="0" show-current scrollable locale="zh-cn" type="month"></v-date-picker>
                        </v-dialog>
                      </v-flex>
                      <v-flex xs12><v-text-field v-model="newWaterBill.userNo" :rules="[$store.state.rules.required]" label="用户编号" hint="" persistent-hint box required></v-text-field></v-flex>
                      <v-flex xs12><v-text-field v-model="newWaterBill.userAddress" :rules="[$store.state.rules.required, rules.lengthLessThan(250)]" label="地址" hint="" persistent-hint counter="250" box multi-line required></v-text-field></v-flex>
                      <v-flex xs12><v-text-field v-model="newWaterBill.remark" :rules="[rules.lengthLessThan(250)]" label="备注" hint="" persistent-hint counter="250" box multi-line></v-text-field></v-flex>
                    </v-layout>
                    <v-divider class="my-3"></v-divider>
                  </v-container>
                  <v-btn :disabled="!waterBillFormValid" @click.native="submitWaterBill()" color="primary" depressed>确认无误并提交</v-btn>
                </v-form>
              </v-stepper-content>
              <v-stepper-step :complete="!!submittedWaterBill" step="2">
                水表单信息
              </v-stepper-step>
              <v-stepper-content step="2">
                <v-form ref="waterForm" v-model="waterFormValid" lazy-validation>
                  <v-container grid-list-md>
                    <v-layout row no-wrap v-for="(waterItem, waterIndex) in waterList" :key="waterIndex" align-center style="overflow:auto;">
                      <v-flex xs1 order-sm1 style="min-width: 44px;">
                        <v-btn @click="1" flat icon color="pink" class="mx-0">
                          <v-icon>delete</v-icon>
                        </v-btn>
                      </v-flex>
                      <v-flex xs6 sm3>
                        <v-dialog v-model="waterItem.lastTimeMenu" lazy full-width width="290px">
                          <v-text-field slot="activator" v-model="waterItem.lastTime" :rules="[$store.state.rules.required]" label="上次抄表日" hint="" persistent-hint box required readonly></v-text-field>
                          <v-date-picker v-model="waterItem.lastTime" @input="waterItem.lastTimeMenu = false" :first-day-of-week="0" show-current scrollable locale="zh-cn"></v-date-picker>
                        </v-dialog>
                      </v-flex>
                      <v-flex xs6 sm3>
                        <v-dialog v-model="waterItem.thisTimeMenu" lazy full-width width="290px">
                          <v-text-field slot="activator" v-model="waterItem.thisTime" :rules="[$store.state.rules.required]" label="本次抄表日" hint="" persistent-hint box required readonly></v-text-field>
                          <v-date-picker v-model="waterItem.thisTime" @input="waterItem.thisTimeMenu = false" :first-day-of-week="0" show-current scrollable locale="zh-cn"></v-date-picker>
                        </v-dialog>
                      </v-flex>
                      <v-flex xs6 sm3><v-text-field v-model.number="waterItem.lastDegree" :rules="[$store.state.rules.required, $store.state.rules.noZero, $store.state.rules.nonnegative]" label="上次抄表数(m³)" hint="" persistent-hint box required type="number"></v-text-field></v-flex>
                      <v-flex xs6 sm3><v-text-field v-model.number="waterItem.nowDegree" :rules="[$store.state.rules.required, $store.state.rules.noZero, $store.state.rules.nonnegative]" label="本次抄表数(m³)" hint="" persistent-hint box required type="number"></v-text-field></v-flex>
                    </v-layout>
                  </v-container>
                </v-form>
                <v-btn @click="addWater" color="primary" outline>添加水表单</v-btn>
                <v-btn color="primary" depressed>完成</v-btn>
              </v-stepper-content>
            </v-stepper>
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
  data: () => ({
    networkLoading: false,
    networkError: false,
    rules: {
      testFloorNumber: val =>
        !new RegExp(/[^(\-?)\d+]/gi).test(val) || "该项需为整数",
      lengthLessThan: num => val => val.length <= num || `该项长度需小于${num}`
    },
    menu: {
      companyMenu: false,
      contractMenu: false,
      waterMonthMenu: false
    },
    stepNum: 2,
    // 水费账单
    waterBillFormValid: true,
    editWaterBill: {},
    newWaterBill: {
      userId: "",
      contractNo: "",
      waterMonth: "",
      userAddress: "",
      remark: ""
    },
    companyList: [],
    contractList: [],
    selectedCompany: {
      id: "",
      companyName: "",
      businessLicense: ""
    },
    selectedContract: {
      id: "",
      contractName: "",
      contractNo: ""
    },
    submittedWaterBill: null,
    // 水表单
    waterFormValid: true,
    editWater: [],
    waterList: [],
    defaultWater: {
      lastTime: "",
      thisTime: "",
      lastDegree: "",
      nowDegree: "",
      amount: "",
      cost: "",
      waterFee: "",
      waterTax: "",
      waterborneFee: "",
      remark: ""
    }
  }),
  created() {
    this.$store.commit("changeToolBarTitle", { title: "编辑水费账单" });
    this.initialize();
  },
  methods: {
    initialize() {
      this.getCompany();
      // this.networkLoading = true;
      // this.$http
      //   .post("/cms/contract/cancelList.json")
      //   .then(res => {
      //     this.networkLoading = false;
      //     let resData = res.data.data;
      //     this.contractList = resData && resData.length ? resData : [];
      //   })
      //   .catch(() => {
      //     this.networkLoading = false;
      //     this.networkError = true;
      //   });
    },
    getCompany() {
      this.$http
        .get("/cms/companyInfo/companyNameList.json")
        .then(
          res =>
            (this.companyList = res.data && res.data.length ? res.data : [])
        )
        .catch(err =>
          this.$store.commit("addSnackBar", `客户名称查询失败 ${err}`, "error")
        );
    },
    getContract(companyId) {
      this.contractList = [];
      this.$http
        .get("/cms/contract/queryContractNameById", {
          params: {
            id: companyId
          }
        })
        .then(
          res =>
            (this.contractList = res.data && res.data.length ? res.data : [])
        )
        .catch(err =>
          this.$store.commit("addSnackBar", `客户合同查询失败 ${err}`, "error")
        );
    },
    submitWaterBill() {
      if (this.$refs.waterBillForm.validate()) {
        let submitUrl = "/cms/waterBillSubaddWaterBillSub.json";
        let submitData = Object.assign(this.newWaterBill);
        // if (this.editWater.resourceStatus === 0) {
        //   submitUrl = "/cms/waterInfo/updateWaterInfoByWaterNo.json";
        //   submitData = Object.assign(
        //     {
        //       waterId: this.editWater.waterId,
        //       waterNo: this.editWater.waterNo,
        //       resourceStatus: this.editWater.resourceStatus,
        //       idleDays: this.editWater.idleDays,
        //       delFlag: this.editWater.delFlag
        //     },
        //     submitData
        //   );
        // }
        this.$http
          .post(submitUrl, submitData)
          .then(res => {
            if (res.data.code != 500) {
              this.submittedWaterBill = res.data.data;
              this.$store.commit("addSnackBar", "水费账单添加成功", "success");
              this.stepNum++;
              // this.getWaterImage();
            } else {
              throw new Error(res.data.msg);
            }
          })
          .catch(err =>
            this.$store.commit(
              "addSnackBar",
              `水费账单添加失败 ${err}`,
              "error"
            )
          );
      }
    },
    addWater() {
      this.waterList.push(Object.assign({}, this.defaultWater));
    }
  }
};
</script>
