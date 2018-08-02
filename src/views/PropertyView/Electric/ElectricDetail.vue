<template>
  <div class="fill-height electric-detail">
    <view-tool-bar>
      <span slot="bar-menu">
        <v-dialog v-model="menu.payDialog" persistent max-width="290">
          <v-btn slot="activator" flat class="mr-0">缴纳账单</v-btn>
          <v-form ref="payElectricBillForm" v-model="payElectricBillFormValid" lazy-validation>
            <v-card>
              <v-card-title primary-title class="headline">缴纳账单</v-card-title>
              <v-card-text class="pt-0">
                <v-container grid-list-md class="pa-0">
                  <v-layout wrap>
                    <v-flex xs12><v-text-field v-model.number="editedPay.lastPayment" :rules="[$store.state.rules.required, $store.state.rules.noZero, $store.state.rules.nonnegative]" label="缴纳金额" hint="" persistent-hint required type="number"></v-text-field></v-flex>
                    <v-flex xs12><v-textarea v-model="editedPay.remark" :rules="[$store.state.rules.lengthLessThan(100)]" label="备注" hint="" persistent-hint counter="100" required></v-textarea></v-flex>
                  </v-layout>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="payElectricBillClose(true)" flat>再看看</v-btn>
                <v-btn :disabled="!payElectricBillFormValid" @click="payElectricBillSave" color="primary" flat>我确认</v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-dialog>
        <v-dialog v-model="menu.editedDialog" max-width="500px" persistent>
          <v-btn slot="activator" color="primary" depressed>编辑账单</v-btn>
          <v-form ref="electricBillForm" v-model="electricBillFormValid" lazy-validation>
            <v-card>
              <v-card-title primary-title>
                <span class="headline">编辑账单</span>
                <v-spacer></v-spacer>
                <v-dialog v-model="menu.delDialog" persistent max-width="290">
                  <v-btn slot="activator" flat color="error">删除账单</v-btn>
                  <v-card>
                    <v-card-title class="headline">确认删除电费账单?</v-card-title>
                    <v-card-text>删除电费账单前请先移除该电费账单所含电费单。</v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="primary" flat @click.native="menu.delDialog = false">再看看</v-btn>
                      <v-btn color="error" flat @click.native="delElectricBill">我确认</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-card-title>
              <v-card-text class="pt-0">
                <v-container grid-list-md class="pa-0">
                  <v-layout wrap>
                    <v-flex xs12 sm6>
                      <v-dialog ref="monthdialog" v-model="menu.electricMonthMenu" :return-value.sync="editedElectricBill.electricMonth" lazy full-width width="290px">
                        <v-text-field slot="activator" v-model="editedElectricBill.electricMonth" :rules="[$store.state.rules.required]" label="月份" hint="" persistent-hint required readonly></v-text-field>
                        <v-date-picker v-model="editedElectricBill.electricMonth" @input="$refs.monthdialog.save(editedElectricBill.electricMonth)" :first-day-of-week="0" show-current scrollable locale="zh-cn" type="month"></v-date-picker>
                      </v-dialog>
                    </v-flex>
                    <!-- <v-flex xs12 sm4><v-autocomplete dense v-model="selectedCompany" @change="editedElectricBill.userId = selectedCompany.id;getContract(selectedCompany.id)" :items="companyList" item-text="companyName" item-value="id" return-object :rules="[v => !!v.id || '该项为必填项']" label="客户名称" :hint="selectedCompany.businessLicense" persistent-hint required></v-autocomplete></v-flex>
                    <v-flex xs12 sm4><v-autocomplete dense :disabled="!selectedCompany.id" v-model="selectedContract" @change="editedElectricBill.contractNo = selectedContract.contractNo" :items="contractList" item-text="contractName" item-value="contractName" return-object :rules="[v => (v.contractName&&!!v.contractName.length) || '该项为必填项']" label="合同名称" :hint="selectedContract.contractNo" persistent-hint required></v-autocomplete></v-flex> -->
                    <v-flex xs12 sm6><v-text-field v-model="editedElectricBill.userNo" :rules="[$store.state.rules.required]" label="用户编号" hint="" persistent-hint required></v-text-field></v-flex>
                    <v-flex xs12 sm3><v-text-field v-model.number="editedElectricBill.peakPrice" :rules="[$store.state.rules.nonnegative]" label="尖峰时价(元/kW·h)" hint="" persistent-hint required type="number"></v-text-field></v-flex>
                    <v-flex xs12 sm3><v-text-field v-model.number="editedElectricBill.summitPrice" :rules="[$store.state.rules.required, $store.state.rules.nonnegative]" label="峰时价(元/kW·h)" hint="" persistent-hint required type="number"></v-text-field></v-flex>
                    <v-flex xs12 sm3><v-text-field v-model.number="editedElectricBill.flatPrice" :rules="[$store.state.rules.required, $store.state.rules.nonnegative]" label="平时价(元/kW·h)" hint="" persistent-hint required type="number"></v-text-field></v-flex>
                    <v-flex xs12 sm3><v-text-field v-model.number="editedElectricBill.valleyPrice" :rules="[$store.state.rules.required, $store.state.rules.nonnegative]" label="谷时价(元/kW·h)" hint="" persistent-hint required type="number"></v-text-field></v-flex>
                    <v-flex xs12><v-textarea v-model="editedElectricBill.userAddress" :rules="[$store.state.rules.required, $store.state.rules.lengthLessThan(50)]" label="地址" hint="" persistent-hint counter="50" required></v-textarea></v-flex>
                    <v-flex xs12><v-textarea v-model="editedElectricBill.remark" :rules="[$store.state.rules.lengthLessThan(100)]" label="备注" hint="" persistent-hint counter="100"></v-textarea></v-flex>
                  </v-layout>
                  <small class="red--text text--accent-2">*&nbsp;标记为必填项</small>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn depressed @click="electricBillClose(true)">取消操作</v-btn>
                <v-btn :disabled="!electricBillFormValid" @click="electricBillSave" depressed color="primary">确认修改</v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-dialog>
      </span>
    </view-tool-bar>
    <v-jumbotron height="auto">
      <v-progress-linear v-if="networkLoading" indeterminate class="my-0"></v-progress-linear>
      <v-alert v-else-if="networkError" :value="true" type="error">网络出现异常 - 检查网络后刷新重试</v-alert>
      <v-container v-else grid-list-xl fluid fill-height>
        <v-layout justify-center wrap>
          <v-flex xs12 sm5 xl2>
            <v-subheader>基础信息</v-subheader>
            <v-card>
              <v-list dense>
                <v-list-tile v-for="electricData in electricBillDataList" :key="electricData.name">
                  <v-list-tile-content>{{ electricData.name }} : </v-list-tile-content>
                  <v-list-tile-content class="align-end">{{ electricBillInfo[electricData.value] }}</v-list-tile-content>
                </v-list-tile>
                <v-flex class="px-3" style="text-align: justify;">备注 : {{ electricBillInfo.remark }}</v-flex>
              </v-list>
            </v-card>
          </v-flex>
          <v-flex xs12 sm5 xl2>
            <v-subheader>缴纳信息</v-subheader>
            <v-card>
              <v-list dense>
                <v-list-tile v-for="electricPay in electricBillPayList" :key="electricPay.name">
                  <v-list-tile-content>{{ electricPay.name }} : </v-list-tile-content>
                  <v-list-tile-content class="align-end">{{ electricBillInfo[electricPay.value] }}</v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-card>
          </v-flex>
          <v-flex xs12 sm10 xl6>
            <v-subheader>
              所含电费单
              <v-spacer></v-spacer>
              <v-btn @click="menu.newElectricDialog = true" color="primary" depressed small>添加电表单</v-btn>
            </v-subheader>
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
    networkError: null,
    menu: {
      editedDialog: false,
      delDialog: false,
      payDialog: false,
      companyMenu: false,
      contractMenu: false,
      electricMonthMenu: false,
      newElectricDialog: false,
      lastTimeMenu: false,
      thisTimeMenu: false
    },
    // 电费账单
    electricBillDataList: [
      { name: "合同编号", value: "contractNo" },
      { name: "月份", value: "electricMonth" },
      { name: "用户编号", value: "userNo" },
      { name: "地址", value: "userAddress" },
      { name: "尖峰时价", value: "peakPrice" },
      { name: "峰时价", value: "summitPrice" },
      { name: "平时价", value: "flatPrice" },
      { name: "谷时价", value: "valleyPrice" }
    ],
    electricBillPayList: [
      { name: "尖峰时电量总计", value: "totalPeak" },
      { name: "峰时电量总计", value: "totalSummit" },
      { name: "平时电量总计", value: "totalFlat" },
      { name: "谷时电量总计", value: "totalValley" },
      { name: "用电量总计", value: "totalElectricQuantity" },
      { name: "账单总额", value: "totalElectricityFees" },
      { name: "上次缴纳", value: "lastPayment" },
      { name: "总计缴纳", value: "amountPaid" },
      { name: "剩余应缴", value: "residualPayment" }
    ],
    electricBillFormValid: true,
    editedElectricBill: {},
    defaultElectricBill: {
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
    // 缴纳账单
    payElectricBillFormValid: true,
    editedPay: {},
    defaultPay: {},
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
  watch: {
    "$route.params.electricNo"() {
      this.$router.go(0);
    }
  },
  created() {
    this.$store.commit("changeToolBarTitle", {
      title: "电费账单详情",
      isBack: true,
      crumbs: [
        { name: "电费账单概览", to: { name: "electric-list-pay" } },
        { name: "电费账单详情" }
      ]
    });
    this.editedElectricBill = Object.assign({}, this.defaultElectricBill);
    this.editedPay = Object.assign({}, this.defaultPay);
    this.editedElectric = Object.assign({}, this.defaultElectric);
    this.initialize();
    this.getCompany();
  },
  methods: {
    initialize() {
      this.networkLoading = true;
      this.networkError = false;
      this.electricBillInfo = {};
      this.electricInfoList = [];
      this.$http
        .all([
          this.$http.post("/cms/electricBillSub/selectOneElectricBillSub", {
            no: Number(this.$route.params.electricNo)
          }),
          this.$http.post("/cms/electricBill/lookElectricBill.json", {
            no: Number(this.$route.params.electricNo)
          })
        ])
        .then(
          this.$http.spread((electricBill, electric) => {
            if (electricBill.data.code == 500) {
              throw new Error(electricBill.data.msg);
            }
            // if (electric.data.code == 500) {
            //   throw new Error(electric.data.msg);
            // }
            let ebData = electricBill.data.data;
            let eData = electric.data.data;
            this.electricBillInfo = ebData && ebData.length ? ebData[0] : {};
            this.electricInfoList = eData && eData.length ? eData : [];
            for (let key in this.electricBillInfo) {
              if (this.defaultElectricBill.hasOwnProperty(key)) {
                this.defaultElectricBill[key] = this.electricBillInfo[key];
              }
            }
            this.editedElectricBill = Object.assign(
              {},
              this.defaultElectricBill
            );
          })
        )
        .catch(() => {
          this.networkError = true;
          this.$store.commit("addErrorBar", "电费账单查询失败");
        })
        .finally(() => (this.networkLoading = false));
    },
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
    electricBillClose(isCancel) {
      if (!isCancel || confirm("取消后内容将不会保存")) {
        // this.$refs.electricBillForm.reset();
        this.menu.editedDialog = false;
        this.editedElectricBill = Object.assign({}, this.defaultElectricBill);
      }
    },
    electricBillSave() {
      if (this.$refs.electricBillForm.validate()) {
        this.$http
          .post(
            "/cms/electricBillSub/updateElectricBillSub.json",
            Object.assign(
              {
                no: this.electricBillInfo.no
              },
              this.editedElectricBill
            )
          )
          .then(res => {
            if (res.data.code != 500) {
              this.$store.commit("addSuccessBar", "电费账单编辑成功");
              this.electricBillClose(false);
              this.initialize();
            } else {
              throw new Error(res.data.msg);
            }
          })
          .catch(err =>
            this.$store.commit("addErrorBar", `电费账单编辑失败 ${err}`)
          );
      }
    },
    delElectricBill() {
      this.$http
        .post("/cms/electricBillSub/deleteElectricBillSub.json", {
          no: this.electricBillInfo.no
        })
        .then(res => {
          if (res.data.code != 500) {
            this.$store.commit("addSuccessBar", "电费账单删除成功");
            this.$router.replace({
              name: "electric-list-pay"
            });
          } else {
            throw new Error(res.data.msg);
          }
        })
        .catch(err =>
          this.$store.commit("addErrorBar", `电费账单删除失败 ${err}`)
        );
    },
    payElectricBillClose(isCancel) {
      if (!isCancel || confirm("取消后内容将不会保存")) {
        this.menu.payDialog = false;
        setTimeout(() => {
          this.$refs.payElectricBillForm.reset();
          this.editedPay = Object.assign({}, this.defaultPay);
        }, 300);
      }
    },
    payElectricBillSave() {
      if (this.$refs.payElectricBillForm.validate()) {
        this.$http
          .post(
            "/cms/electricBillSub/payElectricBillSub.json",
            Object.assign(
              {
                no: this.electricBillInfo.no
              },
              this.editedPay
            )
          )
          .then(res => {
            if (res.data.code != 500) {
              this.$store.commit("addSuccessBar", "电费账单缴纳成功");
              this.payElectricBillClose(false);
              this.initialize();
            } else {
              throw new Error(res.data.msg);
            }
          })
          .catch(err =>
            this.$store.commit("addErrorBar", `电费账单缴纳失败 ${err}`)
          );
      }
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
            this.initialize();
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
            this.electricClose(false);
            this.initialize();
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
            this.electricClose(false);
            this.initialize();
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

<style lang="stylus" scoped>
.no-data {
  height: 400px;
  line-height: 400px;
  text-align: center;
}
</style>
