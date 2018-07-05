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
                      <v-flex xs12 sm4><v-autocomplete dense v-model="selectedCompany" @change="newWaterBill.userId = selectedCompany.id;getContract(selectedCompany.id)" :items="companyList" item-text="companyName" item-value="id" return-object :rules="[$store.state.rules.required]" label="客户名称" :hint="selectedCompany.businessLicense" persistent-hint box required></v-autocomplete></v-flex>
                      <v-flex xs12 sm4><v-autocomplete dense :disabled="!selectedCompany.id" v-model="selectedContract" @change="newWaterBill.contractNo = selectedContract.contractNo" :items="contractList" item-text="contractName" item-value="contractName" return-object :rules="[$store.state.rules.required]" label="合同名称" :hint="selectedContract.contractNo" persistent-hint box required></v-autocomplete></v-flex>
                      <v-flex xs12 sm4>
                        <v-dialog ref="monthdialog" v-model="menu.waterMonthMenu" :return-value.sync="newWaterBill.waterMonth" lazy full-width width="290px">
                          <v-text-field slot="activator" v-model="newWaterBill.waterMonth" :rules="[$store.state.rules.required]" label="月份" hint="" persistent-hint box required readonly></v-text-field>
                          <v-date-picker v-model="newWaterBill.waterMonth" @input="$refs.monthdialog.save(newWaterBill.waterMonth)" :first-day-of-week="0" show-current scrollable locale="zh-cn" type="month"></v-date-picker>
                        </v-dialog>
                      </v-flex>
                      <v-flex xs12><v-text-field v-model="newWaterBill.userNo" :rules="[$store.state.rules.required]" label="用户编号" hint="" persistent-hint box required></v-text-field></v-flex>
                      <v-flex xs12><v-textarea v-model="newWaterBill.userAddress" :rules="[$store.state.rules.required, rules.lengthLessThan(250)]" label="地址" hint="" persistent-hint counter="250" box required></v-textarea></v-flex>
                      <v-flex xs12><v-textarea v-model="newWaterBill.remark" :rules="[rules.lengthLessThan(250)]" label="备注" hint="" persistent-hint counter="250" box></v-textarea></v-flex>
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
                <v-container grid-list-md fluid fill-height class="px-2">
                  <v-layout>
                    <v-flex>
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
                                    <v-flex xs6>
                                      <v-dialog v-model="menu.lastTimeMenu" lazy full-width width="290px">
                                        <v-text-field slot="activator" v-model="editedWater.lastTime" :rules="[$store.state.rules.required]" label="上次抄表日" hint="" persistent-hint required readonly></v-text-field>
                                        <v-date-picker v-model="editedWater.lastTime" @input="menu.lastTimeMenu = false" :first-day-of-week="0" show-current scrollable locale="zh-cn"></v-date-picker>
                                      </v-dialog>
                                    </v-flex>
                                    <v-flex xs6>
                                      <v-dialog :disabled="!editedWater.lastTime" v-model="menu.thisTimeMenu" lazy full-width width="290px">
                                        <v-text-field slot="activator" :disabled="!editedWater.lastTime" v-model="editedWater.thisTime" :rules="[$store.state.rules.required]" label="本次抄表日" hint="" persistent-hint required readonly></v-text-field>
                                        <v-date-picker v-model="editedWater.thisTime" @input="menu.thisTimeMenu = false" :min="editedWater.lastTime" :first-day-of-week="0" show-current scrollable locale="zh-cn"></v-date-picker>
                                      </v-dialog>
                                    </v-flex>
                                    <v-flex xs3><v-text-field v-model.number="editedWater.lastDegree" :rules="[$store.state.rules.required, $store.state.rules.noZero, $store.state.rules.nonnegative]" label="上次抄表数(m³)" hint="" persistent-hint required type="number"></v-text-field></v-flex>
                                    <v-flex xs3><v-text-field v-model.number="editedWater.nowDegree" :rules="[$store.state.rules.required, $store.state.rules.noZero, $store.state.rules.nonnegative]" label="本次抄表数(m³)" hint="" persistent-hint required type="number"></v-text-field></v-flex>
                                    <v-flex xs3><v-text-field v-model.number="editedWater.amount" :rules="[$store.state.rules.required, $store.state.rules.noZero, $store.state.rules.nonnegative]" label="用量(m³)" hint="" persistent-hint required type="number"></v-text-field></v-flex>
                                    <v-flex xs3><v-text-field v-model.number="editedWater.cost" :rules="[$store.state.rules.required, $store.state.rules.noZero, $store.state.rules.nonnegative]" label="水费用(元/m³)" hint="" persistent-hint required type="number"></v-text-field></v-flex>
                                    <v-flex xs4><v-text-field v-model.number="editedWater.waterFee" :rules="[$store.state.rules.required, $store.state.rules.noZero, $store.state.rules.nonnegative]" label="水费金额(元)" hint="" persistent-hint required type="number"></v-text-field></v-flex>
                                    <v-flex xs4><v-text-field v-model.number="editedWater.waterTax" :rules="[$store.state.rules.required, $store.state.rules.noZero, $store.state.rules.nonnegative]" label="水资源费改税(元)" hint="" persistent-hint required type="number"></v-text-field></v-flex>
                                    <v-flex xs4><v-text-field v-model.number="editedWater.waterborneFee" :rules="[$store.state.rules.required, $store.state.rules.noZero, $store.state.rules.nonnegative]" label="污水处理费(元)" hint="" persistent-hint required type="number"></v-text-field></v-flex>
                                    <v-flex xs12><v-textarea v-model="editedWater.remark" label="备注" hint="" persistent-hint required></v-textarea></v-flex>
                                  </v-layout>
                                </v-container>
                              </v-card-text>
                              <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn depressed @click.native="waterClose">取消操作</v-btn>
                                <v-btn :disabled="!waterFormValid" @click.native="waterSave" depressed color="primary">确认添加</v-btn>
                              </v-card-actions>
                            </v-card>
                          </v-form>
                        </v-dialog>
                        <v-data-table
                          :headers="waterHeader"
                          :items="waterList"
                          no-data-text="暂无水费单"
                        >
                          <template slot="items" slot-scope="props">
                            <td>{{ props.item.thisTime }}</td>
                            <td>{{ parseFloat(props.item.amount).toFixed(2) }}</td>
                            <td>{{ parseFloat(props.item.waterFee).toFixed(2) }}</td>
                            <td>{{ (parseFloat(props.item.waterTax) + parseFloat(props.item.waterborneFee)).toFixed(2) }}</td>
                            <td>
                              <v-icon v-if="true" small class="mr-2" @click="waterEdit(props.item)">edit</v-icon>
                              <v-dialog v-model="menu.delWaterDialog" persistent max-width="290">
                                <v-icon slot="activator" small>delete</v-icon>
                                <v-card>
                                  <v-card-title class="headline">确认删除水表单?</v-card-title>
                                  <!-- <v-card-text></v-card-text> -->
                                  <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="primary" flat @click.native="menu.delWaterDialog = false">再看看</v-btn>
                                    <v-btn color="error" flat @click.native="waterDelete(props.item)">我确认</v-btn>
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
                <v-btn @click="menu.newWaterDialog = true" color="primary" outline>添加水表单</v-btn>
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
      waterMonthMenu: false,
      delWaterDialog: false,
      newWaterDialog: false,
      lastTimeMenu: false,
      thisTimeMenu: false
    },
    stepNum: 1,
    // 水费账单
    waterBillFormValid: true,
    editedWaterBill: {},
    newWaterBill: {
      userId: "",
      userNo: "",
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
    editedWater: {},
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
    },
    waterList: [],
    waterHeader: [
      { text: "抄表时间", value: "thisTime" },
      { text: "用量(m³)", value: "amount" },
      { text: "水费金额(元)", value: "waterFee" },
      { text: "其他费用(元)", value: "waterTax&waterborneFee" },
      { text: "操作", value: "thisTime", sortable: false }
    ],
    editedWaterIndex: -1
  }),
  computed: {
    waterFormTitle() {
      return this.editedWaterIndex === -1 ? "新建水表单" : "编辑水表单";
    }
  },
  created() {
    this.$store.commit("changeToolBarTitle", { title: "编辑水费账单" });
    this.initialize();
    this.editedWater = Object.assign({}, this.defaultWater);
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
        let submitData = Object.assign({}, this.newWaterBill);
        // if (this.editedWater.resourceStatus === 0) {
        //   submitUrl = "/cms/waterInfo/updateWaterInfoByWaterNo.json";
        //   submitData = Object.assign(
        //     {
        //       waterId: this.editedWater.waterId,
        //       waterNo: this.editedWater.waterNo,
        //       resourceStatus: this.editedWater.resourceStatus,
        //       idleDays: this.editedWater.idleDays,
        //       delFlag: this.editedWater.delFlag
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
    },
    waterEdit(item) {
      this.editedWaterIndex = this.waterList.indexOf(item);
      this.editedWater = Object.assign({}, item);
      this.menu.newWaterDialog = true;
    },
    waterDelete(item) {
      const index = this.waterList.indexOf(item);
      this.waterList.splice(index, 1);
    },
    waterClose() {
      this.menu.newWaterDialog = false;
      setTimeout(() => {
        this.editedWater = Object.assign({}, this.defaultWater);
        this.editedWaterIndex = -1;
      }, 300);
    },
    waterSave() {
      if (this.$refs.waterForm.validate()) {
        let submitUrl = "/cms/waterBill/add.json";
        let submitData = Object.assign(
          {
            waterBillSubNo: this.submittedWaterBill.No
          },
          this.editedWater
        );

        this.$http
          .post(submitUrl, submitData)
          .then(res => {
            if (res.data.code != 500) {
              if (this.editedWaterIndex > -1) {
                Object.assign(
                  this.waterList[this.editedWaterIndex],
                  res.data.data
                );
              } else {
                this.waterList.push(res.data.data);
              }
              this.waterClose();
              this.$store.commit("addSnackBar", "水表单添加成功", "success");
            } else {
              throw new Error(res.data.msg);
            }
          })
          .catch(err =>
            this.$store.commit("addSnackBar", `水表单添加失败 ${err}`, "error")
          );
      }
    }
  }
};
</script>
