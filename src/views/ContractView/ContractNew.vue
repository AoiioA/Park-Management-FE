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
              <v-card color="grey lighten-3" class="elevation-0 mb-3">
                <v-flex xs12 sm6>
                  <v-radio-group v-model="newCTRT.lesseeType" label="承租方类型" hint="支持与个人承租方签订" persistent-hint row class="px-3 py-0">
                    <v-radio label="公司" value="company"></v-radio>
                    <v-radio label="个人" value="personal"></v-radio>
                  </v-radio-group>
                </v-flex>
                <v-container grid-list-md>
                  <v-layout row wrap v-if="newCTRT.lesseeType=='company'">
                    <v-flex xs12 sm4><v-text-field label="公司名称" hint="公司名称" persistent-hint box></v-text-field></v-flex>
                    <v-flex xs12 sm4><v-text-field label="营业执照" hint="营业执照" persistent-hint box></v-text-field></v-flex>
                    <v-flex xs12 sm4><v-text-field label="公司法人" hint="公司法人" persistent-hint box></v-text-field></v-flex>
                  </v-layout>
                  <v-layout row wrap>
                    <v-flex xs12 sm4><v-text-field label="签订人" hint="签订人" persistent-hint box></v-text-field></v-flex>
                    <v-flex xs12 sm4><v-text-field label="联系方式" hint="联系方式" persistent-hint box></v-text-field></v-flex>
                    <v-flex xs12 sm4><v-text-field label="所属行业" hint="所属行业" persistent-hint box></v-text-field></v-flex>
                    <v-flex xs12 sm6><v-text-field label="通讯地址" hint="通讯地址" persistent-hint box></v-text-field></v-flex>
                    <v-flex xs12 sm6><v-text-field label="合同签署地址" hint="合同签署地址" persistent-hint box></v-text-field></v-flex>
                    <!-- <v-flex xs12>
                      <v-text-field
                        :rules="emailRules"
                        v-model="email"
                        box
                        label="Email address"
                        hint="Enter your email!"
                        persistent-hint
                      ></v-text-field>
                    </v-flex> -->
                  </v-layout>
                </v-container>
              </v-card>
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
                    <v-flex xs12><v-text-field label="合同编号" hint="可不填写 系统将自动生成" persistent-hint box></v-text-field></v-flex>
                    <v-flex xs12 sm4>
                      <v-menu
                        :close-on-content-click="false" v-model="dateMenu.signDate" offset-y lazy>
                        <v-text-field slot="activator" v-model="newCTRT.signDate" label="签订日期" hint="合同签订日期" persistent-hint box readonly></v-text-field>
                        <v-date-picker v-model="newCTRT.signDate" :first-day-of-week="0" show-current locale="zh-cn" @input="dateMenu.signDate = false"></v-date-picker>
                      </v-menu>
                    </v-flex>
                    <v-flex xs12 sm4><v-text-field label="记租日期" hint="合同记租日期" persistent-hint box></v-text-field></v-flex>
                    <v-flex xs12 sm4><v-text-field label="到期日期" hint="合同到期日期" persistent-hint box></v-text-field></v-flex>
                    <v-flex xs12 sm4><v-text-field label="记租前免租天数" hint="合同记租前免租天数" persistent-hint box></v-text-field></v-flex>
                    <v-flex xs12 sm4><v-text-field label="到期前免租天数" hint="合同到期前免租天数" persistent-hint box></v-text-field></v-flex>
                    <v-flex xs12 sm4><v-text-field label="提前付款天数" hint="提前付款天数" persistent-hint box></v-text-field></v-flex>
                    <v-flex xs12><v-text-field label="支付方式" hint="支付方式" persistent-hint box></v-text-field></v-flex>
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
export default {
  name: "contract-new",
  data: () => ({
    stepNum: 1,
    dateMenu: {
      signDate: false
    },
    newCTRT: {
      lesseeType: "company",
      signDate: ""
    },
    first: "",
    last: ""
    // email: "",
    // emailRules: [
    //   v => {
    //     return !!v || "E-mail is required";
    //   },
    //   v =>
    //     /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
    //     "E-mail must be valid"
    // ]
  })
};
</script>

<style lang="stylus" scoped>
.slide-fade-enter-active, .slide-fade-leave-active
  transition all 0.3s ease
.slide-fade-enter, .slide-fade-leave-to
  transform translateX(100vw)
  // opacity 0

.contract-new
  position absolute
  top 0
  left 0
  width 100%
  max-width 100%
  min-height 100%
  background #eee
  z-index 1
  .new-stepper
    max-width 800px
    background #eee
</style>
