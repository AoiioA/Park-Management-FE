<template>
  <transition name="slide-fade">
    <v-container class="contract-new">
      <v-layout align-start align-content-start justify-center wrap>
        <v-flex xs12 md10 lg8 class="headline">
          <v-btn flat icon @click="$router.go(-1)">
            <v-icon>close</v-icon>
          </v-btn>
          添加新合同并提交审核
        </v-flex>
        <v-flex xs12 md10 lg8>
          <v-stepper v-model="stepNum" vertical class="elevation-0 new-stepper">
            <v-stepper-step :complete="stepNum > 1" step="1">
              填写合同相关人
              <small>包含甲方、承租方、中介方信息</small>
            </v-stepper-step>
            <v-stepper-content step="1">
              <v-container class="mb-3">
                <!-- <v-subheader>甲方信息</v-subheader> -->
                <v-layout row wrap>
                  <v-flex xs12 sm6 class="pr-3"><v-text-field v-model="newCTRT.signedPersonA" :rules="[rules.required]" label="甲方公司" hint="" box></v-text-field></v-flex>
                  <v-flex xs12 sm6 class="pr-3"><v-text-field v-model="newCTRT.partyA" :rules="[rules.required]" label="甲方签订人" hint="" persistent-hint box></v-text-field></v-flex>
                </v-layout>
                <v-divider class="my-4"></v-divider>
                <v-flex xs12 sm6>
                  <v-radio-group v-model="newCTRT.type" :rules="[rules.required]" hint="切换承租方类型" persistent-hint row class="px-3 py-0">
                    <v-radio label="公司承租" value="company"></v-radio>
                    <v-radio label="个人承租" value="personal"></v-radio>
                  </v-radio-group>
                </v-flex>
                <v-layout row wrap v-if="newCTRT.type=='company'">
                  <v-flex xs12 sm4 class="pr-3"><v-text-field v-model="newCTRT.companyName" :rules="[rules.required]" label="承租方公司" hint="" persistent-hint box></v-text-field></v-flex>
                  <v-flex xs12 sm4 class="pr-3"><v-text-field v-model="newCTRT.businessLicense" :rules="[rules.required]" label="承租方营业执照" hint="" persistent-hint box></v-text-field></v-flex>
                  <v-flex xs12 sm4 class="pr-3"><v-text-field v-model="newCTRT.legalPerson" :rules="[rules.required]" label="承租方公司法人" hint="" persistent-hint box></v-text-field></v-flex>
                </v-layout>
                <v-layout row wrap>
                  <v-flex xs12 sm4 class="pr-3"><v-text-field v-model="newCTRT.signedPersonB" :rules="[rules.required]" label="承租方签订人" hint="" persistent-hint box></v-text-field></v-flex>
                  <v-flex xs12 sm4 class="pr-3"><v-text-field v-model="newCTRT.companyTel" :rules="[rules.required]" mask="(+##)###-####-####" label="承租方联系方式" hint="" persistent-hint box></v-text-field></v-flex>
                  <v-flex xs12 sm4 class="pr-3"><v-text-field v-model="newCTRT.companyIndustry" :rules="[rules.required]" label="承租方所属行业" hint="" persistent-hint box></v-text-field></v-flex>
                  <v-flex xs12 class="pr-3"><v-text-field v-model="newCTRT.address" :rules="[rules.required]" label="承租方通讯地址" hint="" persistent-hint box></v-text-field></v-flex>
                </v-layout>
                <v-divider class="my-4"></v-divider>
                <v-flex xs12 sm6><v-switch v-model="newCTRT.hasIntermediator" :label="newCTRT.hasIntermediator?'包含中介方':'无中介方'" class="px-0 py-0"></v-switch></v-flex>
                <v-layout row wrap v-if="newCTRT.hasIntermediator">
                  <v-flex xs12 sm6 class="pr-3"><v-text-field v-model="newCTRT.intermediator" :rules="[rules.required]" label="经纪人姓名" hint="" persistent-hint box></v-text-field></v-flex>
                  <v-flex xs12 sm6 class="pr-3"><v-text-field v-model="newCTRT.idCode" :rules="[rules.required]" mask="nnnnnnnnnnnnnnnnnn#" label="经纪人身份证" hint="" persistent-hint box></v-text-field></v-flex>
                  <v-flex xs12 sm6 class="pr-3"><v-text-field v-model="newCTRT.intermediatorTel" :rules="[rules.required]" mask="(+##)###-####-####" label="经纪人联系方式" hint="" persistent-hint box></v-text-field></v-flex>
                  <v-flex xs12 sm6 class="pr-3"><v-text-field v-model="newCTRT.agency" :rules="[rules.required]" label="经纪人公司" hint="" persistent-hint box></v-text-field></v-flex>
                </v-layout>
              </v-container>
              <v-btn color="primary" @click.native="stepNum++">下一节</v-btn>
            </v-stepper-content>
            <v-stepper-step :complete="stepNum > 2" step="2">
              添加租赁房屋及租赁信息
              <small>不同种类的房源将分别按不同方式计费，请在第四部分核对总金额</small>
            </v-stepper-step>
            <v-stepper-content step="2">
              <v-card color="grey lighten-1" class="mb-5" height="200px"></v-card>
              <v-btn color="primary" @click.native="stepNum++">下一节</v-btn>
              <v-btn flat @click.native="stepNum--">后退</v-btn>
            </v-stepper-content>
            <v-stepper-step :complete="stepNum > 3" step="3">
              完善合同信息
              <small>包括合同编号、租赁时长、添加免租等</small>
            </v-stepper-step>
            <v-stepper-content step="3">
              <v-card color="grey lighten-3" class="elevation-0 mb-3">
                <v-container grid-list-md>
                  <v-layout row wrap>
                    <v-flex xs12 sm6><v-text-field v-model="newCTRT.contractNo" mask="AAAA-########-####" label="合同编号" hint="例:ABCD-YYYYMMDD-1234 可由系统自动生成" persistent-hint box></v-text-field></v-flex>
                    <v-flex xs12 sm6><v-text-field v-model="newCTRT.contractName" :rules="[rules.required]" label="合同名称" hint="" persistent-hint box></v-text-field></v-flex>
                    <v-flex xs12 sm8><v-text-field v-model="newCTRT.contractAddress" :rules="[rules.required]" label="合同签署地址" hint="" persistent-hint box></v-text-field></v-flex>
                    <v-flex xs12 sm4>
                      <v-menu
                        :close-on-content-click="false" v-model="dateMenu.signingDate" offset-y lazy>
                        <v-text-field slot="activator" v-model="newCTRT.signingDate" :rules="[rules.required]" label="签订日期" hint="仅可选择上个月后的日期" persistent-hint box readonly></v-text-field>
                        <v-date-picker v-model="newCTRT.signingDate" :min="getDay(new Date(), -30)" :first-day-of-week="0" show-current locale="zh-cn" @input="dateMenu.signingDate = false"></v-date-picker>
                      </v-menu>
                    </v-flex>
                    <v-flex xs12 sm3>
                      <v-menu
                        :close-on-content-click="false" v-model="dateMenu.startDate" offset-y lazy>
                        <v-text-field slot="activator" v-model="newCTRT.startDate" :rules="[rules.required]" :disabled="!newCTRT.signingDate" label="记租开始日期" hint="" persistent-hint box readonly></v-text-field>
                        <v-date-picker v-model="newCTRT.startDate" :min="newCTRT.signingDate" :first-day-of-week="0" show-current locale="zh-cn" @input="dateMenu.startDate = false"></v-date-picker>
                      </v-menu>
                    </v-flex>
                    <v-flex xs12 sm3>
                      <v-menu :close-on-content-click="false" v-model="dateMenu.endDate" offset-y lazy>
                        <v-text-field slot="activator" v-model="newCTRT.endDate" :rules="[rules.required]" :disabled="!newCTRT.startDate" label="记租结束日期" hint="" persistent-hint box readonly></v-text-field>
                        <v-date-picker v-model="newCTRT.endDate" :min="newCTRT.startDate" :first-day-of-week="0" show-current locale="zh-cn" @input="dateMenu.endDate = false"></v-date-picker>
                      </v-menu>
                    </v-flex>
                    <v-flex xs12 sm3><v-text-field v-model="newCTRT.beforeFree" :rules="[rules.required]" mask="###" :disabled="!newCTRT.startDate" label="记租开始前免租(天)" :hint="beforeFreeHint" persistent-hint box></v-text-field></v-flex>
                    <v-flex xs12 sm3><v-text-field v-model="newCTRT.afterFree" :rules="[rules.required]" mask="###" :disabled="!newCTRT.endDate" label="记租结束后免租(天)" :hint="afterFreeHint" persistent-hint box></v-text-field></v-flex>
                    <v-flex xs12 sm3><v-text-field v-model="newCTRT.rentDate" :rules="[rules.required]" mask="###" label="租金缴纳应提前(天)" hint="" persistent-hint box></v-text-field></v-flex>
                    <v-flex xs12 sm3><v-text-field v-model="newCTRT.deposit" :rules="[rules.required]" mask="#########" label="押金(元)" hint="合同生效后既缴纳 合同到期后返还" persistent-hint box></v-text-field></v-flex>
                    <v-flex xs12 sm3><v-text-field v-model="newCTRT.month" :rules="[rules.required, rules.greaterThanZero]" mask="##" label="租金缴纳间隔(月)" :hint="`每${newCTRT.month}个月缴纳${1000*newCTRT.month}元`" persistent-hint box></v-text-field></v-flex>
                    <v-flex xs12 sm3><v-text-field v-model="newCTRT.liquidatedDamages" :rules="[rules.required]" mask="#########" label="违约金(元)" hint="" persistent-hint box></v-text-field></v-flex>
                  </v-layout>
                </v-container>
              </v-card>
              <v-btn color="primary" @click.native="stepNum++">下一节</v-btn>
              <v-btn flat @click.native="stepNum--">后退</v-btn>
            </v-stepper-content>
            <v-stepper-step step="4">
              请确认信息无误并提交申请
              <small>未通过的申请将出现在作废合同列表中供重新填写</small>
            </v-stepper-step>
            <v-stepper-content step="4">
              <v-card color="grey lighten-1" class="mb-5" height="200px"></v-card>
              <v-btn color="primary" @click.native="1">确认无误并提交</v-btn>
              <v-btn flat @click.native="stepNum--">后退</v-btn>
            </v-stepper-content>
          </v-stepper>
        </v-flex>
      </v-layout>
    </v-container>
  </transition>
</template>

<script>
import _ from "lodash";

export default {
  name: "contract-new",
  data: () => ({
    stepNum: 1,
    dateMenu: {
      signingDate: false,
      startDate: false,
      endDate: false
    },
    newCTRT: {
      // 甲方
      signedPersonA: "",
      partyA: "",
      // 承租方
      type: "company",
      companyName: "",
      businessLicense: "",
      legalPerson: "",
      signedPersonB: "",
      companyTel: "",
      companyIndustry: "",
      companyAddress: "",
      // 中介方
      hasIntermediator: false,
      intermediator: "",
      idCode: "",
      intermediatorTel: "",
      agency: "",
      // 合同信息
      contractNo: "",
      contractName: "",
      contractAddress: "",
      signingDate: "",
      startDate: "",
      endDate: "",
      beforeFree: 0,
      afterFree: 0,
      rentDate: 30,
      deposit: 0,
      month: 1,
      increaseRate: 1,
      liquidatedDamages: 0,
      house: [
        {
          houseId: 1,
          rent: 0,
          type: "房屋"
        }
      ]
    },
    rules: {
      required: val => !!String(val).length || "请填写此项",
      greaterThanZero: val => val > 0 || "此项需大于零",
      afterSigning: val =>
        Date(this.getDay(this.newCTRT.startDate, -1 * val)) >
          Date(this.newCTRT.signingDate) || "免租开始日期需晚于合同签订日期"
    }
  }),
  computed: {
    beforeFreeHint() {
      let startD = this.newCTRT.startDate;
      let beforeFree = this.newCTRT.beforeFree;
      let beforeD = this.getDay(startD, -1 * beforeFree);

      if (startD)
        return beforeFree == 0
          ? "记租开始前无免租"
          : `由 ${beforeD}开始<br/>至 ${this.getDay(startD, -1)}到期`;
      else return "";
    },
    afterFreeHint() {
      let endD = this.newCTRT.endDate;
      let afterFree = this.newCTRT.afterFree;
      let afterD = this.getDay(endD, afterFree);

      if (endD)
        return afterFree == 0
          ? "记租结束后无免租"
          : `由 ${this.getDay(endD, 1)}开始<br/>至 ${afterD}到期`;
      else return "";
    }
  },
  created() {
    this.$store.commit("changeToolBarTitle", "添加合同");
  },
  methods: {
    getDay(date, day) {
      let time = new Date(
        new Date(date).getTime() + parseInt(day) * 24 * 60 * 60 * 1000
      );
      return `${time.getFullYear()}-${_.padStart(
        time.getMonth() + 1,
        2,
        0
      )}-${_.padStart(time.getDate(), 2, 0)}`;
    }
  }
};
</script>

<style lang="stylus" scoped>
.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter, .slide-fade-leave-to {
  transform: translateX(100vw);
  // opacity 0
}

.contract-new {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  max-width: 100%;
  min-height: 100%;
  background: #eee;
  z-index: 1;

  .new-stepper {
    max-width: 800px;
    background: #eee;
  }
}
</style>
