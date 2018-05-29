<template>
  <transition name="slide-fade">
    <v-container class="contract-detail px-2">
      <v-layout align-start align-content-start justify-center wrap>
        <v-flex xs12 md10 lg8>
          <v-toolbar dense flat>
            <v-toolbar-side-icon @click="$router.push({})">
              <v-icon>close</v-icon>
            </v-toolbar-side-icon>
            <v-toolbar-title>合同详情</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
        </v-flex>
        <v-progress-circular indeterminate color="primary" v-if="networkLoading" class="center-box"></v-progress-circular>
        <v-alert v-else-if="networkError" :value="true" type="error" class="center-box">网络出现异常 - 检查网络后刷新重试</v-alert>
        <v-flex xs12 md10 lg8 v-else>
          <v-jumbotron height="auto">
            <v-container grid-list-lg fill-height>
              <v-layout wrap>
                <!-- <v-flex xs12 md12 class="subheading grey--text text--darken-1">合同明细</v-flex> -->
                <v-flex xs12 md4>
                  <v-subheader>出租方</v-subheader>
                  <v-card>
                    <v-card-title><h4>{{ CTRTInfo.partyA }}</h4></v-card-title>
                    <v-divider></v-divider>
                    <v-list dense style="height: 248px;overflow: auto;">
                      <v-list-tile>
                        <v-list-tile-content>签订人:</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{ CTRTInfo.signedPersonA }}</v-list-tile-content>
                      </v-list-tile>
                    </v-list>
                  </v-card>
                </v-flex>
                <v-flex xs12 md4>
                  <v-subheader>租赁方</v-subheader>
                  <v-card>
                    <v-card-title><h4>{{ CTRTInfo.companyName }}</h4></v-card-title>
                    <v-divider></v-divider>
                    <v-list dense style="height: 248px;overflow: auto;">
                      <v-list-tile>
                        <v-list-tile-content>签订人:</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{ CTRTInfo.signedPersonB }}</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content>所属行业:</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{ CTRTInfo.companyIndustry }}</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content>营业执照:</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{ CTRTInfo.businessLicense }}</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content>公司法人:</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{ CTRTInfo.legalPerson }}</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content>联系方式:</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{ CTRTInfo.companyTel }}</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content>通讯地址:</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{ CTRTInfo.address }}</v-list-tile-content>
                      </v-list-tile>
                    </v-list>
                  </v-card>
                </v-flex>
                <v-flex xs12 md4>
                  <v-subheader>中介方</v-subheader>
                  <v-card>
                    <v-card-title><h4>{{ CTRTInfo.agency }}</h4></v-card-title>
                    <v-divider></v-divider>
                    <v-list dense style="height: 248px;overflow: auto;">
                      <v-list-tile>
                        <v-list-tile-content>姓名:</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{ CTRTInfo.intermediatorName }}</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content>身份证:</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{ CTRTInfo.idCode }}</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content>联系方式:</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{ CTRTInfo.intermediatorTel }}</v-list-tile-content>
                      </v-list-tile>
                    </v-list>
                  </v-card>
                </v-flex>
                <v-flex xs12 md6>
                  <v-subheader>合同信息</v-subheader>
                  <v-card>
                    <v-card-title><h4>{{ CTRTInfo.contractName }}</h4></v-card-title>
                    <v-divider></v-divider>
                    <v-list dense style="height: 208px;overflow: auto;">
                      <v-list-tile>
                        <v-list-tile-content>编号:</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{ CTRTInfo.contractNo }}</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content>签署地址:</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{ CTRTInfo.address }}</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content>签订日期:</v-list-tile-content>
                        <v-list-tile-content v-if="CTRTInfo.signingDate" class="align-end">{{ CTRTInfo.signingDate.slice(0, 10) }}</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content>记租开始日期:</v-list-tile-content>
                        <v-list-tile-content v-if="CTRTInfo.startDate" class="align-end">{{ CTRTInfo.startDate.slice(0, 10) }}</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content>记租结束日期:</v-list-tile-content>
                        <v-list-tile-content v-if="CTRTInfo.endDate" class="align-end">{{ CTRTInfo.endDate.slice(0, 10) }}</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content>记租前免租:</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{ CTRTInfo.beforeFree }}天</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content>记租后免租:</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{ CTRTInfo.afterFree }}天</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content>押金:</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{ CTRTInfo.deposit }}元</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content>违约金:</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{ CTRTInfo.liquidatedDamages }}元</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content>租金缴纳间隔:</v-list-tile-content>
                        <v-list-tile-content class="align-end">每{{ CTRTInfo.month }}个月</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content>年递增率:</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{ 100 * CTRTInfo.houseAndBuildingDtos[0].increaseRate }}%</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content>年递增率基数:</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{ ['首年租金', '上一年租金'][CTRTInfo.houseAndBuildingDtos[0].increaseType] }}</v-list-tile-content>
                      </v-list-tile>
                    </v-list>
                  </v-card>
                </v-flex>
                <v-flex xs12 md6>
                  <v-subheader>租赁资产</v-subheader>
                  <v-card>
                    <v-list dense style="height: 262px;overflow: auto;">
                      <v-list-tile v-for="(house, houseIndex) in CTRTInfo.houseAndBuildingDtos" :key="houseIndex" avatar ripple @click="$router.push({ path: '/house/house-detail', query: { detailId: house.id } })">
                        <v-list-tile-content>
                          <v-list-tile-title>{{ `${house.parkName} - ${house.buildingName}` }}</v-list-tile-title>
                          <v-list-tile-sub-title>{{`${house.floorNumber}层 ${house.doorNumber}室`}}</v-list-tile-sub-title>
                        </v-list-tile-content>
                        <v-list-tile-action>
                          <v-list-tile-action-text>总面积 : {{ house.buildArea }}m²</v-list-tile-action-text>
                          <v-list-tile-action-text>月租金 : {{ house.rent }}元</v-list-tile-action-text>
                        </v-list-tile-action>
                      </v-list-tile>
                    </v-list>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container>
          </v-jumbotron>
          <v-jumbotron height="auto">
            <v-container grid-list-lg fill-height>
              <v-layout align-start align-content-start justify-center wrap>
                <!-- <v-flex xs12 md12 class="subheading grey--text text--darken-1">租金明细</v-flex> -->
                <v-flex xs12 md12>
                  <v-subheader>租金缴纳明细</v-subheader>
                  <v-data-table
                    :headers="rentHeaders"
                    :items="CTRTInfo.contractRentTotalDto.contractRentDetailDtoList"
                    item-key="payDay"
                    class="elevation-1 mb-5"
                  >
                    <template slot="items" slot-scope="props">
                      <!-- <tr @click="props.expanded = !props.expanded"> -->
                      <td v-if="props.item.fromDate">{{ props.item.fromDate.slice(0, 10) }}</td>
                      <td v-if="props.item.endDate">{{ props.item.endDate.slice(0, 10) }}</td>
                      <td v-if="props.item.payDay">{{ props.item.payDay.slice(0, 10) }}</td>
                      <td>{{ props.item.total }}元</td>
                      <!-- </tr> -->
                    </template>
                    <!-- <template slot="expand" slot-scope="props">
                      <v-card flat>
                        <v-card-text>Peek-a-boo!</v-card-text>
                      </v-card>
                    </template> -->
                  </v-data-table>
                </v-flex>
              </v-layout>
            </v-container>
          </v-jumbotron>
          <v-speed-dial v-model="dialog.fab" fixed bottom right>
            <v-tooltip left slot="activator">
              <v-btn slot="activator" v-model="dialog.fab" fab dark color="primary">
                <v-icon>add</v-icon>
                <v-icon>close</v-icon>
              </v-btn>
              <span>展开操作</span>
            </v-tooltip>
            <v-dialog v-if="$route.query.detailType=='fulfilling'" v-model="dialog.invalidatedDialog" persistent max-width="480">
              <v-tooltip left slot="activator">
                <v-btn slot="activator" fab small dark color="pink">
                  <v-icon>delete_sweep</v-icon>
                </v-btn>
                <span>作废</span>
              </v-tooltip>
              <v-card>
                <v-card-title class="headline">即将进行作废处理</v-card-title>
                <v-form ref="invalidatedForm" v-model="formValid.invalidatedValid" lazy-validation>
                  <v-divider></v-divider>
                  <v-text-field
                    v-model="invalidatedInfo"
                    :rules="[$store.state.rules.required, val => String(val).length < 240 || '此项不能超过240字']"
                    label="作废理由"
                    counter="240"
                    full-width
                    multi-line
                    single-line
                    required
                  ></v-text-field>
                  <v-divider></v-divider>
                </v-form>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn @click.native="closeInvalidated" flat>取消操作</v-btn>
                  <v-btn :disabled="!formValid.invalidatedValid" @click.native="saveInvalidated" color="error" depressed>确认作废</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-if="$route.query.detailType=='fulfilling'" v-model="dialog.refundDialog" persistent max-width="480">
              <v-tooltip left slot="activator">
                <v-btn slot="activator" fab small dark color="pink">
                  <v-icon>money_off</v-icon>
                </v-btn>
                <span>退租</span>
              </v-tooltip>
              <v-card>
                <v-card-title class="headline">即将进行退租处理</v-card-title>
                <v-form ref="refundForm" v-model="formValid.refundValid" lazy-validation>
                  <v-divider></v-divider>
                  <v-text-field
                    v-model="refundInfo"
                    :rules="[$store.state.rules.required, val => String(val).length < 240 || '此项不能超过240字']"
                    label="退租理由"
                    counter="240"
                    full-width
                    multi-line
                    single-line
                    required
                  ></v-text-field>
                  <v-divider></v-divider>
                </v-form>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn @click.native="closeRefund" flat>取消操作</v-btn>
                  <v-btn :disabled="!formValid.refundValid" @click.native="saveRefund" color="error" depressed>确认退租</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-if="$route.query.detailType=='submitted'" v-model="dialog.examineDialog" persistent max-width="480">
              <v-tooltip left slot="activator">
                <v-btn slot="activator" fab small dark color="pink">
                  <v-icon>how_to_reg</v-icon>
                </v-btn>
                <span>审核</span>
              </v-tooltip>
              <v-card>
                <v-card-title class="headline">提交审核结果</v-card-title>
                <v-form ref="examineForm" v-model="formValid.examineValid" lazy-validation>
                  <v-divider></v-divider>
                  <v-text-field
                    v-model="examineInfo.reason"
                    :rules="[$store.state.rules.required, val => String(val).length < 240 || '此项不能超过240字']"
                    label="审核理由"
                    counter="240"
                    full-width
                    multi-line
                    single-line
                    required
                  ></v-text-field>
                  <v-select
                    v-model="examineInfo.result"
                    :items="examineSelect"
                    item-text="text"
                    item-value="value"
                    :rules="[$store.state.rules.required]"
                    overflow
                    label="审核结果"
                    required
                  ></v-select>
                </v-form>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn @click.native="closeExamine" flat>取消操作</v-btn>
                  <v-btn :disabled="!formValid.examineValid" @click.native="saveExamine" color="primary" depressed>提交审核</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-tooltip left v-if="$route.query.detailType=='editing'">
              <v-btn slot="activator" fab small dark color="pink" @click="$router.push({ query: { newType: 'editing', renewId: CTRTInfo.id } })">
                <v-icon>edit</v-icon>
              </v-btn>
              <span>编辑</span>
            </v-tooltip>
            <v-tooltip left v-if="$route.query.detailType=='fulfilling'">
              <v-btn slot="activator" fab small dark color="pink" @click="$router.push({ query: { newType: $route.query.detailType, renewId: CTRTInfo.id } })">
                <v-icon>edit</v-icon>
              </v-btn>
              <span>续签</span>
            </v-tooltip>
          </v-speed-dial>
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
    networkLoading: false,
    networkError: null,
    CTRTInfoURL: {
      submitted: { name: "待审核", to: "contractSub/queryOne" },
      "new-success": { name: "新增过审", to: "contractSub/queryOne" },
      "renew-success": { name: "续签过审", to: "contractSub/queryOne" },
      failed: { name: "未过审", to: "contractSub/queryOne" },
      editing: { name: "待提交", to: "contractSub/queryOne" },
      fulfilling: { name: "生效中", to: "contract/view" },
      invalidated: { name: "已作废", to: "contract/viewCancelContract" },
      refunded: { name: "已退租", to: "contract/viewThrowALease" },
      expired: { name: "已到期", to: "contract/view" }
    },
    dialog: {
      fab: false,
      examineDialog: false,
      refundDialog: false,
      invalidatedDialog: false
    },
    formValid: {
      examineValid: false,
      refundValid: false,
      invalidatedValid: false
    },
    CTRTInfo: {},
    rentHeaders: [
      { text: "待缴起始日期", value: "fromDate", sortable: false },
      { text: "待缴结束日期", value: "endDate", sortable: false },
      { text: "缴纳截至日期", value: "payDay", sortable: false },
      { text: "待缴租金", value: "total", sortable: false }
    ],
    invalidatedInfo: "",
    refundInfo: "",
    examineInfo: {
      reason: "",
      result: ""
    },
    defaultExamine: {
      reason: "",
      result: ""
    },
    examineSelect: [
      {
        text: "通过",
        value: 0
      },
      {
        text: "驳回",
        value: 1
      }
    ]
  }),
  created() {
    this.initialize();
  },
  methods: {
    initialize() {
      this.networkLoading = true;
      this.networkError = null;
      this.$http
        .get(`/cms/${this.CTRTInfoURL[this.$route.query.detailType].to}.json`, {
          params: {
            id: this.$route.query.detailId
          }
        })
        .then(res => {
          this.networkLoading = false;
          let resData = res.data.data;
          this.CTRTInfo = resData;
          console.log(this.CTRTInfo);
        })
        .catch(err => {
          this.networkLoading = false;
          this.networkError = err;
          this.addSnackBar("合同详情查询失败 请检查网络后刷新", "error");
        });
    },
    closeInvalidated() {
      this.dialog.invalidatedDialog = false;
      setTimeout(() => {
        this.invalidatedInfo = Object.assign({}, this.defaultInvalidated);
        this.$refs.invalidatedForm.reset();
      }, 300);
    },
    saveInvalidated() {
      if (this.$refs.invalidatedForm.validate()) {
        this.$http
          .post("/cms/contract/cancel.json", {
            id: this.CTRTInfo.id,
            reason: this.invalidatedInfo
          })
          .then(res => {
            if (res.data.code == 0) {
              this.addSnackBar("合同已作废成功", "success");
              this.closeInvalidated();
              this.$router.push({});
            } else {
              this.addSnackBar(`合同作废错误: ${res.data.meg}`, "error");
            }
          })
          .catch(() =>
            this.addSnackBar("合同作废出现错误 请检查网络后重试", "error")
          );
      }
    },
    closeRefund() {
      this.dialog.refundDialog = false;
      setTimeout(() => {
        this.refundInfo = Object.assign({}, this.defaultRefund);
        this.$refs.refundForm.reset();
      }, 300);
    },
    saveRefund() {
      if (this.$refs.refundForm.validate()) {
        this.$http
          .post("/cms/contract/throwALease.json", {
            id: this.CTRTInfo.id,
            reason: this.refundInfo
          })
          .then(res => {
            if (res.data.code == 0) {
              this.addSnackBar("合同已退租成功", "success");
              this.closeRefund();
              this.$router.push({});
            } else {
              this.addSnackBar(`合同退租错误: ${res.data.meg}`, "error");
            }
          })
          .catch(() =>
            this.addSnackBar("合同退租出现错误 请检查网络后重试", "error")
          );
      }
    },
    closeExamine() {
      this.dialog.examineDialog = false;
      setTimeout(() => {
        this.examineInfo = Object.assign({}, this.defaultExamine);
        this.$refs.examineForm.reset();
      }, 300);
    },
    saveExamine() {
      if (this.$refs.examineForm.validate()) {
        this.$http
          .post("/cms/contractSub/checkContract.json", {
            id: this.CTRTInfo.id,
            contractState: ["审核通过", "审核未通过"][this.examineInfo.result],
            reason: this.examineInfo.reason
          })
          .then(res => {
            if (res.data.code == 0) {
              this.addSnackBar("合同已审核成功", "success");
              this.closeExamine();
              this.$router.push({});
            } else {
              this.addSnackBar(`合同审核错误: ${res.data.meg}`, "error");
            }
          })
          .catch(() =>
            this.addSnackBar("合同审核出现错误 请检查网络后重试", "error")
          );
      }
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
  background: #f5f5f5;
  z-index: 1;

  .center-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
