<template>
  <transition name="slide-fade">
    <v-container class="contract-detail px-2">
      <v-layout align-start align-content-start justify-center wrap>
        <v-flex xs12 md10 lg8>
          <v-toolbar dense flat color="blue-grey lighten-5">
            <v-toolbar-side-icon @click="$router.go(-1)">
              <v-icon>close</v-icon>
            </v-toolbar-side-icon>
            <v-toolbar-title>{{ `${CTRTInfo.contractName?CTRTInfo.contractName:"合同详情"}` }}<br /><small>{{ CTRTInfoURL[$route.query.contractType].name }}</small></v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
        </v-flex>
        <v-progress-circular indeterminate color="primary" v-if="networkLoading" class="center-box"></v-progress-circular>
        <v-alert v-else-if="networkError" :value="true" type="error" class="center-box">网络出现异常 - 检查网络后刷新重试</v-alert>
        <v-flex xs12 md10 lg8 v-else>
          <v-jumbotron height="auto">
            <v-container grid-list-xl fill-height>
              <v-layout wrap>
                <!-- <v-flex xs12 md12 class="subheading grey--text text--darken-1">合同明细</v-flex> -->
                <v-flex xs12 md6>
                  <v-subheader>出租方</v-subheader>
                  <v-card>
                    <v-card-title><h4>{{ CTRTInfo.partyA }}</h4></v-card-title>
                    <v-divider></v-divider>
                    <v-list dense style="height: 248px;">
                      <v-list-tile>
                        <v-list-tile-content>出租方签订人:</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{ CTRTInfo.signedPersonA }}</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content>经纪公司:</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{ CTRTInfo.agency || "无" }}</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content>经纪人姓名:</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{ CTRTInfo.intermediatorName || "无" }}</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content>经纪人身份证:</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{ CTRTInfo.idCode || "无" }}</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content>经纪人联系方式:</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{ CTRTInfo.intermediatorTel || "无" }}</v-list-tile-content>
                      </v-list-tile>
                    </v-list>
                  </v-card>
                </v-flex>
                <v-flex xs12 md6>
                  <v-subheader>租赁方</v-subheader>
                  <v-card>
                    <v-card-title><h4>{{ CTRTInfo.companyName }}</h4></v-card-title>
                    <v-divider></v-divider>
                    <v-list dense style="height: 248px;">
                      <v-list-tile>
                        <v-list-tile-content>租赁方签订人:</v-list-tile-content>
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
                <v-flex xs12 md6>
                  <v-subheader>合同信息</v-subheader>
                  <v-card>
                    <v-card-title><h4>{{ CTRTInfo.contractName }}</h4></v-card-title>
                    <v-divider></v-divider>
                    <v-list dense style="height: 248px;overflow: auto;">
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
                      <!-- <v-list-tile>
                        <v-list-tile-content>押金:</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{ CTRTInfo.deposit }}元</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content>违约金:</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{ CTRTInfo.liquidatedDamages }}元</v-list-tile-content>
                      </v-list-tile> -->
                      <v-list-tile>
                        <v-list-tile-content>租金缴纳周期:</v-list-tile-content>
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
                    <v-card-title><h4 v-if="CTRTInfo.houseAndBuildingDtos">{{ CTRTInfo.houseAndBuildingDtos.length }} 处资源</h4></v-card-title>
                    <v-divider></v-divider>
                    <v-list dense style="height: 248px;overflow: auto;">
                      <v-list-tile v-for="(house, houseIndex) in CTRTInfo.houseAndBuildingDtos" :key="houseIndex" avatar ripple>
                        <v-list-tile-content>
                          <v-list-tile-title>{{ `${house.parkName||'无归属楼宇'} - ${house.buildingName}` }}</v-list-tile-title>
                          <v-list-tile-sub-title>{{ `${((n)=>{return n>=0?n:'地下'+Math.abs(n)})(house.floorNumber)}层 ${house.doorNumber}室` }}</v-list-tile-sub-title>
                        </v-list-tile-content>
                        <v-list-tile-action>
                          <v-list-tile-action-text>{{ house.buildArea }}m²</v-list-tile-action-text>
                          <v-list-tile-action-text>{{ house.rent.toFixed(2) }}元/m²·天</v-list-tile-action-text>
                        </v-list-tile-action>
                      </v-list-tile>
                    </v-list>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container>
          </v-jumbotron>
          <v-jumbotron height="auto" v-if="CTRTInfo.contractRentTotalDto">
            <v-container grid-list-xl fill-height>
              <v-layout align-start align-content-start justify-center wrap>
                <v-flex xs12 md12>
                  <v-subheader>金额明细</v-subheader>
                  <v-data-table
                    :headers="rentPreHeaders"
                    :items="CTRTInfo.contractRentTotalDto.contractRentDetailDtoList"
                    item-key="payDay"
                    no-data-text="暂无租金明细"
                    class="elevation-1 mb-5"
                  >
                    <template slot="items" slot-scope="props">
                      <!-- <tr @click="props.expanded = !props.expanded"> -->
                      <td v-if="props.item.payDay">{{ props.item.payDay.slice(0, 10) }}</td>
                      <td v-if="props.item.fromDate">{{ props.item.fromDate.slice(0, 10) }}</td>
                      <td v-if="props.item.endDate">{{ props.item.endDate.slice(0, 10) }}</td>
                      <td>{{ props.item.houseTotal }}元</td>
                      <td>{{ props.item.propertyFees }}元</td>
                      <!-- </tr> -->
                    </template>
                    <!-- <template slot="expand" slot-scope="props">
                      <v-card flat>
                        <v-card-text>Peek-a-boo!</v-card-text>
                      </v-card>
                    </template> -->
                    <template slot="footer">
                      <td colspan="100%">
                        <small v-if="CTRTInfo.contractRentTotalDto.contractRentDetailDtoList">租金总计 : {{ CTRTInfo.contractRentTotalDto.contractRentDetailDtoList.map(el=>el.houseTotal).reduce((all, el, i) => parseFloat(all) + parseFloat(el)).toFixed(0) }}元</small>
                        &nbsp;&nbsp;<small>物业费总计 : {{ CTRTInfo.contractRentTotalDto.propertyFeeTotal }}元</small>
                        &nbsp;&nbsp;<small>押金 : {{ CTRTInfo.contractRentTotalDto.deposit }}元</small>
                        &nbsp;&nbsp;<small>违约金 : {{ CTRTInfo.contractRentTotalDto.liquidatedDamages }}元</small>
                      </td>
                    </template>
                  </v-data-table>
                </v-flex>
              </v-layout>
            </v-container>
          </v-jumbotron>
          <v-jumbotron height="auto" v-if="CTRTInfo.rentBillListDtos">
            <v-container grid-list-xl fill-height>
              <v-layout align-start align-content-start justify-center wrap>
                <v-flex xs12 md12>
                  <v-subheader>所含交易明细</v-subheader>
                  <v-data-table
                    :headers="rentHeaders"
                    :items="CTRTInfo.rentBillListDtos"
                    item-key="id"
                    no-data-text="暂无交易明细"
                    class="elevation-1 mb-5"
                  >
                    <template slot="items" slot-scope="props">
                      <!-- <tr @click="props.expanded = !props.expanded"> -->
                      <td v-if="props.item.rentType">{{ props.item.rentType }}</td>
                      <td v-if="props.item.payDate">{{ props.item.payDate.slice(0, 10) }}</td>
                      <td v-if="props.item.fromDate">{{ props.item.fromDate.slice(0, 10) }}</td>
                      <td v-if="props.item.endDate">{{ props.item.endDate.slice(0, 10) }}</td>
                      <td>{{ props.item.totalRent }}元</td>
                      <td>{{ props.item.state }}</td>
                      <!-- </tr> -->
                    </template>
                    <!-- <template slot="expand" slot-scope="props">
                      <v-card flat>
                        <v-card-text>Peek-a-boo!</v-card-text>
                      </v-card>
                    </template> -->
                    <template slot="footer">
                      <td colspan="100%" class="text-xs-right">
                        <span v-if="CTRTInfo.rentBillListDtos">金额总计 : {{ CTRTInfo.rentBillListDtos.map(el=>el.totalRent).reduce((all, el, i) => parseFloat(all) + parseFloat(el)) }}元</span>
                      </td>
                    </template>
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
            <v-tooltip left v-if="['editing', 'failed'].indexOf($route.query.contractType)>=0">
              <v-btn slot="activator" fab small dark color="pink" @click="$router.push({ name: 'contract-new', query: { newType: 'editing', renewId: CTRTInfo.id, exId: CTRTInfo.exContractNo } })">
                <v-icon>edit</v-icon>
              </v-btn>
              <span>编辑</span>
            </v-tooltip>
            <v-tooltip left v-if="['fulfilling'].indexOf($route.query.contractType)>=0">
              <v-btn slot="activator" fab small dark color="pink" @click="$router.push({ name: 'contract-new', query: { newType: $route.query.contractType, exId: CTRTInfo.id } })">
                <v-icon>edit</v-icon>
              </v-btn>
              <span>续签</span>
            </v-tooltip>
            <v-dialog v-if="['fulfilling'].indexOf($route.query.contractType)>=0" v-model="dialog.changedDialog" persistent max-width="480">
              <v-tooltip left slot="activator">
                <v-btn slot="activator" fab small dark color="pink">
                  <v-icon>delete_sweep</v-icon>
                </v-btn>
                <span>变更</span>
              </v-tooltip>
              <v-card>
                <v-card-title class="headline">即将提交变更申请</v-card-title>
                <v-form ref="changedForm" v-model="formValid.changedValid" lazy-validation>
                  <v-divider></v-divider>
                  <v-dialog v-model="changedInfo.modal" lazy full-width width="290px">
                    <v-text-field slot="activator" v-model="changedInfo.cancelDate" :rules="[$store.state.rules.required]" label="变更时间" hide-details solo flat single-line required readonly></v-text-field>
                    <v-date-picker v-model="changedInfo.cancelDate" :min="getDay(new Date(), 0)" :max="getDay(CTRTInfo.endDate, -1)" :first-day-of-week="0" show-current locale="zh-cn" @input="changedInfo.modal = false;"></v-date-picker>
                  </v-dialog>
                  <v-divider></v-divider>
                  <v-textarea v-model="changedInfo.reason" :rules="[$store.state.rules.lengthLessThan(100)]" label="变更理由" counter="100" solo flat single-line required></v-textarea>
                  <v-divider></v-divider>
                </v-form>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn @click.native="closeChanged" flat>取消操作</v-btn>
                  <v-btn :disabled="!formValid.changedValid" @click.native="saveChanged" color="error" depressed>确认变更</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-if="['fulfilling', 'expired'].indexOf($route.query.contractType)>=0" v-model="dialog.refundedDialog" fullscreen hide-overlay>
              <v-tooltip left slot="activator">
                <v-btn slot="activator" fab small dark color="pink">
                  <v-icon>money_off</v-icon>
                </v-btn>
                <span>退租</span>
              </v-tooltip>
              <v-card color="blue-grey lighten-5">
                <!-- <v-alert v-if="renewCTRTInfo&&renewCTRTInfo.id" :value="true" type="warning">
                  该合同已被续签，续签合同将同时被退租
                  <v-btn @click="$router.push({ name: 'contract-detail', query: { contractType: $route.query.contractType }, params: { contractId: renewCTRTInfo.id } })" dark flat small class="ma-0 text-xs-right" style="height:22px;float:right">查看续签合同</v-btn>
                </v-alert> -->

                <v-container class="px-2">
                  <v-layout align-start align-content-start justify-center wrap>
                    <v-flex xs12 md10 lg8>
                      <v-toolbar dense flat color="blue-grey lighten-5">
                        <v-toolbar-side-icon @click="closeRefunded">
                          <v-icon>close</v-icon>
                        </v-toolbar-side-icon>
                        <v-toolbar-title>提交退租 - {{ CTRTInfo.contractName }}<small>({{ CTRTInfo.contractNo }})</small></v-toolbar-title>
                        <v-spacer></v-spacer>
                      </v-toolbar>
                    </v-flex>
                    <v-flex xs12 md10 lg8>
                      <v-stepper v-model="examineStepper" vertical class="elevation-0 dialog-stepper">
                        <v-stepper-step :rules="formValid.refundedValid" :complete="examineStepper > 1" step="1">
                          填写退租信息
                          <small>稍后将生成退租明细</small>
                        </v-stepper-step>
                        <v-stepper-content step="1">
                          <v-form ref="refundedForm" v-model="formValid.refundedValid" lazy-validation>
                            <v-container grid-list-md>
                              <v-layout row wrap>
                                <v-flex xs6><v-autocomplete dense v-model="refundedInfo.throwALeaseType" :items="refundedSelect" item-text="text" item-value="value" return-object :rules="[$store.state.rules.required]" label="退租类型" box required></v-autocomplete></v-flex>
                                <v-flex xs6>
                                  <v-dialog v-model="refundedInfo.dateDialog" lazy full-width width="290px">
                                    <v-text-field slot="activator" v-if="refundedInfo.throwALeaseType.value != '合同期满退租'" v-model="refundedInfo.throwALeaseDate" :rules="[$store.state.rules.required]" label="退租时间" :hint="`将于${CTRTInfo.endDate&&CTRTInfo.endDate.slice(0, 10)}到期`" persistent-hint box required readonly></v-text-field>
                                    <v-date-picker v-model="refundedInfo.throwALeaseDate" :min="CTRTInfo.startDate" :max="CTRTInfo.endDate" :first-day-of-week="0" show-current locale="zh-cn" @input="refundedInfo.dateDialog = false;"></v-date-picker>
                                  </v-dialog>
                                </v-flex>
                                <v-flex xs12><v-textarea v-model="refundedInfo.reason" :rules="[$store.state.rules.lengthLessThan(100)]" label="退租理由" counter="100" box required></v-textarea></v-flex>
                              </v-layout>
                            </v-container>
                          </v-form>
                          <v-btn :disabled="!formValid.refundedValid" @click.native="$refs.refundedForm.validate();examineStepper++;getRefundedDetail()" color="primary" depressed>核对退租信息</v-btn>
                          <v-btn @click.native="examineStepper--" flat>后退</v-btn>
                        </v-stepper-content>
                        <v-stepper-step :complete="examineStepper > 2" step="2">确认退租明细</v-stepper-step>
                        <v-stepper-content step="2">
                          <v-container grid-list-md>
                            <v-layout justify-center wrap>
                              <v-flex xs12>
                                <v-subheader>
                                  租金缴纳明细
                                  <v-spacer></v-spacer>
                                  <v-btn :disabled="!formValid.refundedValid" @click.native="getRefundedRent()" small color="primary" depressed>生成租金明细</v-btn>
                                </v-subheader>
                                <v-data-table
                                  :headers="rentHeaders"
                                  :items="refundedRentList"
                                  item-key="payDay"
                                  no-data-text="暂无租金明细"
                                  class="elevation-1 mb-4"
                                >
                                  <template slot="items" slot-scope="props">
                                    <td v-if="props.item.rentType">{{ props.item.rentType }}</td>
                                    <td v-if="props.item.payDate">{{ props.item.payDate.slice(0, 10) }}</td>
                                    <td v-if="props.item.fromDate">{{ props.item.fromDate.slice(0, 10) }}</td>
                                    <td v-if="props.item.endDate">{{ props.item.endDate.slice(0, 10) }}</td>
                                    <td>{{ props.item.totalRent }}元</td>
                                    <td>{{ props.item.state }}</td>
                                  </template>
                                </v-data-table>
                              </v-flex>
                            </v-layout>
                          </v-container>
                          <v-btn :disabled="!formValid.refundedValid" @click.native="saveRefunded" color="primary" depressed>申请退租</v-btn>
                          <v-btn @click.native="examineStepper--" flat>后退</v-btn>
                        </v-stepper-content>
                      </v-stepper>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card>
            </v-dialog>
            <v-dialog v-if="['submitted'].indexOf($route.query.contractType)>=0" v-model="dialog.examineNewDialog" persistent max-width="480">
              <v-tooltip left slot="activator">
                <v-btn slot="activator" fab small dark color="pink">
                  <v-icon>how_to_reg</v-icon>
                </v-btn>
                <span>审核</span>
              </v-tooltip>
              <v-card>
                <v-card-title class="headline">提交审核结果</v-card-title>
                <v-form ref="examineNewForm" v-model="formValid.examineNewValid" lazy-validation style="overflow: hidden">
                  <v-overflow-btn v-model="examineNewInfo.result" :items="examineNewSelect" item-text="text" item-value="value" return-object :rules="[$store.state.rules.required]" label="审核结果" single-line required hide-details></v-overflow-btn>
                  <v-divider></v-divider>
                  <v-textarea v-model="examineNewInfo.reason" :rules="[$store.state.rules.lengthLessThan(100)]" label="审核理由" counter="100" solo flat single-line required></v-textarea>
                  <v-divider></v-divider>
                </v-form>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn @click.native="closeExamineNew" flat>取消操作</v-btn>
                  <v-btn :disabled="!formValid.examineNewValid" @click.native="saveExamineNew" color="primary" depressed>提交审核</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-if="['submitted'].indexOf($route.query.contractType)>=0" v-model="dialog.examineRefundedDialog" persistent max-width="480">
              <v-tooltip left slot="activator">
                <v-btn slot="activator" fab small dark color="pink">
                  <v-icon>how_to_reg</v-icon>
                </v-btn>
                <span>退租审核</span>
              </v-tooltip>
              <v-card>
                <v-card-title class="headline">提交退租审核</v-card-title>
                <v-form ref="examineRefundedForm" v-model="formValid.examineRefundedValid" lazy-validation style="overflow: hidden">
                  <v-overflow-btn v-model="examineRefundedInfo.result" :items="examineRefundedSelect" item-text="text" item-value="value" return-object :rules="[$store.state.rules.required]" label="审核结果" single-line required hide-details></v-overflow-btn>
                  <v-divider></v-divider>
                  <v-textarea v-model="examineRefundedInfo.reason" :rules="[$store.state.rules.lengthLessThan(100)]" label="审核理由" counter="100" solo flat single-line required></v-textarea>
                  <v-divider></v-divider>
                </v-form>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn @click.native="closeExamineRefunded" flat>取消操作</v-btn>
                  <v-btn :disabled="!formValid.examineRefundedValid" @click.native="saveExamineRefunded" color="primary" depressed>提交审核</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
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
      changed: { name: "已变更", to: "contract/viewCancelContract" },
      refunded: { name: "已退租", to: "contract/viewThrowALease" },
      expired: { name: "已到期", to: "contract/view" }
    },
    dialog: {
      fab: false,
      examineNewDialog: false,
      refundedDialog: false,
      changedDialog: false
    },
    formValid: {
      examineNewValid: false,
      refundedValid: false,
      changedValid: false
    },
    CTRTInfo: {},
    // 租金列表
    rentPreHeaders: [
      { text: "应缴日期", value: "payDay", sortable: false },
      { text: "计费起始日期", value: "fromDate", sortable: false },
      { text: "计费截至日期", value: "endDate", sortable: false },
      { text: "应缴租金", value: "total", sortable: false },
      { text: "应缴物业费", value: "propertyFees", sortable: false }
    ],
    rentHeaders: [
      { text: "费用类型", value: "rentType", sortable: false },
      { text: "应缴日期", value: "payDate", sortable: false },
      { text: "计费起始日期", value: "fromDate", sortable: false },
      { text: "计费截至日期", value: "endDate", sortable: false },
      { text: "应缴金额", value: "totalRent", sortable: false },
      { text: "费用状态", value: "state", sortable: false }
    ],
    // 变更
    renewCTRTInfo: {},
    changedInfo: {},
    defaultChanged: {
      time: "",
      reason: ""
    },
    // 退租
    examineStepper: 1,
    refundedInfo: {},
    defaultRefunded: {
      throwALeaseType: {
        text: "期满退租",
        value: "合同期满退租"
      },
      throwALeaseDate: "",
      reason: ""
    },
    refundedSelect: [
      {
        text: "期满退租",
        value: "合同期满退租"
      },
      {
        text: "提前退租",
        value: "合同提前退租"
      }
    ],
    refundedRentList: [],
    // 新增审核
    examineNewInfo: {},
    defaultExamineNew: {
      reason: "",
      result: {
        text: "通过",
        value: "审核通过"
      }
    },
    examineNewSelect: [
      {
        text: "通过",
        value: "审核通过"
      },
      {
        text: "驳回",
        value: "审核未通过"
      }
    ],
    // 退租审核
    examineRefundedInfo: {},
    defaultExamineRefunded: {
      reason: "",
      result: {
        text: "通过",
        value: "审核通过"
      }
    },
    examineRefundedSelect: [
      {
        text: "通过",
        value: "审核通过"
      },
      {
        text: "驳回",
        value: "审核未通过"
      }
    ]
  }),
  created() {
    this.changedInfo = Object.assign({}, this.defaultChanged);
    this.refundedInfo = Object.assign({}, this.defaultRefunded);
    this.examineNewInfo = Object.assign({}, this.defaultExamineNew);
    this.examineRefundInfo = Object.assign({}, this.defaultExamineRefund);
    this.initialize();
  },
  watch: {
    "dialog.refundedDialog"(val) {
      !val || this.getRenewContract();
    }
  },
  methods: {
    initialize() {
      this.networkLoading = true;
      this.networkError = null;
      this.$http
        .get(
          `/cms/${this.CTRTInfoURL[this.$route.query.contractType].to}.json`,
          {
            params: {
              id: this.$route.params.contractId
            }
          }
        )
        .then(res => {
          let resData = res.data.data;
          this.CTRTInfo = resData;
        })
        .catch(err => {
          this.networkError = err;
          this.$store.commit(
            "addSnackBar",
            "合同详情查询失败 请检查网络后刷新",
            "error"
          );
        })
        .finally(() => (this.networkLoading = false));
    },
    getRenewContract() {
      this.renewCTRTInfo = null;
      this.$http
        .post(`/cms/contract/throwALeaseRenewList.json`, {
          id: this.CTRTInfo.id,
          realEndDate: this.getDay(new Date(), 0)
        })
        .then(res => {
          this.renewCTRTInfo = res.data.data;
        })
        .catch(() =>
          this.$store.commit("addSnackBar", "续签合同查询失败", "error")
        );
    },
    getDay(date, day) {
      let t = new Date(
        new Date(date).getTime() + parseInt(day) * 24 * 60 * 60 * 1000
      );
      return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(
        2,
        0
      )}-${String(t.getDate()).padStart(2, 0)}`;
    },
    closeChanged() {
      this.dialog.changedDialog = false;
      setTimeout(() => {
        this.$refs.changedForm.reset();
        this.changedInfo = Object.assign({}, this.defaultChanged);
      }, 300);
    },
    saveChanged() {
      if (this.$refs.changedForm.validate()) {
        this.$http
          .post("/cms/contract/cancel.json", {
            id: this.CTRTInfo.id,
            cancelDate: this.changedInfo.cancelDate,
            reason: this.changedInfo.reason
          })
          .then(res => {
            if (res.data.code == 0) {
              this.$store.commit("addSnackBar", "合同变更成功", "success");
              this.closeChanged();
            } else {
              throw new Error(res.data.msg);
            }
          })
          .catch(err =>
            this.$store.commit(
              "addSnackBar",
              `合同变更出现错误 ${err}`,
              "error"
            )
          );
      }
    },
    getRefundedDetail() {
      this.getRefundedRent();
    },
    getRefundedRent() {
      if (this.formValid.refundedValid) {
        this.$http
          .post("/cms/contract/contractRefundDetail.json", {
            id: this.CTRTInfo.id,
            realEndDate:
              this.refundedInfo.throwALeaseType == "合同期满退租"
                ? this.CTRTInfo.endDate
                : this.refundedInfo.throwALeaseDate
          })
          .then(res => {
            if (res.data.code != 500) {
              this.addSnackBar("租金明细生成成功", "success");
              this.refundedRentList = res.data.data;
            } else {
              throw new Error(res.data.msg);
            }
          })
          .catch(err =>
            this.addSnackBar(`退租明细生成出现错误 ${err}`, "error")
          );
      } else {
        this.addSnackBar("退租信息填写有误 请检查后重试", "error");
      }
    },
    closeRefunded() {
      this.dialog.refundedDialog = false;
      setTimeout(() => {
        this.$refs.refundedForm.reset();
        this.refundedInfo = Object.assign({}, this.defaultRefunded);
      }, 300);
    },
    saveRefunded() {
      if (this.$refs.refundedForm.validate()) {
        this.$http
          .post("/cms/contract/throwALease.json", {
            id: this.CTRTInfo.id,
            throwALeaseType: this.refundedInfo.throwALeaseType.value,
            throwALeaseDate: this.refundedInfo.throwALeaseDate,
            reason: this.refundedInfo.reason
          })
          .then(res => {
            if (res.data.code == 0) {
              this.$store.commit("addSnackBar", "合同已退租成功", "success");
              this.closeRefunded();
            } else {
              throw new Error(res.data.msg);
            }
          })
          .catch(err =>
            this.$store.commit(
              "addSnackBar",
              `合同退租出现错误 ${err}`,
              "error"
            )
          );
      }
    },
    closeExamineNew() {
      this.dialog.examineNewDialog = false;
      setTimeout(() => {
        this.$refs.examineNewForm.reset();
        this.examineNewInfo = Object.assign({}, this.defaultExamineNew);
      }, 300);
    },
    saveExamineNew() {
      if (this.$refs.examineNewForm.validate()) {
        this.$http
          .post("/cms/contractSub/checkContract.json", {
            id: this.CTRTInfo.id,
            contractState: this.examineNewInfo.result.value,
            reason: this.examineNewInfo.reason
          })
          .then(res => {
            if (res.data.code == 0) {
              this.$store.commit("addSnackBar", "合同已审核成功", "success");
              this.$router.go(-1);
            } else {
              throw new Error(res.data.msg);
            }
          })
          .catch(err =>
            this.$store.commit(
              "addSnackBar",
              `合同审核出现错误 ${err}`,
              "error"
            )
          );
      }
    },
    closeExamineRefunded() {
      this.dialog.examineRefundedDialog = false;
      setTimeout(() => {
        this.$refs.examineRefundedForm.reset();
        this.examineRefundedInfo = Object.assign(
          {},
          this.defaultExamineRefunded
        );
      }, 300);
    },
    saveExamineRefunded() {
      if (this.$refs.examineRefundedForm.validate()) {
        this.$http
          .post("/cms/contract/verifyThrowALease.json", {
            id: this.CTRTInfo.id,
            contractState: this.examineRefundedInfo.result.value,
            verifyDescription: this.examineRefundedInfo.reason
          })
          .then(res => {
            if (res.data.code == 0) {
              this.$store.commit("addSnackBar", "合同已审核成功", "success");
              this.$router.go(-1);
            } else {
              throw new Error(res.data.msg);
            }
          })
          .catch(err =>
            this.$store.commit(
              "addSnackBar",
              `合同审核出现错误 ${err}`,
              "error"
            )
          );
      }
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
  background: #ECEFF1;
  z-index: 1;
}

.dialog-stepper {
  background: #eceff1 !important;
}

.center-box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
