<template>
  <transition name="slide-fade">
    <v-container class="contract-detail px-2">
      <v-layout align-start align-content-start justify-center wrap>
        <v-flex xs12 md10 lg8 class="headline">
          <v-btn flat icon @click="$router.go(-1)">
            <v-icon>close</v-icon>
          </v-btn>
          合同详情
        </v-flex>
        <v-flex xs12 md10 lg8>
          <v-jumbotron height="auto">
            <v-container grid-list-lg fill-height>
              <v-layout wrap>
                <v-flex xs12 md12 tag="h1" class="title grey--text text--darken-1">合同相关人</v-flex>
                <v-flex xs12 md4>
                  <v-card>
                    <v-container>
                      <div class="title">This is a contract-detail card</div>
                      <div>This is a contract-detail card</div>
                    </v-container>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container>
          </v-jumbotron>
          <v-jumbotron height="auto">
            <v-container grid-list-lg fill-height>
              <v-layout align-start align-content-start justify-center wrap>
                <v-flex xs12 md12 tag="h1" class="title grey--text text--darken-1">租赁资产</v-flex>
                <v-flex xs12 md12>
                  <v-card>
                    <v-container>
                      <div>This is a contract-detail card</div>
                    </v-container>
                  </v-card>
                </v-flex>
                <v-flex xs12 md12>
                  <v-card>
                    <v-container>
                      <div>This is a contract-detail card</div>
                    </v-container>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container>
          </v-jumbotron>
          <v-jumbotron height="auto">
            <v-container grid-list-lg fill-height>
              <v-layout align-start align-content-start justify-center wrap>
                <v-flex xs12 md12 tag="h1" class="title grey--text text--darken-1">合同信息</v-flex>
                <v-flex xs12 md12>
                  <v-card>
                    <v-container>
                      <div>This is a contract-detail card</div>
                    </v-container>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container>
          </v-jumbotron>
        </v-flex>
      </v-layout>
    </v-container>
  </transition>
</template>

<script>
// import _ from "lodash";

export default {
  name: "contract-detail",
  data: () => ({
    CTRTInfo: {
      // 甲方
      signedPersonA: "",
      partyA: "",
      // 承租方
      customerType: "企业",
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
      address: "",
      signingDate: "",
      startDate: "",
      endDate: "",
      beforeFree: 0,
      afterFree: 0,
      // rentDate: 30,
      deposit: 0,
      month: 1,
      liquidatedDamages: 0
    }
  }),
  created() {
    this.initialize();
  },
  methods: {
    initialize() {
      this.$http
        .post("/cms/contract/view.json", {
          contractId: this.$route.query.detailId
        })
        .then(res => {
          let resData = res.data.data;
          resData = resData && resData.length ? resData[1] : {};
          this.CTRTInfo = resData;
          console.log(this.CTRTInfo);
        })
        .catch(() =>
          this.addSnackBar("合同详情查询失败 请检查网络后刷新", "error")
        );
    },
    addSnackBar(text, type) {
      this.$store.commit("addSnackBar", text, type);
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

.contract-detail {
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
