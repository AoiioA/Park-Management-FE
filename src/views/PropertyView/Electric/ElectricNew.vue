<template>
  <div class="fill-height electric-list">
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
              <v-stepper-step :rules="[() => !!electricBillFormValid]" :complete="stepNum>1" step="1">
                电费账单信息
              </v-stepper-step>
              <v-stepper-content step="1">
                <v-form ref="electricBillForm" v-model="electricBillFormValid" lazy-validation>
                  <v-container grid-list-md>
                    <!-- <v-subheader></v-subheader> -->
                    <v-layout row wrap>
                      <v-flex xs12 sm3>
                        <v-dialog ref="monthdialog" v-model="menu.electricMonthMenu" :return-value.sync="newElectricBill.electricMonth" lazy full-width width="290px">
                          <v-text-field slot="activator" v-model="newElectricBill.electricMonth" :rules="[$store.state.rules.required]" label="月份" hint="" persistent-hint box required readonly></v-text-field>
                          <v-date-picker v-model="newElectricBill.electricMonth" @input="$refs.monthdialog.save(newElectricBill.electricMonth)" :first-day-of-week="0" show-current scrollable locale="zh-cn" type="month"></v-date-picker>
                        </v-dialog>
                      </v-flex>
                      <v-flex xs12 sm3><v-autocomplete dense v-model="selectedCompany" @change="newElectricBill.userId = selectedCompany.id;getContract(selectedCompany.id)" :items="companyList" item-text="companyName" item-value="id" return-object :rules="[v => !!v.id || '该项为必填项']" label="客户名称" :hint="selectedCompany.businessLicense" persistent-hint box required></v-autocomplete></v-flex>
                      <v-flex xs12 sm3><v-autocomplete dense :disabled="!selectedCompany.id" v-model="selectedContract" @change="newElectricBill.contractNo = selectedContract.contractNo" :items="contractList" item-text="contractName" item-value="contractName" return-object :rules="[v => (v.contractName&&!!v.contractName.length) || '该项为必填项']" label="合同名称" :hint="selectedContract.contractNo" persistent-hint box required></v-autocomplete></v-flex>
                      <v-flex xs12 sm3><v-text-field v-model="newElectricBill.userNo" :rules="[$store.state.rules.required]" label="用户编号" hint="" persistent-hint box required></v-text-field></v-flex>
                      <v-flex xs12 sm3><v-text-field v-model.number="newElectricBill.peakPrice" :rules="[$store.state.rules.required, $store.state.rules.nonnegative]" label="尖峰时价(元/kW·h)" hint="" persistent-hint box required type="number"></v-text-field></v-flex>
                      <v-flex xs12 sm3><v-text-field v-model.number="newElectricBill.summitPrice" :rules="[$store.state.rules.required, $store.state.rules.nonnegative]" label="峰时价(元/kW·h)" hint="" persistent-hint box required type="number"></v-text-field></v-flex>
                      <v-flex xs12 sm3><v-text-field v-model.number="newElectricBill.flatPrice" :rules="[$store.state.rules.required, $store.state.rules.nonnegative]" label="平时价(元/kW·h)" hint="" persistent-hint box required type="number"></v-text-field></v-flex>
                      <v-flex xs12 sm3><v-text-field v-model.number="newElectricBill.valleyPrice" :rules="[$store.state.rules.required, $store.state.rules.nonnegative]" label="谷时价(元/kW·h)" hint="" persistent-hint box required type="number"></v-text-field></v-flex>
                      <v-flex xs12><v-textarea v-model="newElectricBill.userAddress" :rules="[$store.state.rules.required, $store.state.rules.lengthLessThan(50)]" label="地址" hint="" persistent-hint counter="50" box required></v-textarea></v-flex>
                      <v-flex xs12><v-textarea v-model="newElectricBill.remark" :rules="[$store.state.rules.lengthLessThan(100)]" label="备注" hint="" persistent-hint counter="100" box></v-textarea></v-flex>
                    </v-layout>
                    <v-divider class="my-3"></v-divider>
                  </v-container>
                  <v-btn :disabled="!electricBillFormValid" @click.native="submitElectricBill()" color="primary" depressed>确认无误并提交</v-btn>
                </v-form>
              </v-stepper-content>
              <v-stepper-step :complete="!!electricBillInfo" step="2">
                电表单信息
              </v-stepper-step>
              <v-stepper-content step="2">
                <v-container grid-list-md fluid fill-height class="px-2">
                  <v-layout>
                    <v-flex>
                      <v-card>
                        <v-dialog v-model="menu.newElectricDialog" max-width="500px" persistent>
                          <v-form ref="electricForm" v-model="electricFormValid" lazy-validation>
                            <v-card>
                              <v-card-title primary-title>
                                <span class="headline">{{ electricFormTitle }}</span>
                              </v-card-title>
                              <v-card-text class="pt-0">
                                <v-container grid-list-md class="pa-0">
                                  <v-layout wrap>
                                    <v-flex xs3>
                                      <v-dialog v-model="menu.lastTimeMenu" lazy full-width width="290px">
                                        <v-text-field slot="activator" v-model="editedElectric.lastTime" :rules="[$store.state.rules.required]" label="上次抄表日" hint="" persistent-hint required readonly></v-text-field>
                                        <v-date-picker v-model="editedElectric.lastTime" @input="menu.lastTimeMenu = false" :first-day-of-week="0" show-current scrollable locale="zh-cn"></v-date-picker>
                                      </v-dialog>
                                    </v-flex>
                                    <v-flex xs3>
                                      <v-dialog :disabled="!editedElectric.lastTime" v-model="menu.thisTimeMenu" lazy full-width width="290px">
                                        <v-text-field slot="activator" :disabled="!editedElectric.lastTime" v-model="editedElectric.thisTime" :rules="[$store.state.rules.required]" label="本次抄表日" hint="" persistent-hint required readonly></v-text-field>
                                        <v-date-picker v-model="editedElectric.thisTime" @input="menu.thisTimeMenu = false" :min="editedElectric.lastTime" :first-day-of-week="0" show-current scrollable locale="zh-cn"></v-date-picker>
                                      </v-dialog>
                                    </v-flex>
                                    <v-flex xs3><v-text-field v-model.number="editedElectric.lastDegree" :rules="[$store.state.rules.required, $store.state.rules.nonnegative]" label="上次抄表数(kW·h)" hint="" persistent-hint required type="number"></v-text-field></v-flex>
                                    <v-flex xs3><v-text-field v-model.number="editedElectric.nowDegree" :rules="[$store.state.rules.required, $store.state.rules.nonnegative]" label="本次抄表数(kW·h)" hint="" persistent-hint required type="number"></v-text-field></v-flex>
                                    <v-flex xs3><v-text-field v-model.number="editedElectric.peak" :rules="[$store.state.rules.required, $store.state.rules.nonnegative]" label="尖峰时电量(kW·h)" :hint="`尖峰时价:${electricBillInfo?electricBillInfo.peakPrice:0}元/kW·h`" persistent-hint required type="number"></v-text-field></v-flex>
                                    <v-flex xs3><v-text-field v-model.number="editedElectric.summit" :rules="[$store.state.rules.required, $store.state.rules.nonnegative]" label="峰时电量(kW·h)" :hint="`峰时价:${electricBillInfo?electricBillInfo.summitPrice:0}元/kW·h`" persistent-hint required type="number"></v-text-field></v-flex>
                                    <v-flex xs3><v-text-field v-model.number="editedElectric.flat" :rules="[$store.state.rules.required, $store.state.rules.nonnegative]" label="平时电量(kW·h)" :hint="`平时价:${electricBillInfo?electricBillInfo.flatPrice:0}元/kW·h`" persistent-hint required type="number"></v-text-field></v-flex>
                                    <v-flex xs3><v-text-field v-model.number="editedElectric.valley" :rules="[$store.state.rules.required, $store.state.rules.nonnegative]" label="谷时电量(kW·h)" :hint="`谷时价:${electricBillInfo?electricBillInfo.valleyPrice:0}元/kW·h`" persistent-hint required type="number"></v-text-field></v-flex>
                                    <v-flex xs4><v-text-field v-model="editedElectric.meterNumber" :rules="[$store.state.rules.required]" label="电表编号" hint="" persistent-hint required></v-text-field></v-flex>
                                    <v-flex xs4><v-text-field v-model.number="editedElectric.electricQuantity" :rules="[$store.state.rules.required, $store.state.rules.nonnegative]" label="用电总量(kW·h)" :hint="`约${Math.round((parseFloat(editedElectric.peak) + parseFloat(editedElectric.summit) + parseFloat(editedElectric.valley) + parseFloat(editedElectric.flat))*100)/100}kW·h`" persistent-hint required type="number"></v-text-field></v-flex>
                                    <v-flex xs4><v-text-field v-model.number="editedElectric.electricityFees" :rules="[$store.state.rules.required, $store.state.rules.nonnegative]" label="电费总额(元)" :hint="electricBillInfo?`约${Math.round((editedElectric.peak * electricBillInfo.peakPrice + editedElectric.summit * electricBillInfo.summitPrice + editedElectric.valley * electricBillInfo.valleyPrice + editedElectric.flat * electricBillInfo.flatPrice)*100)/100}元`:''" persistent-hint required type="number"></v-text-field></v-flex>
                                    <v-flex xs12><v-textarea v-model="editedElectric.remark" :rules="[$store.state.rules.lengthLessThan(100)]" label="备注" hint="" persistent-hint counter="100" required></v-textarea></v-flex>
                                  </v-layout>
                                </v-container>
                              </v-card-text>
                              <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn depressed @click.native="electricClose(true)">取消操作</v-btn>
                                <v-btn :disabled="!electricFormValid" @click.native="electricSave" depressed color="primary">编辑完成</v-btn>
                              </v-card-actions>
                            </v-card>
                          </v-form>
                        </v-dialog>
                        <v-data-table
                          :headers="electricHeader"
                          :items="electricInfoList"
                          no-data-text="暂无电表单"
                        >
                          <template slot="items" slot-scope="props">
                            <td>{{ props.item.meterNumber }}</td>
                            <td>{{ props.item.thisTime }}</td>
                            <td class="text-xs-right">{{ parseFloat(props.item.electricQuantity).toFixed(2) }}</td>
                            <td class="text-xs-right">{{ parseFloat(props.item.electricityFees).toFixed(2) }}</td>
                            <td class="text-xs-center">
                              <v-btn @click="electricEdit(props.item)" flat icon small color="grey darken-1" class="ma-0">
                                <v-icon small>edit</v-icon>
                              </v-btn>
                              <v-dialog v-model="props.item.delElectricDialog" persistent max-width="290">
                                <v-btn slot="activator" flat icon small color="grey darken-1" class="ma-0">
                                  <v-icon small>delete</v-icon>
                                </v-btn>
                                <v-card>
                                  <v-card-title class="headline">确认删除电表单?</v-card-title>
                                  <!-- <v-card-text></v-card-text> -->
                                  <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="primary" flat @click.native="props.item.delElectricDialog = false">再看看</v-btn>
                                    <v-btn color="error" flat @click.native="props.item.delElectricDialog = false;electricDelete(props.item)">我确认</v-btn>
                                  </v-card-actions>
                                </v-card>
                              </v-dialog>
                            </td>
                          </template>
                        </v-data-table>
                      </v-card>
                    </v-flex>
                  </v-layout>
                </v-container>
                <v-btn @click="menu.newElectricDialog = true" color="primary" outline>添加电表单</v-btn>
                <v-btn color="primary" depressed @click="$router.push({ name: 'electric-detail', params: { electricNo: electricBillInfo.no } })">完成</v-btn>
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
    menu: {
      companyMenu: false,
      contractMenu: false,
      electricMonthMenu: false,
      newElectricDialog: false,
      lastTimeMenu: false,
      thisTimeMenu: false
    },
    stepNum: 1,
    // 电费账单
    electricBillFormValid: true,
    newElectricBill: {
      userId: "",
      userNo: "",
      contractNo: "",
      electricMonth: "",
      peakPrice: "",
      summitPrice: "",
      valleyPrice: "",
      flatPrice: "",
      userAddress: "",
      remark: ""
    },
    companyList: [],
    contractList: [],
    selectedCompany: {},
    selectedContract: {},
    // 电表单
    electricFormValid: true,
    editedElectric: {},
    defaultElectric: {
      lastTime: "",
      thisTime: "",
      lastDegree: "",
      nowDegree: "",
      peak: "",
      summit: "",
      valley: "",
      flat: "",
      meterNumber: "",
      electricQuantity: "",
      electricityFees: "",
      remark: ""
    },
    electricHeader: [
      { text: "电表编号", value: "meterNumber" },
      { text: "抄表时间", value: "thisTime" },
      { text: "用电总量", value: "electricQuantity", align: "right" },
      { text: "电费总额", value: "electricityFees", align: "right" },
      { text: "操作", value: "thisTime", align: "center", sortable: false }
    ],
    editedElectricIndex: -1,
    electricBillInfo: null,
    electricInfoList: []
  }),
  computed: {
    electricFormTitle() {
      return this.editedElectricIndex === -1 ? "新建电表单" : "编辑电表单";
    }
  },
  created() {
    this.$store.commit("changeToolBarTitle", { title: "编辑电费账单" });
    this.editedElectric = Object.assign({}, this.defaultElectric);
    this.getCompany();
  },
  methods: {
    getCompany() {
      this.$http
        .get("/cms/companyInfo/companyNameList.json")
        .then(
          res =>
            (this.companyList = res.data && res.data.length ? res.data : [])
        )
        .catch(() => this.$store.commit("addErrorBar", "客户名称查询失败"));
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
        .catch(() => this.$store.commit("addErrorBar", "客户合同查询失败"));
    },
    submitElectricBill() {
      if (this.$refs.electricBillForm.validate()) {
        let submitUrl = "/cms/electricBillSub/addElectricBillSub.json";
        let submitData = Object.assign({}, this.newElectricBill);
        this.$http
          .post(submitUrl, submitData)
          .then(res => {
            if (res.data.code != 500) {
              this.$store.commit("addSuccessBar", "电费账单添加成功");
              this.electricBillInfo = res.data.data;
              this.stepNum++;
              this.getElectric();
            } else {
              throw new Error(res.data.msg);
            }
          })
          .catch(err =>
            this.$store.commit("addErrorBar", `电费账单添加失败 ${err}`)
          );
      }
    },
    getElectric() {
      this.$http
        .get("/cms/electricBill/lookElectricBill.json", {
          no: this.electricBillInfo.no
        })
        .then(
          res =>
            (this.electricInfoList =
              res.data && res.data.length ? res.data : [])
        );
    },
    electricEdit(item) {
      this.editedElectricIndex = this.electricInfoList.indexOf(item);
      this.editedElectric = Object.assign({}, item);
      this.menu.newElectricDialog = true;
    },
    electricDelete(item) {
      this.$http
        .post("/cms/electricBill/deleteOne.json", { no: item.no })
        .then(res => {
          if (res.data.code != 500) {
            this.$store.commit("addSuccessBar", "电表单删除成功");
            // const index = this.electricInfoList.indexOf(item);
            // this.electricInfoList.splice(index, 1);
            this.getElectric();
          } else {
            throw new Error(res.data.msg);
          }
        })
        .catch(err =>
          this.$store.commit("addErrorBar", `电表单删除失败 ${err}`)
        );
    },
    electricClose(isCancel) {
      if (!isCancel || confirm("取消后内容将不会保存")) {
        this.menu.newElectricDialog = false;
        setTimeout(() => {
          this.$refs.electricForm.reset();
          this.editedElectric = Object.assign({}, this.defaultElectric);
          this.editedElectricIndex = -1;
        }, 300);
      }
    },
    electricSave() {
      if (this.$refs.electricForm.validate()) {
        if (this.editedElectricIndex > -1) {
          this.editedElectricSave();
        } else {
          this.newelectricSave();
        }
      }
    },
    newelectricSave() {
      let submitUrl = "/cms/electricBill/add.json";
      let submitData = {
        electricBillSubNo: this.electricBillInfo.no
      };

      for (let key in this.defaultElectric) {
        if (this.defaultElectric.hasOwnProperty(key)) {
          submitData[key] = this.editedElectric[key];
        }
      }

      this.$http
        .post(submitUrl, submitData)
        .then(res => {
          if (res.data.code != 500) {
            this.$store.commit("addSuccessBar", "电表单添加成功");
            // this.electricBillInfo = res.data.data.electricBillSub;
            // this.electricInfoList.push(
            //   Object.assign({ no: res.data.data.electricBillNo }, submitData)
            // );
            this.electricClose(false);
            this.getElectric();
          } else {
            throw new Error(res.data.msg);
          }
        })
        .catch(err =>
          this.$store.commit("addErrorBar", `电表单添加失败 ${err}`)
        );
    },
    editedElectricSave() {
      let submitUrl = "/cms/electricBill/update.json";
      let submitData = {
        no: this.electricInfoList[this.editedElectricIndex].no,
        electricBillSubNo: this.electricBillInfo.no
      };

      for (let key in this.defaultElectric) {
        if (this.defaultElectric.hasOwnProperty(key)) {
          submitData[key] = this.editedElectric[key];
        }
      }

      this.$http
        .post(submitUrl, submitData)
        .then(res => {
          if (res.data.code != 500) {
            this.$store.commit("addSuccessBar", "电表单编辑成功");
            // this.electricBillInfo = res.data.data;
            // Object.assign(
            //   this.electricInfoList[this.editedElectricIndex],
            //   submitData
            // );
            this.electricClose(false);
            this.getElectric();
          } else {
            throw new Error(res.data.msg);
          }
        })
        .catch(err =>
          this.$store.commit("addErrorBar", `电表单编辑失败 ${err}`)
        );
    }
  }
};
</script>
