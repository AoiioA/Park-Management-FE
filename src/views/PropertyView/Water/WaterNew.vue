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
                      <v-flex xs12 sm4>
                        <v-menu v-model="menu.companyMenu" offset-y nudge-top="20">
                          <v-text-field slot="activator" :rules="[$store.state.rules.required]" :value="selectedCompany.companyName" label="客户名称" :hint="selectedCompany.businessLicense" persistent-hint box required readonly></v-text-field>
                          <v-list style="max-height: 200px; overflow-y: auto;">
                            <v-list-tile v-for="(company, companyIndex) in companyList" :key="companyIndex" @click="selectedCompany = company;getContract(company.id)">
                              <v-list-tile-title>{{ company.companyName }}</v-list-tile-title>
                            </v-list-tile>
                          </v-list>
                        </v-menu>
                      </v-flex>
                      <v-flex xs12 sm4>
                        <v-menu :disabled="!selectedCompany.id" v-model="menu.contractMenu" offset-y nudge-top="20">
                          <v-text-field :disabled="!selectedCompany.id" slot="activator" :rules="[$store.state.rules.required]" :value="selectedContract.contractName" label="客户名称" :hint="selectedContract.contractNo" persistent-hint box required readonly></v-text-field>
                          <v-list style="max-height: 200px; overflow-y: auto;">
                            <v-list-tile v-for="(contract, contractIndex) in contractList" :key="contractIndex" @click="selectedContract = contract;">
                              <v-list-tile-title>{{ contract.contractName }}</v-list-tile-title>
                            </v-list-tile>
                          </v-list>
                        </v-menu>
                      </v-flex>
                      <v-flex xs12 sm4><v-text-field v-model="newWater.orientation" :rules="[$store.state.rules.required]" label="房源朝向" hint="" persistent-hint box required></v-text-field></v-flex>
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
    menu: {
      companyMenu: false,
      contractMenu: false
    },
    stepNum: 1,
    formValid: true,
    editWater: {},
    newWater: {
      orientation: ""
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
      ContractName: "",
      contractNo: ""
    },
    isSubmitWater: false,
    rules: {
      testFloorNumber: val =>
        !new RegExp(/[^(\-?)\d+]/gi).test(val) || "该项需为整数",
      lessThanHundred: val => val <= 100 || "该项需小于一百"
    }
  }),
  created() {
    this.$store.commit("changeToolBarTitle", { title: "水费管理" });
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
    }
  }
};
</script>
