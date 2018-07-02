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
              <v-stepper-step :rules="[() => !!formValid]" :complete="stepNum>1" step="1">
                编辑水费总单
              </v-stepper-step>
              <v-stepper-content step="1">
                <v-form ref="waterForm" v-model="formValid" lazy-validation>
                  <v-container grid-list-md>
                    <v-subheader>建筑信息</v-subheader>
                    <v-layout row wrap>
                      <v-flex xs12 sm3><v-text-field v-model="newWater.orientation" :rules="[$store.state.rules.required]" label="房源朝向" hint="" persistent-hint box required></v-text-field></v-flex>
                    </v-layout>
                    <v-divider class="my-3"></v-divider>
                  </v-container>
                  <v-btn :disabled="!formValid" @click.native="submitWater()" color="primary" depressed>确认无误并提交</v-btn>
                </v-form>
              </v-stepper-content>
              <v-stepper-step :complete="isSubmitWater" step="2">
                上传房屋照片
              </v-stepper-step>
              <v-stepper-content step="2">
                <v-btn color="primary" depressed>确认无误并提交</v-btn>
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
    menu: {},
    stepNum: 1,
    formValid: true,
    editWater: {},
    newWater: {
			orientation: ""
		},
    rules: {
      testFloorNumber: val =>
        !new RegExp(/[^(\-?)\d+]/gi).test(val) || "该项需为整数",
      lessThanHundred: val => val <= 100 || "该项需小于一百"
    },
    isSubmitWater: false
  }),
  created() {
    this.$store.commit("changeToolBarTitle", { title: "水费管理" });
    this.initialize();
  },
  methods: {
    initialize() {
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
    submitWater() {
      // console.log(this.newWater);
      if (this.$refs.waterForm.validate()) {
        // let submitUrl = "/cms/waterInfo/addWaterInfo.json";
        // let submitData = Object.assign(
        //   { buildingNo: this.assetsOfNewWater.buildingNo },
        //   this.newWater
        // );
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
        // this.$http
        //   .post(submitUrl, submitData)
        //   .then(res => {
        //     if (res.data.code != 500) {
        //       if (this.editWater.resourceStatus !== 0) {
        //         Object.assign(this.editWater, this.newWater);
        //         this.editWater.waterNo = res.data.data.waterNo;
        //       }
        //       this.$store.commit("addSnackBar", "水费账单添加成功", "success");
              this.stepNum++;
              // this.getWaterImage();
          //   } else {
          //     this.$store.commit(
          //       "addSnackBar",
          //       `水费账单添加失败 ${res.data.msg}`,
          //       "error"
          //     );
          //   }
          // })
          // .catch(err =>
          //   this.$store.commit("addSnackBar", `水费账单添加失败: ${err}`, "error")
          // );
      }
    },
  }
};
</script>
