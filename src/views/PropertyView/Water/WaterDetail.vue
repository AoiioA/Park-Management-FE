<template>
  <div class="fill-height water-detail">
    <view-tool-bar>
      <span slot="bar-menu">
        <v-dialog v-model="menu.payDialog" persistent max-width="290">
          <v-btn slot="activator" flat class="mr-0">缴纳账单</v-btn>
          <v-form ref="payWaterBillForm" v-model="payWaterBillFormValid" lazy-validation>
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
                <v-btn @click="payWaterBillClose(true)" flat>再看看</v-btn>
                <v-btn :disabled="!payWaterBillFormValid" @click="payWaterBillSave" color="primary" flat>我确认</v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-dialog>
        <v-dialog v-model="menu.editedDialog" max-width="500px" persistent>
          <v-btn slot="activator" color="primary" depressed>编辑账单</v-btn>
          <v-form ref="waterBillForm" v-model="waterBillFormValid" lazy-validation>
            <v-card>
              <v-card-title primary-title>
                <span class="headline">编辑账单</span>
                <v-spacer></v-spacer>
                <v-dialog v-model="menu.delDialog" persistent max-width="290">
                  <v-btn slot="activator" flat color="error">删除账单</v-btn>
                  <v-card>
                    <v-card-title class="headline">确认删除水费账单?</v-card-title>
                    <v-card-text>删除水费账单前请先移除该水费账单所含水费单。</v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="primary" flat @click.native="menu.delDialog = false">再看看</v-btn>
                      <v-btn color="error" flat @click.native="delWaterBill">我确认</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-card-title>
              <v-card-text class="pt-0">
                <v-container grid-list-md class="pa-0">
                  <v-layout wrap>
                    <v-flex xs12 sm6>
                      <v-dialog ref="monthdialog" v-model="menu.waterMonthMenu" :return-value.sync="editedWaterBill.waterMonth" lazy full-width width="290px">
                        <v-text-field slot="activator" v-model="editedWaterBill.waterMonth" :rules="[$store.state.rules.required]" label="月份" hint="" persistent-hint required readonly></v-text-field>
                        <v-date-picker v-model="editedWaterBill.waterMonth" @input="$refs.monthdialog.save(editedWaterBill.waterMonth)" :first-day-of-week="0" show-current scrollable locale="zh-cn" type="month"></v-date-picker>
                      </v-dialog>
                    </v-flex>
                    <!-- <v-flex xs12 sm4><v-autocomplete dense v-model="selectedCompany" @change="editedWaterBill.userId = selectedCompany.id;getContract(selectedCompany.id)" :items="companyList" item-text="companyName" item-value="id" return-object :rules="[v => !!v.id || '该项为必填项']" label="客户名称" :hint="selectedCompany.businessLicense" persistent-hint required></v-autocomplete></v-flex>
                    <v-flex xs12 sm4><v-autocomplete dense :disabled="!selectedCompany.id" v-model="selectedContract" @change="editedWaterBill.contractNo = selectedContract.contractNo" :items="contractList" item-text="contractName" item-value="contractName" return-object :rules="[v => (v.contractName&&!!v.contractName.length) || '该项为必填项']" label="合同名称" :hint="selectedContract.contractNo" persistent-hint required></v-autocomplete></v-flex> -->
                    <v-flex xs12 sm6><v-text-field v-model="editedWaterBill.userNo" :rules="[$store.state.rules.required]" label="用户编号" hint="" persistent-hint required></v-text-field></v-flex>
                    <v-flex xs12><v-textarea v-model="editedWaterBill.userAddress" :rules="[$store.state.rules.required, $store.state.rules.lengthLessThan(50)]" label="地址" hint="" persistent-hint counter="50" required></v-textarea></v-flex>
                    <v-flex xs12><v-textarea v-model="editedWaterBill.remark" :rules="[$store.state.rules.lengthLessThan(100)]" label="备注" hint="" persistent-hint counter="100"></v-textarea></v-flex>
                  </v-layout>
                  <small class="red--text text--accent-2">*&nbsp;标记为必填项</small>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn depressed @click="waterBillClose(true)">取消操作</v-btn>
                <v-btn :disabled="!waterBillFormValid" @click="waterBillSave" depressed color="primary">确认修改</v-btn>
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
            <v-card height="328">
              <v-list dense>
                <v-list-tile v-for="waterData in waterBillDataList" :key="waterData.text">
                  <v-list-tile-content>{{ waterData.text }} : </v-list-tile-content>
                  <v-list-tile-content class="align-end">{{ waterData.getData(waterBillInfo[waterData.value]) }}</v-list-tile-content>
                </v-list-tile>
                <v-flex class="px-3" style="text-align: justify;">备注 : {{ waterBillInfo.remark }}</v-flex>
              </v-list>
            </v-card>
          </v-flex>
          <v-flex xs12 sm5 xl2>
            <v-subheader>缴纳信息</v-subheader>
            <v-card>
              <v-list dense>
                <v-list-tile v-for="waterPay in waterBillPayList" :key="waterPay.text">
                  <v-list-tile-content>{{ waterPay.text }} : </v-list-tile-content>
                  <v-list-tile-content class="align-end">{{ waterPay.getData(waterBillInfo[waterPay.value]) }}</v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-card>
          </v-flex>
          <v-flex xs12 sm10 xl6>
            <v-subheader>
              所含水费单
              <v-spacer></v-spacer>
              <v-btn @click="menu.newWaterDialog = true" color="primary" depressed small>添加水表单</v-btn>
            </v-subheader>
            <v-card>
              <v-dialog v-model="menu.newWaterDialog" max-width="500px" persistent>
                <v-form ref="waterForm" v-model="waterFormValid" lazy-validation>
                  <v-card>
                    <v-card-title primary-title>
                      <span class="headline">{{ waterFormTitle }}</span>
                    </v-card-title>
                    <v-card-text class="pt-0">
                      <v-container grid-list-md class="pa-0">
                        <v-layout wrap>
                          <v-flex xs4>
                            <v-dialog v-model="menu.lastTimeMenu" lazy full-width width="290px">
                              <v-text-field slot="activator" v-model="editedWater.lastTime" :rules="[$store.state.rules.required]" label="上次抄表日" hint="" persistent-hint required readonly></v-text-field>
                              <v-date-picker v-model="editedWater.lastTime" @input="menu.lastTimeMenu = false" :first-day-of-week="0" show-current scrollable locale="zh-cn"></v-date-picker>
                            </v-dialog>
                          </v-flex>
                          <v-flex xs4><v-text-field v-model.number="editedWater.lastDegree" :rules="[$store.state.rules.required, $store.state.rules.nonnegative]" label="上次抄表数(m³)" hint="" persistent-hint required type="number"></v-text-field></v-flex>
                          <v-flex xs4><v-text-field v-model.number="editedWater.amount" :rules="[$store.state.rules.required, $store.state.rules.nonnegative]" label="用水量(m³)" hint="" persistent-hint required type="number"></v-text-field></v-flex>
                          <v-flex xs4>
                            <v-dialog :disabled="!editedWater.lastTime" v-model="menu.thisTimeMenu" lazy full-width width="290px">
                              <v-text-field slot="activator" :disabled="!editedWater.lastTime" v-model="editedWater.thisTime" :rules="[$store.state.rules.required]" label="本次抄表日" hint="" persistent-hint required readonly></v-text-field>
                              <v-date-picker v-model="editedWater.thisTime" @input="menu.thisTimeMenu = false" :min="editedWater.lastTime" :first-day-of-week="0" show-current scrollable locale="zh-cn"></v-date-picker>
                            </v-dialog>
                          </v-flex>
                          <v-flex xs4><v-text-field v-model.number="editedWater.nowDegree" :rules="[$store.state.rules.required, $store.state.rules.nonnegative]" label="本次抄表数(m³)" hint="" persistent-hint required type="number"></v-text-field></v-flex>
                          <v-flex xs4><v-text-field v-model.number="editedWater.cost" :rules="[$store.state.rules.required, $store.state.rules.nonnegative]" label="用水费用(元)" hint="" persistent-hint required type="number"></v-text-field></v-flex>
                          <v-flex xs4><v-text-field v-model.number="editedWater.waterTax" :rules="[$store.state.rules.required, $store.state.rules.nonnegative]" label="水资源费改税(元)" hint="" persistent-hint required type="number"></v-text-field></v-flex>
                          <v-flex xs4><v-text-field v-model.number="editedWater.waterborneFee" :rules="[$store.state.rules.required, $store.state.rules.nonnegative]" label="污水处理费(元)" hint="" persistent-hint required type="number"></v-text-field></v-flex>
                          <v-flex xs4><v-text-field v-model.number="editedWater.waterFee" :rules="[$store.state.rules.required, $store.state.rules.nonnegative]" label="水费总额(元)" :hint="`约${Math.round((parseFloat(this.editedWater.cost) + parseFloat(this.editedWater.waterTax) + parseFloat(this.editedWater.waterborneFee))*100)/100}元`" persistent-hint required type="number"></v-text-field></v-flex>
                          <v-flex xs12><v-textarea v-model="editedWater.remark" :rules="[$store.state.rules.lengthLessThan(100)]" label="备注" hint="" persistent-hint counter="100" required></v-textarea></v-flex>
                        </v-layout>
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn depressed @click.native="waterClose(true)">取消操作</v-btn>
                      <v-btn :disabled="!waterFormValid" @click.native="waterSave" depressed color="primary">编辑完成</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-form>
              </v-dialog>
              <v-data-table
                :headers="waterHeader"
                :items="waterInfoList"
                no-data-text="暂无水表单"
              >
                <template slot="items" slot-scope="props">
                  <td>{{ props.item.thisTime }}</td>
                  <td class="text-xs-right">{{ parseFloat(props.item.amount).toFixed(2) }}</td>
                  <td class="text-xs-right">{{ parseFloat(props.item.cost).toFixed(2) }}</td>
                  <td class="text-xs-right">{{ parseFloat(props.item.waterFee).toFixed(2) }}</td>
                  <td class="text-xs-center">
                    <v-btn @click="waterEdit(props.item)" flat icon small color="grey darken-1" class="ma-0">
                      <v-icon small>edit</v-icon>
                    </v-btn>
                    <v-dialog v-model="props.item.delWaterDialog" persistent max-width="290">
                      <v-btn slot="activator" flat icon small color="grey darken-1" class="ma-0">
                        <v-icon small>delete</v-icon>
                      </v-btn>
                      <v-card>
                        <v-card-title class="headline">确认删除水表单?</v-card-title>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn color="primary" flat @click.native="props.item.delWaterDialog = false">再看看</v-btn>
                          <v-btn color="error" flat @click.native="props.item.delWaterDialog = false;waterDelete(props.item)">我确认</v-btn>
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
  props: ["waterNo"],
  data: () => ({
    networkLoading: false,
    networkError: null,
    menu: {
      editedDialog: false,
      delDialog: false,
      payDialog: false,
      companyMenu: false,
      contractMenu: false,
      waterMonthMenu: false,
      newWaterDialog: false,
      lastTimeMenu: false,
      thisTimeMenu: false
    },
    // 水费账单
    waterBillDataList: [
      { text: "合同编号", value: "contractNo", getData: v => v },
      { text: "月份", value: "waterMonth", getData: v => v },
      { text: "用户编号", value: "userNo", getData: v => v },
      { text: "地址", value: "userAddress", getData: v => v }
    ],
    waterBillPayList: [
      { text: "用水量总计", value: "totalAmount", getData: v => `${v}m³` },
      { text: "用水费用总计", value: "totalCost", getData: v => `${v}元` },
      {
        text: "水资源费改税总计",
        value: "totalWaterTax",
        getData: v => `${v}元`
      },
      {
        text: "污水处理费总计",
        value: "totalWaterborneFee",
        getData: v => `${v}元`
      },
      { text: "账单总额", value: "totalWaterFee", getData: v => `${v}元` },
      { text: "上次缴纳", value: "lastPayment", getData: v => `${v}元` },
      { text: "总计缴纳", value: "amountPaid", getData: v => `${v}元` },
      { text: "剩余应缴", value: "residualPayment", getData: v => `${v}元` }
    ],
    waterBillFormValid: true,
    editedWaterBill: {},
    defaultWaterBill: {
      userId: "",
      userNo: "",
      contractNo: "",
      waterMonth: "",
      userAddress: "",
      remark: ""
    },
    companyList: [],
    contractList: [],
    selectedCompany: {},
    selectedContract: {},
    // 缴纳账单
    payWaterBillFormValid: true,
    editedPay: {},
    defaultPay: {},
    // 水表单
    waterFormValid: true,
    editedWater: {},
    defaultWater: {
      lastTime: "",
      thisTime: "",
      lastDegree: "",
      nowDegree: "",
      amount: "",
      cost: "",
      waterTax: "",
      waterborneFee: "",
      waterFee: "",
      remark: ""
    },
    waterHeader: [
      { text: "抄表时间", value: "thisTime" },
      { text: "用水量(m³)", value: "amount", align: "right" },
      { text: "用水费用", value: "cost", align: "right" },
      { text: "水费总额", value: "waterFee", align: "right" },
      { text: "操作", value: "thisTime", align: "center", sortable: false }
    ],
    editedWaterIndex: -1,
    waterBillInfo: null,
    waterInfoList: []
  }),
  computed: {
    waterFormTitle() {
      return this.editedWaterIndex === -1 ? "新建水表单" : "编辑水表单";
    }
  },
  watch: {
    waterNo() {
      this.initialize();
    }
  },
  created() {
    this.$store.commit("changeToolBarTitle", {
      title: "水费账单详情",
      isBack: true,
      crumbs: [
        {
          name: "水费账单概览",
          to: {
            name: "water-list",
            params: { waterType: "paid" }
          }
        },
        { name: "水费账单详情" }
      ]
    });
    this.initialize();
    this.getCompany();
  },
  methods: {
    initialize() {
      this.editedWaterBill = Object.assign({}, this.defaultWaterBill);
      this.editedPay = Object.assign({}, this.defaultPay);
      this.editedWater = Object.assign({}, this.defaultWater);
      this.networkLoading = true;
      this.networkError = false;
      this.waterBillInfo = {};
      this.waterInfoList = [];
      this.$http
        .all([
          this.$http.post("/cms/waterBillSub/selectOneWaterBill", {
            no: Number(this.waterNo)
          }),
          this.$http.post("/cms/waterBill/lookWaterBill.json", {
            no: Number(this.waterNo)
          })
        ])
        .then(
          this.$http.spread((waterBill, water) => {
            if (waterBill.data.code == 500) {
              throw new Error(waterBill.data.msg);
            }
            // if (water.data.code == 500) {
            //   throw new Error(water.data.msg);
            // }
            this.waterBillInfo = waterBill.data.data;
            let wData = water.data.data;
            this.waterInfoList = wData && wData.length ? wData : [];
            for (let key in this.waterBillInfo) {
              if (this.defaultWaterBill.hasOwnProperty(key)) {
                this.defaultWaterBill[key] = this.waterBillInfo[key];
              }
            }
            this.editedWaterBill = Object.assign({}, this.defaultWaterBill);
          })
        )
        .catch(() => {
          this.networkError = true;
          this.$store.commit("addErrorBar", "水费账单查询失败");
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
    waterBillClose(isCancel) {
      if (!isCancel || confirm("取消后内容将不会保存")) {
        // this.$refs.waterBillForm.reset();
        this.menu.editedDialog = false;
        this.editedWaterBill = Object.assign({}, this.defaultWaterBill);
      }
    },
    waterBillSave() {
      if (this.$refs.waterBillForm.validate()) {
        this.$http
          .post(
            "/cms/waterBillSub/updateWaterBillSub.json",
            Object.assign(
              {
                no: this.waterBillInfo.no
              },
              this.editedWaterBill
            )
          )
          .then(res => {
            if (res.data.code != 500) {
              this.$store.commit("addSuccessBar", "水费账单编辑成功");
              this.waterBillClose(false);
              this.initialize();
            } else {
              throw new Error(res.data.msg);
            }
          })
          .catch(err =>
            this.$store.commit("addErrorBar", `水费账单编辑失败 ${err}`)
          );
      }
    },
    delWaterBill() {
      this.$http
        .post("/cms/waterBillSub/deleteWaterBillSub.json", {
          no: this.waterBillInfo.no
        })
        .then(res => {
          if (res.data.code != 500) {
            this.$store.commit("addSuccessBar", "水费账单删除成功");
            this.$router.replace({
              name: "water-list",
              params: { waterType: "paid" }
            });
          } else {
            throw new Error(res.data.msg);
          }
        })
        .catch(err =>
          this.$store.commit("addErrorBar", `水费账单删除失败 ${err}`)
        );
    },
    payWaterBillClose(isCancel) {
      if (!isCancel || confirm("取消后内容将不会保存")) {
        this.menu.payDialog = false;
        setTimeout(() => {
          this.$refs.payWaterBillForm.reset();
          this.editedPay = Object.assign({}, this.defaultPay);
        }, 300);
      }
    },
    payWaterBillSave() {
      if (this.$refs.payWaterBillForm.validate()) {
        this.$http
          .post(
            "/cms/waterBillSub/payWaterBillSub.json",
            Object.assign(
              {
                no: this.waterBillInfo.no
              },
              this.editedPay
            )
          )
          .then(res => {
            if (res.data.code != 500) {
              this.$store.commit("addSuccessBar", "水费账单缴纳成功");
              this.payWaterBillClose(false);
              this.initialize();
            } else {
              throw new Error(res.data.msg);
            }
          })
          .catch(err =>
            this.$store.commit("addErrorBar", `水费账单缴纳失败 ${err}`)
          );
      }
    },
    waterEdit(item) {
      this.editedWaterIndex = this.waterInfoList.indexOf(item);
      this.editedWater = Object.assign({}, item);
      this.menu.newWaterDialog = true;
    },
    waterDelete(item) {
      this.$http
        .post("/cms/waterBill/deleteOne.json", { no: item.no })
        .then(res => {
          if (res.data.code != 500) {
            this.$store.commit("addSuccessBar", "水表单删除成功");
            this.initialize();
          } else {
            throw new Error(res.data.msg);
          }
        })
        .catch(err =>
          this.$store.commit("addErrorBar", `水表单删除失败 ${err}`)
        );
    },
    waterClose(isCancel) {
      if (!isCancel || confirm("取消后内容将不会保存")) {
        this.menu.newWaterDialog = false;
        setTimeout(() => {
          this.$refs.waterForm.reset();
          this.editedWater = Object.assign({}, this.defaultWater);
          this.editedWaterIndex = -1;
        }, 300);
      }
    },
    waterSave() {
      if (this.$refs.waterForm.validate()) {
        if (this.editedWaterIndex > -1) {
          this.editedWaterSave();
        } else {
          this.newWaterSave();
        }
      }
    },
    newWaterSave() {
      let submitUrl = "/cms/waterBill/add.json";
      let submitData = {
        waterBillSubNo: this.waterBillInfo.no
      };

      for (let key in this.defaultWater) {
        if (this.defaultWater.hasOwnProperty(key)) {
          submitData[key] = this.editedWater[key];
        }
      }

      this.$http
        .post(submitUrl, submitData)
        .then(res => {
          if (res.data.code != 500) {
            this.$store.commit("addSuccessBar", "水表单添加成功");
            this.waterClose(false);
            this.initialize();
          } else {
            throw new Error(res.data.msg);
          }
        })
        .catch(err =>
          this.$store.commit("addErrorBar", `水表单添加失败 ${err}`)
        );
    },
    editedWaterSave() {
      let submitUrl = "/cms/waterBill/update.json";
      let submitData = {
        no: this.waterInfoList[this.editedWaterIndex].no,
        waterBillSubNo: this.waterBillInfo.no
      };

      for (let key in this.defaultWater) {
        if (this.defaultWater.hasOwnProperty(key)) {
          submitData[key] = this.editedWater[key];
        }
      }

      this.$http
        .post(submitUrl, submitData)
        .then(res => {
          if (res.data.code != 500) {
            this.$store.commit("addSuccessBar", "水表单编辑成功");
            this.waterClose(false);
            this.initialize();
          } else {
            throw new Error(res.data.msg);
          }
        })
        .catch(err =>
          this.$store.commit("addErrorBar", `水表单编辑失败 ${err}`)
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
