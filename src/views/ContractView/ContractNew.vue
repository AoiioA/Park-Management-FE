<template>
  <transition name="slide-fade">
    <v-container class="contract-new">
      <v-layout align-start align-content-start justify-center wrap>
        <v-flex xs12 md10 xl8 class="headline">
          <v-btn flat icon @click="$router.go(-1)">
            <v-icon>close</v-icon>
          </v-btn>
          添加新的合同并提交审核
        </v-flex>
        <v-flex xs12 md10 lg8 xl6>
          <v-stepper v-model="stepNum" vertical class="elevation-0" style="max-width:800px">
            <v-stepper-step :complete="stepNum > 1" step="1">
              填写合同相关人
              <small>包含甲方、承租方、中介方信息</small>
            </v-stepper-step>
            <v-stepper-content step="1">
              <v-card color="grey lighten-1" class="mb-5" height="200px"></v-card>
              <v-btn color="primary" @click.native="stepNum++">下一节</v-btn>
            </v-stepper-content>
            <v-stepper-step :complete="stepNum > 2" step="2">
              添加租赁房屋
              <small>支持添加不同种类的房源</small>
            </v-stepper-step>
            <v-stepper-content step="2">
              <v-card color="grey lighten-1" class="mb-5" height="200px"></v-card>
              <v-btn color="primary" @click.native="stepNum++">下一节</v-btn>
              <v-btn flat @click.native="stepNum--">后退</v-btn>
            </v-stepper-content>
            <v-stepper-step :complete="stepNum > 3" step="3">
              完善其他租赁信息
              <small>租金年递增率、租赁时长、免租时长等</small>
            </v-stepper-step>
            <v-stepper-content step="3">
              <v-card color="grey lighten-1" class="mb-5" height="200px"></v-card>
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
    stepNum: 1
  })
};
</script>

<style lang="stylus" scoped>
.slide-fade-enter-active, .slide-fade-leave-active
  transition all .3s ease
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
  background #fff
  z-index 100
</style>
