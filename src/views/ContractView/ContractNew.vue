<template>
  <transition name="slide-fade">
    <v-container class="contract-new px-2">
      <v-layout align-start align-content-start justify-center wrap>
        <v-flex xs12 md10 lg8>
          <v-toolbar dense flat color="blue-grey lighten-5">
            <v-toolbar-side-icon @click="$router.go(-1)">
              <v-icon>close</v-icon>
            </v-toolbar-side-icon>
            <v-toolbar-title>{{CTRTInfoURL[$route.query.newType].title}}并提交审核</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
        </v-flex>
        <v-progress-circular indeterminate color="primary" v-if="networkLoading" class="center-box"></v-progress-circular>
        <v-alert v-else-if="networkError" :value="true" type="error" class="center-box">网络出现异常 - 检查网络后刷新重试</v-alert>
        <v-flex xs12 md10 lg8 v-else>
          <v-stepper v-model="stepNum" vertical class="elevation-0 new-stepper">
            <v-stepper-step :rules="[() => !!formValid[0]]" :complete="stepNum>1" step="1">
              填写合同相关人
              <small>包含甲方、承租方、中介方信息</small>
            </v-stepper-step>
            <v-stepper-content step="1">
              <v-form ref="peopleForm" v-model="formValid[0]" lazy-validation>
                <v-container grid-list-md>
                  <!-- <v-subheader>甲方信息</v-subheader> -->
                  <v-layout row wrap>
                    <v-flex xs12 sm6><v-text-field v-model="newCTRT.partyA" :rules="[$store.state.rules.required]" label="甲方公司" hint="" box required></v-text-field></v-flex>
                    <v-flex xs12 sm6><v-text-field v-model="newCTRT.signedPersonA" :rules="[$store.state.rules.required]" label="甲方签订人" hint="" persistent-hint box required></v-text-field></v-flex>
                  </v-layout>
                  <v-divider class="my-4"></v-divider>
                  <!-- <v-flex xs12 sm6>
                    <v-radio-group v-model="newCTRT.customerType" :rules="[$store.state.rules.required]" required hint="切换承租方类型" persistent-hint row>
                      <v-radio label="企业承租" value="企业"></v-radio>
                      <v-radio label="个人承租" value="个人"></v-radio>
                    </v-radio-group>
                  </v-flex> -->
                  <v-layout row wrap v-if="newCTRT.customerType=='企业'">
                    <v-flex xs12 sm4><v-text-field v-model="newCTRT.companyName" :rules="[$store.state.rules.required]" label="承租方公司" hint="" persistent-hint box required></v-text-field></v-flex>
                    <v-flex xs12 sm4><v-text-field v-model="newCTRT.businessLicense" :rules="[$store.state.rules.required]" mask="####################" label="承租方营业执照" hint="" persistent-hint box required></v-text-field></v-flex>
                    <v-flex xs12 sm4><v-text-field v-model="newCTRT.legalPerson" :rules="[$store.state.rules.required]" label="承租方公司法人" hint="" persistent-hint box required></v-text-field></v-flex>
                  </v-layout>
                  <v-layout row wrap>
                    <v-flex xs12 sm4><v-text-field v-model="newCTRT.signedPersonB" :rules="[$store.state.rules.required]" label="承租方签订人" hint="" persistent-hint box required></v-text-field></v-flex>
                    <v-flex xs12 sm4><v-text-field v-model="newCTRT.companyTel" :rules="[$store.state.rules.required]" mask="(+##)###-####-####" label="承租方联系方式" hint="" persistent-hint box required></v-text-field></v-flex>
                    <!-- <v-flex xs12 sm4><v-text-field v-model="newCTRT.companyIndustry" :rules="[$store.state.rules.required]" label="承租方所属行业" hint="" persistent-hint box required></v-text-field></v-flex> -->
                    <v-flex xs12 sm4>
                      <v-menu v-model="menu.companyIndustry" lazy offset-y nudge-top="20">
                        <v-text-field slot="activator" :rules="[$store.state.rules.required]" :value="newCTRT.companyIndustry" label="承租方所属行业" hint="" persistent-hint box required readonly></v-text-field>
                        <v-list style="max-height: 200px; overflow-y: auto;">
                          <v-list-tile v-for="industry in companyIndustryInfo" :key="industry" @click="newCTRT.companyIndustry=industry">
                            <v-list-tile-title>{{industry}}</v-list-tile-title>
                          </v-list-tile>
                        </v-list>
                      </v-menu>
                    </v-flex>
                    <v-flex xs12><v-text-field v-model="newCTRT.companyAddress" :rules="[$store.state.rules.required]" label="承租方通讯地址" hint="" persistent-hint box required></v-text-field></v-flex>
                  </v-layout>
                  <v-divider class="my-4"></v-divider>
                  <v-layout row wrap><v-flex xs12 sm6><v-switch v-model="newCTRT.hasIntermediator" :label="newCTRT.hasIntermediator?'包含中介方':'无中介方'" class="px-0 py-0"></v-switch></v-flex></v-layout>
                  <v-layout row wrap v-if="newCTRT.hasIntermediator">
                    <v-flex xs12 sm6><v-text-field v-model="newCTRT.intermediatorName" :rules="[$store.state.rules.required]" label="经纪人姓名" hint="" persistent-hint box required></v-text-field></v-flex>
                    <v-flex xs12 sm6><v-text-field v-model="newCTRT.idCode" :rules="[$store.state.rules.required]" mask="#################N" label="经纪人身份证" hint="" persistent-hint box required></v-text-field></v-flex>
                    <v-flex xs12 sm6><v-text-field v-model="newCTRT.intermediatorTel" :rules="[$store.state.rules.required]" mask="(+##)###-####-####" label="经纪人联系方式" hint="" persistent-hint box required></v-text-field></v-flex>
                    <v-flex xs12 sm6><v-text-field v-model="newCTRT.agency" :rules="[$store.state.rules.required]" label="经纪人公司" hint="" persistent-hint box required></v-text-field></v-flex>
                  </v-layout>
                </v-container>
                <v-btn @click.native="nextStep($refs.peopleForm)" color="primary" depressed>继续添加房源</v-btn>
              </v-form>
            </v-stepper-content>
            <v-stepper-step :rules="[() => !!formValid[1]]" :complete="stepNum>2" step="2">
              添加租赁房源及租赁信息
              <small>不同种类的房源将分别按不同方式计费，请在第四部分核对总金额</small>
            </v-stepper-step>
            <v-stepper-content step="2">
              <v-form ref="assetsForm" v-model="formValid[1]" lazy-validation>
                <v-container grid-list-md>
                  <v-layout row no-wrap v-for="(assets, assetsIndex) in newAssets" :key="assetsIndex" align-center style="overflow:auto;">
                    <v-flex xs1 order-sm1 v-if="newAssets.length!=1" style="min-width: 44px;">
                      <v-btn @click="deleteNewAssets(assetsIndex)" flat icon color="pink" class="mx-0">
                        <v-icon>delete</v-icon>
                      </v-btn>
                    </v-flex>
                    <v-flex xs6 sm4 style="min-width: 200px;">
                      <v-menu v-model="assets.buildingMenu" :close-on-content-click="false" offset-y nudge-top="20" lazy>
                        <v-text-field slot="activator" @click="getPark()" :rules="[$store.state.rules.required]" :value="assets.buildingName" label="签约楼宇" :hint="assets.parkName" persistent-hint box required readonly></v-text-field>
                        <v-list style="max-height: 200px; overflow-y: auto;">
                          <v-list-tile v-if="!assetsInfo.length">
                            <v-list-tile-title>暂无房源可以添加</v-list-tile-title>
                          </v-list-tile>
                          <v-menu v-else v-for="(assetsPark, i) in assetsInfo" :key="i" offset-x style="display:block">
                            <v-list-tile slot="activator" @click="1">
                              <v-list-tile-title>{{ assetsPark.parkName }}</v-list-tile-title>
                            </v-list-tile>
                            <v-list style="max-height: 200px; overflow-y: auto;">
                              <v-list-tile v-for="(assetsBuilding, j) in assetsPark.building" :key="j" @click="changeBuilding(assetsIndex, assetsPark, assetsBuilding)">
                                <v-list-tile-title>{{ assetsBuilding.buildingName }}</v-list-tile-title>
                              </v-list-tile>
                            </v-list>
                          </v-menu>
                        </v-list>
                      </v-menu>
                    </v-flex>
                    <v-flex xs6 sm4 style="min-width: 200px;">
                      <v-menu v-model="assets.houseMenu" :disabled="!assets.buildingName" :close-on-content-click="false" lazy offset-y nudge-top="20">
                        <v-text-field slot="activator" @click="getHouse(assets.buildingNo)" :disabled="!assets.buildingName" :rules="[$store.state.rules.required]" :value="assets.doorNumber ? `${assets.doorNumber}室 - ${((n)=>{return n>=0?n:'地下'+Math.abs(n)})(assets.floorNumber)}层` : ''" label="签约房源" :hint="assets.houseId?`单间面积 ${assets.buildArea}M²`:''" persistent-hint box required readonly></v-text-field>
                        <v-list style="max-height: 200px; overflow-y: auto;">
                          <v-list-tile v-if="!assetsFloorInfo.length">
                            <v-list-tile-title>暂无房源可以添加</v-list-tile-title>
                          </v-list-tile>
                          <v-menu v-else v-for="(assetsFloor, i) in assetsFloorInfo" :key="i" offset-x style="display:block">
                            <v-list-tile slot="activator" @click="1">
                              <v-list-tile-title>{{ ((n)=>{return n>=0?n:'地下'+Math.abs(n)})(assetsFloor.floorNumber) }}层</v-list-tile-title>
                            </v-list-tile>
                            <v-list style="max-height: 200px; overflow-y: auto;">
                              <v-list-tile v-for="(assetsHouse, j) in assetsFloor.house" :key="j" :disabled="assetsHouse.isAdded" @click="!assetsHouse.isAdded ? changeHouse(assetsIndex, assetsFloor, assetsHouse) : ''">
                                <v-list-tile-title>{{ assetsHouse.doorNumber }}室<small v-if="assetsHouse.isAdded">(已添加)</small></v-list-tile-title>
                              </v-list-tile>
                            </v-list>
                          </v-menu>
                        </v-list>
                      </v-menu>
                    </v-flex>
                    <v-flex xs6 sm3 style="min-width: 150px;"><v-text-field v-model="assets.price" :disabled="!assets.houseId" :rules="[$store.state.rules.required, $store.state.rules.noZero, $store.state.rules.nonnegative]" label="每平日价(元)" :hint="assets.price ? `首年约${parseInt(30 * assets.price * assets.buildArea)}元/30天` : ''" persistent-hint type="number" box required></v-text-field></v-flex>
                  </v-layout>
                </v-container>
                <v-btn @click="addNewAssets({})" flat color="primary">添加房源</v-btn>
                <v-spacer></v-spacer>
                <v-btn @click.native="nextStep($refs.assetsForm)" color="primary" depressed>继续完善合同</v-btn>
                <v-btn @click.native="stepNum--" flat>后退</v-btn>
              </v-form>
            </v-stepper-content>
            <v-stepper-step :rules="[() => !!formValid[2]]" :complete="stepNum>3" step="3">
              完善合同信息
              <small>包括合同编号、租赁时长、添加免租等</small>
            </v-stepper-step>
            <v-stepper-content step="3">
              <v-form ref="dateForm" v-model="formValid[2]" lazy-validation>
                <v-container grid-list-md>
                  <v-layout row wrap>
                    <v-flex xs12 sm6><v-text-field v-model="newCTRT.contractNo" :rules="[$store.state.rules.required]" label="合同编号" hint="例:ABCD-YYYYMMDD-1234" persistent-hint box></v-text-field></v-flex>
                    <v-flex xs12 sm6><v-text-field v-model="newCTRT.contractName" :rules="[$store.state.rules.required]" label="合同名称" hint="" persistent-hint box required></v-text-field></v-flex>
                    <v-flex xs12 sm6><v-text-field v-model="newCTRT.address" :rules="[$store.state.rules.required]" label="合同签署地址" hint="" persistent-hint box required></v-text-field></v-flex>
                    <v-flex xs12 sm3>
                      <v-menu v-model="menu.purpose" lazy offset-y nudge-top="20">
                        <v-text-field slot="activator" :rules="[$store.state.rules.required]" :value="newCTRTOther.purpose" label="租赁用途" hint="" persistent-hint box required readonly></v-text-field>
                        <v-list style="max-height: 200px; overflow-y: auto;">
                          <v-list-tile v-for="use in purposeInfo" :key="use" @click="newCTRTOther.purpose=use">
                            <v-list-tile-title>{{ use }}</v-list-tile-title>
                          </v-list-tile>
                        </v-list>
                      </v-menu>
                    </v-flex>
                    <v-flex xs12 sm3>
                      <v-menu :close-on-content-click="false" v-model="menu.signingDate" offset-y lazy>
                        <v-text-field slot="activator" v-model="newCTRT.signingDate" :rules="[$store.state.rules.required]" label="签订日期" hint="" persistent-hint box required readonly></v-text-field>
                        <v-date-picker v-model="newCTRT.signingDate" :min="minSigningDate" :first-day-of-week="0" show-current locale="zh-cn" @input="menu.signingDate = false;newCTRT.startDate='';newCTRT.endDate=''"></v-date-picker>
                      </v-menu>
                    </v-flex>
                    <v-flex xs12 sm3>
                      <v-menu :close-on-content-click="false" v-model="menu.startDate" :disabled="!newCTRT.signingDate" offset-y lazy>
                        <v-text-field slot="activator" v-model="newCTRT.startDate" :rules="[$store.state.rules.required]" :disabled="!newCTRT.signingDate" label="记租开始日期" hint="" persistent-hint box required readonly></v-text-field>
                        <v-date-picker v-model="newCTRT.startDate" :min="minStartDate" :first-day-of-week="0" show-current locale="zh-cn" @input="menu.startDate = false;newCTRT.endDate=''"></v-date-picker>
                      </v-menu>
                    </v-flex>
                    <v-flex xs12 sm3>
                      <v-menu :close-on-content-click="false" v-model="menu.endDate" :disabled="!newCTRT.startDate" offset-y lazy>
                        <v-text-field slot="activator" v-model="newCTRT.endDate" :rules="[$store.state.rules.required]" :disabled="!newCTRT.startDate" label="记租结束日期" hint="" persistent-hint box required readonly></v-text-field>
                        <v-date-picker v-model="newCTRT.endDate" :min="newCTRT.startDate" :first-day-of-week="0" show-current locale="zh-cn" @input="menu.endDate = false"></v-date-picker>
                      </v-menu>
                    </v-flex>
                    <v-flex xs12 sm3><v-text-field v-model.number="newCTRT.beforeFree" mask="###" :rules="[$store.state.rules.required, $store.state.rules.nonnegative]" :disabled="!newCTRT.startDate" label="记租开始前免租(天)" :hint="beforeFreeHint" persistent-hint box required></v-text-field></v-flex>
                    <v-flex xs12 sm3><v-text-field v-model.number="newCTRT.afterFree" mask="###" :rules="[$store.state.rules.required, $store.state.rules.nonnegative]" :disabled="!newCTRT.endDate" label="记租结束后免租(天)" :hint="afterFreeHint" persistent-hint box required></v-text-field></v-flex>
                    <!-- <v-flex xs12 sm4><v-text-field v-model="newCTRT.rentDate" :rules="[$store.state.rules.required, $store.state.rules.nonnegative]" label="租金缴纳应提前(天)" hint="" persistent-hint type="number" box required></v-text-field></v-flex> -->
                    <v-flex xs12 sm4><v-text-field v-model="newCTRT.deposit" :rules="[$store.state.rules.required, $store.state.rules.nonnegative]" label="押金(元)" hint="合同生效后既缴纳<br />合同到期后返还" persistent-hint type="number" box required></v-text-field></v-flex>
                    <v-flex xs12 sm4><v-text-field v-model="newCTRT.liquidatedDamages" :rules="[$store.state.rules.required, $store.state.rules.nonnegative]" label="违约金(元)" hint="" persistent-hint type="number" box required></v-text-field></v-flex>
                    <!-- <v-flex xs12 sm4><v-text-field v-model="newCTRT.month" :rules="[$store.state.rules.required, $store.state.rules.noZero]" mask="##" label="租金缴纳周期(月)" hint="" persistent-hint box required></v-text-field></v-flex> -->
                    <v-flex xs12 sm4>
                      <v-menu v-model="menu.month" lazy offset-y nudge-top="20">
                        <v-text-field slot="activator" :rules="[$store.state.rules.required]" :value="`每${newCTRT.month}个月`" label="租金缴纳周期" hint="" persistent-hint box required readonly></v-text-field>
                        <v-list>
                          <v-list-tile v-for="monthNum in [1, 3, 6, 12]" :key="monthNum" @click="newCTRT.month=monthNum">
                            <v-list-tile-title>每{{monthNum}}个月</v-list-tile-title>
                          </v-list-tile>
                        </v-list>
                      </v-menu>
                    </v-flex>
                    <v-flex xs12 sm4><v-text-field v-model="newCTRTOther.increaseRate" :rules="[$store.state.rules.required]" label="租金年递增率(%)" hint="" persistent-hint type="number" box required></v-text-field></v-flex>
                    <v-flex xs12 sm4>
                      <v-menu v-model="menu.increaseType" lazy offset-y nudge-top="20">
                        <v-text-field slot="activator" :rules="[$store.state.rules.required]" :value="['首年租金', '上一年租金'][newCTRTOther.increaseType]" label="租金年递增率基数" hint="" persistent-hint box required readonly></v-text-field>
                        <v-list>
                          <v-list-tile @click="newCTRTOther.increaseType=0">
                            <v-list-tile-title>首年租金</v-list-tile-title>
                          </v-list-tile>
                          <v-list-tile @click="newCTRTOther.increaseType=1">
                            <v-list-tile-title>上一年租金</v-list-tile-title>
                          </v-list-tile>
                        </v-list>
                      </v-menu>
                    </v-flex>
                    <v-flex xs12 sm4><v-text-field v-model="newCTRT.propertyFee" :rules="[$store.state.rules.required, $store.state.rules.nonnegative]" label="物业费(元/m²·天)" hint="" persistent-hint type="number" box required></v-text-field></v-flex>
                  </v-layout>
                </v-container>
                <v-btn @click.native="nextStep($refs.dateForm);getRentDetail()" color="primary" depressed>继续核对信息</v-btn>
                <v-btn @click.native="stepNum--" flat>后退</v-btn>
              </v-form>
            </v-stepper-content>
            <v-stepper-step step="4">
              请确认信息无误并提交申请
              <small>未通过的申请将在审核未通过列表中供重新填写提交</small>
            </v-stepper-step>
            <v-stepper-content step="4">
              <v-container grid-list-md>
                <v-layout justify-center wrap>
                  <v-flex xs12>
                    <v-subheader>
                      租金缴纳明细
                      <v-spacer></v-spacer>
                      <v-btn :disabled="!formValid.reduce((all, el) => all && el)" @click.native="getRentDetail()" small color="primary" depressed>生成租金明细</v-btn>
                    </v-subheader>
                    <v-data-table
                      :headers="rentHeaders"
                      :items="rentDetail.contractRentDetailDtoList"
                      item-key="payDay"
                      no-data-text="暂无租金明细"
                      class="elevation-1 mb-4"
                    >
                      <template slot="items" slot-scope="props">
                        <!-- <tr @click="props.expanded = !props.expanded"> -->
                        <td v-if="props.item.fromDate">{{ props.item.fromDate.slice(0, 10) }}</td>
                        <td v-if="props.item.endDate">{{ props.item.endDate.slice(0, 10) }}</td>
                        <td v-if="props.item.payDay">{{ props.item.payDay.slice(0, 10) }}</td>
                        <td>{{ props.item.houseTotal.toFixed(2) }}元</td>
                        <td>{{ props.item.propertyFees.toFixed(2) }}元</td>
                        <!-- </tr> -->
                      </template>
                      <!-- <template slot="expand" slot-scope="props">
                        <v-card flat>
                          <v-card-text>Peek-a-boo!</v-card-text>
                        </v-card>
                      </template> -->
                      <template slot="footer" v-if="rentDetail.contractRentDetailDtoList">
                        <td colspan="100%">
                          <small v-if="rentDetail.contractRentDetailDtoList">租金总计 : {{ rentDetail.contractRentDetailDtoList.map(el=>el.houseTotal).reduce((all, el, i) => parseFloat(all) + parseFloat(el)).toFixed(0) }}元</small>
                          &nbsp;&nbsp;<small>物业费总计 : {{ rentDetail.propertyFeeTotal }}元</small>
                          &nbsp;&nbsp;<small>押金 : {{ rentDetail.deposit }}元</small>
                          &nbsp;&nbsp;<small>违约金 : {{ rentDetail.liquidatedDamages }}元</small>
                        </td>
                      </template>
                    </v-data-table>
                  </v-flex>
                </v-layout>
              </v-container>
              <v-btn :disabled="!formValid.reduce((all, el) => all && el)" @click.native="submitContract(true)" color="primary" depressed>确认无误并提交</v-btn>
              <v-btn :disabled="!formValid.reduce((all, el) => all && el)" @click.native="submitContract(false)" flat>仅保存</v-btn>
              <v-btn @click.native="stepNum--" flat>后退</v-btn>
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
    networkLoading: false,
    networkError: null,
    CTRTInfoURL: {
      new: { title: "添加新合同", to: "contractSub/queryOne" },
      editing: { title: "编辑待提交合同", to: "contractSub/queryOne" },
      failed: { title: "编辑未过审合同", to: "contractSub/queryOne" },
      fulfilling: { title: "续签生效合同", to: "contract/view" },
      changed: { title: "续签变更合同", to: "contract/viewCancelContract" },
      refunded: { title: "续签退租合同", to: "contract/viewThrowALease" },
      expired: { title: "续签到期合同", to: "contract/view" }
    },
    stepNum: 1,
    formValid: [true, true, true, true],
    assetsInfo: [],
    assetsFloorInfo: [],
    exCTRT: {},
    oldCTRT: {},
    newCTRT: {
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
      hasIntermediator: true,
      intermediatorName: "",
      idCode: "",
      intermediatorTel: "",
      agency: "",
      // 合同信息
      exContractNo: "",
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
      liquidatedDamages: 0,
      propertyFee: 0
    },
    newCTRTOther: {
      increaseType: 0,
      increaseRate: 3,
      purpose: ""
    },
    newAssets: [],
    defaultAssets: {
      parkNo: "",
      parkName: "",
      buildingNo: "",
      buildingName: "",
      houseId: "",
      houseNo: "",
      floorNumber: "",
      doorNumber: "",
      buildArea: 0,
      price: 10,
      houseType: 1,
      availableDate: ""
    },
    rentHeaders: [
      { text: "待缴起始日期", value: "fromDate", sortable: false },
      { text: "待缴结束日期", value: "endDate", sortable: false },
      { text: "应缴日期", value: "payDay", sortable: false },
      { text: "应缴租金", value: "total", sortable: false },
      { text: "物业费", value: "propertyFees", sortable: false }
    ],
    rentDetail: {},
    companyIndustryInfo: [
      "IT/通信/电子/互联网",
      "文化/传媒/娱乐/体育",
      "文体教育/工艺美术",
      "金融业",
      "服务业",
      "商业服务",
      "房地产/建筑业",
      "能源/矿产/环保",
      "农/林/牧/渔",
      "政府/非盈利机构",
      "贸易/批发/零售/租赁业",
      "生产/加工/制造",
      "交通/运输/物流/仓储",
      "其他"
    ],
    purposeInfo: ["办公", "餐饮", "娱乐"],
    menu: {
      companyIndustry: false,
      purpose: false,
      signingDate: false,
      startDate: false,
      endDate: false,
      month: false,
      increaseType: false
    },
    rules: {
      // afterSigning: val =>
      //   Date(this.getDay(this.newCTRT.startDate.slice(0, 10), -1 * val)) >=
      //     Date(this.newCTRT.signingDate.slice(0, 10)) ||
      //   "免租开始日期需晚于合同签订日期"
    }
  }),
  computed: {
    minSigningDate() {
      // 续签的签订日期需晚于前合同的签订日期
      if (this.$route.query.exId && this.exCTRT.signingDate) {
        return this.getDay(this.exCTRT.signingDate, 1);
      }
      return "";
    },
    minStartDate() {
      // 续签的记租日期需晚于前合同的结束日期
      if (this.$route.query.exId && this.exCTRT.signingDate) {
        return this.getDay(
          new Date(
            Math.max(
              new Date(this.newCTRT.signingDate),
              new Date(this.getDay(this.exCTRT.endDate, 1))
            )
          ),
          0
        );
      }
      return this.newCTRT.signingDate;
    },
    beforeFreeHint() {
      let startD = this.newCTRT.startDate;
      let beforeFree = this.newCTRT.beforeFree;
      let beforeD = this.getDay(startD, -1 * beforeFree);

      if (startD) {
        return beforeFree == 0
          ? "记租开始前无免租"
          : `由 ${beforeD}开始<br/>至 ${this.getDay(startD, -1)}到期`;
      }
      return "";
    },
    afterFreeHint() {
      let endD = this.newCTRT.endDate;
      let afterFree = this.newCTRT.afterFree;
      let afterD = this.getDay(endD, afterFree);

      if (endD) {
        return afterFree == 0
          ? "记租结束后无免租"
          : `由 ${this.getDay(endD, 1)}开始<br/>至 ${afterD}到期`;
      }
      return "";
    }
  },
  created() {
    // this.$store.commit("changeToolBarTitle", { title: "添加合同" });
    this.initialize();
  },
  methods: {
    initialize() {
      if (["new"].indexOf(this.$route.query.newType) >= 0) {
        // 若为新建 则添加一条空房源信息
        this.addNewAssets({});
      } else {
        // 若不为新建 则加载原合同信息
        this.getCTRT();
      }
    },
    getCTRT() {
      this.networkLoading = true;
      this.networkError = null;
      // 查询编辑的合同信息
      if (this.$route.query.renewId) {
        this.$http
          .get(`/cms/${this.CTRTInfoURL[this.$route.query.newType].to}.json`, {
            params: {
              id: this.$route.query.renewId
            }
          })
          .then(res => {
            this.oldCTRT = res.data.data;
            if (["editing", "failed"].indexOf(this.$route.query.newType) >= 0) {
              this.copyCTRTInfo(this.oldCTRT);
            }
          })
          .catch(err => {
            this.networkError = err;
            this.addSnackBar("编辑合同详情查询失败 请检查网络后刷新", "error");
          })
          .finally(() => (this.networkLoading = false));
      }
      // 查询续签的合同信息
      if (this.$route.query.exId) {
        this.$http
          .get(`/cms/contract/view.json`, {
            params: {
              id: this.$route.query.exId
            }
          })
          .then(res => {
            this.exCTRT = res.data.data;
            if (["editing", "failed"].indexOf(this.$route.query.newType) < 0) {
              this.copyCTRTInfo(this.exCTRT);
            }
          })
          .catch(err => {
            this.networkError = err;
            this.addSnackBar(
              "续签原合同详情查询失败 请检查网络后刷新",
              "error"
            );
          })
          .finally(() => (this.networkLoading = false));
      }
    },
    copyCTRTInfo(oldCTRT) {
      // 改变newCTRT
      let uselessKeys = []; // 续签时不需要的字段
      if (["new", "editing", "failed"].indexOf(this.$route.query.newType) < 0) {
        uselessKeys = [
          "contractNo",
          "contractState",
          "signingDate",
          "startDate",
          "endDate"
        ];
      }
      for (let key in _.omit(oldCTRT, uselessKeys)) {
        if (this.newCTRT.hasOwnProperty(key)) {
          if (["signingDate", "startDate", "endDate"].indexOf(key) >= 0) {
            this.newCTRT[key] = oldCTRT[key].slice(0, 10);
          } else {
            this.newCTRT[key] = oldCTRT[key];
          }
        }
      }
      // 改变newCTRTOther
      this.newCTRTOther = {
        increaseType: oldCTRT.houseAndBuildingDtos[0].increaseType,
        increaseRate: oldCTRT.houseAndBuildingDtos[0].increaseRate * 100,
        purpose: oldCTRT.houseAndBuildingDtos[0].purpose
      };
      // 改变newAssets
      oldCTRT.houseAndBuildingDtos = oldCTRT.houseAndBuildingDtos.map(item => {
        item.parkNo = item.parkId;
        item.buildingNo = item.buildingId;
        item.houseNo = item.houseId;
        item.price = item.rent;
        this.addNewAssets(item);
        return item;
      });
    },
    getPark() {
      // 若为新建或编辑新建 则获取全部闲置房源
      if (
        ["new", "editing", "failed"].indexOf(this.$route.query.newType) >= 0 &&
        !this.newCTRT.exContractNo
      ) {
        this.$http
          .post("/cms/AssetsInfo/park.json")
          .then(res => {
            let resData = res.data.data;
            resData = resData && resData.length ? resData : [];
            // 转换数据结构为Tree并保存至assetsInfo
            this.assetsInfo = this.translatePark(resData);
          })
          .catch(() => this.addSnackBar("楼宇信息查询失败", "error"));
      } else {
        // 若为续签或编辑续签 则仅获取原合同房源
        this.assetsInfo = this.translatePark(this.exCTRT.houseAndBuildingDtos);
      }
    },
    translatePark(list) {
      // 将List形式的房源信息转换为Tree形式(按parkNo划分building)并返回
      let parkInfo = [];
      list.forEach(item => {
        // 将未绑定园区的房源分类
        if (item.parkNo === null) {
          item.parkNo = 0;
          item.parkName = "无归属楼宇";
        }
        if (!parkInfo[item.parkNo]) {
          parkInfo[item.parkNo] = {
            parkNo: item.parkNo,
            parkName: item.parkName,
            building: []
          };
        }
        parkInfo[item.parkNo].building.push({
          buildingNo: item.buildingNo,
          buildingName: item.buildingName
        });
      });
      // 返回去除空项的园区信息数组
      return parkInfo.filter(el => el);
    },
    changeBuilding(assetsIndex, assetsPark, assetsBuilding) {
      // 关闭菜单
      this.newAssets[assetsIndex].buildingMenu = false;
      // 将assetsFloorInfo置空
      this.assetsFloorInfo = [];
      // 若楼宇ID改变
      if (this.newAssets[assetsIndex].buildingNo != assetsBuilding.buildingNo) {
        // 改变表单中楼宇信息
        Object.assign(this.newAssets[assetsIndex], this.defaultAssets, {
          parkNo: assetsPark.parkNo,
          parkName: assetsPark.parkName,
          buildingNo: assetsBuilding.buildingNo,
          buildingName: assetsBuilding.buildingName
        });
      }
    },
    getHouse(assetsBuildingNo) {
      // 将assetsFloorInfo置空
      this.assetsFloorInfo = [];
      // 若为新建或编辑新建 则获取全部闲置房源
      if (
        ["new", "editing", "failed"].indexOf(this.$route.query.newType) >= 0 &&
        !this.newCTRT.exContractNo
      ) {
        // 请求楼宇下房源列表
        this.$http
          .post("/cms/AssetsInfo/building.json", {
            buildingNo: assetsBuildingNo
          })
          .then(res => {
            let resData = res.data.data;
            resData = resData && resData.length ? resData : [];
            // 转换数据结构为Tree并保存至assetsFloorInfo
            this.assetsFloorInfo = this.translateBuilding(
              resData,
              assetsBuildingNo
            );
          })
          .catch(() => this.addSnackBar("楼宇所含房源信息查询失败", "error"));
      } else {
        // 若为续签或编辑续签 则仅获取原合同房源
        this.assetsFloorInfo = this.translateBuilding(
          this.exCTRT.houseAndBuildingDtos,
          assetsBuildingNo
        );
      }
    },
    translateBuilding(list, buildingNo) {
      // 将List形式的房源信息转换为Tree形式(按floorNumber划分house)并返回
      let floorInfo = {};
      list.forEach(item => {
        if (item.buildingNo == buildingNo) {
          if (!floorInfo[item.floorNumber]) {
            floorInfo[item.floorNumber] = {
              floorNumber: item.floorNumber,
              house: []
            };
          }
          floorInfo[item.floorNumber].house.push({
            isAdded: (addItem => {
              let isAdded = false;
              this.newAssets.map(el => {
                if (addItem.houseNo == el.houseNo) {
                  isAdded = true;
                }
              });
              return isAdded;
            })(item),
            houseNo: item.houseNo,
            doorNumber: item.doorNumber
          });
        }
      });
      // 返回去除空项的楼层信息数组
      return _.values(floorInfo).sort((x, y) => x.floorNumber > y.floorNumber);
    },
    changeHouse(assetsIndex, assetsFloor, assetsHouse) {
      let newAssetsData = this.newAssets[assetsIndex];
      // 关闭菜单
      newAssetsData.houseMenu = false;
      // 若房源ID改变
      if (newAssetsData.houseNo != assetsHouse.houseNo) {
        // 将newAssets的房源信息置空并改变表单中楼宇信息
        Object.assign(newAssetsData, {
          houseNo: assetsHouse.houseNo,
          floorNumber: assetsFloor.floorNumber,
          doorNumber: assetsHouse.doorNumber,
          buildArea: 0,
          price: 10,
          houseType: 1,
          availableDate: ""
        });
        if (
          ["new", "editing", "failed"].indexOf(this.$route.query.newType) >=
            0 &&
          !this.newCTRT.exContractNo
        ) {
          // 请求该楼宇下房源信息
          this.$http
            .post("/cms/AssetsInfo/house.json", {
              houseNo: assetsHouse.houseNo
            })
            .then(res => {
              let resData = res.data.data;
              if (resData) {
                Object.assign(newAssetsData, {
                  houseId: resData.houseId,
                  buildArea: resData.buildArea,
                  price: resData.price,
                  availableDate: resData.availableDate
                });
              }
            })
            .catch(() => this.addSnackBar("房源信息查询失败", "error"));
        } else {
          // 若为续签或编辑续签 则仅获取原合同房源
          let exHouse = this.exCTRT.houseAndBuildingDtos.find(
            item => item.houseNo == assetsHouse.houseNo
          );
          Object.assign(newAssetsData, {
            houseId: exHouse.houseNo,
            houseNo: exHouse.houseNo,
            buildArea: exHouse.buildArea,
            price: exHouse.rent,
            availableDate: exHouse.availableDate
          });
        }
      }
    },
    addNewAssets(Obj) {
      this.newAssets.push(Object.assign({}, this.defaultAssets, Obj));
    },
    deleteNewAssets(index) {
      this.newAssets.splice(index, 1);
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
    getRentDetail() {
      if (this.formValid.reduce((all, el) => all && el)) {
        this.$http
          .post("/cms/contract/contractRentDetail.json", {
            afterFree: this.newCTRT.afterFree,
            beforeFree: this.newCTRT.beforeFree,
            contractHouseRentDtos: this.newAssets.map(item => ({
              buildArea: item.buildArea,
              rent: item.price,
              increaseType: this.newCTRTOther.increaseType,
              increaseRate: this.newCTRTOther.increaseRate / 100
            })),
            deposit: this.newCTRT.deposit,
            endDate: this.newCTRT.endDate,
            liquidatedDamages: this.newCTRT.liquidatedDamages,
            month: this.newCTRT.month,
            propertyFee: this.newCTRT.propertyFee,
            signingDate: this.newCTRT.signingDate,
            startDate: this.newCTRT.startDate
          })
          .then(res => {
            if (res.data.code != 500) {
              this.addSnackBar("租金明细生成成功", "success");
              this.rentDetail = res.data.data;
            }
          })
          .catch(err =>
            this.addSnackBar(`租金明细生成出现错误 ${err}`, "error")
          );
      } else {
        this.addSnackBar("合同信息填写有误 请检查后重试", "error");
      }
    },
    submitContract(isSummit) {
      let CTRTData = Object.assign({}, this.newCTRT, {
        exContractNo: Number(this.$route.query.exId) || null,
        contractState: isSummit ? "待审核" : "待提交",
        contractHouseDtos: this.newAssets.map(item => ({
          houseId: item.houseId,
          rent: item.price,
          increaseType: this.newCTRTOther.increaseType,
          increaseRate: this.newCTRTOther.increaseRate / 100,
          purpose: this.newCTRTOther.purpose,
          type: "房屋"
        }))
      });
      let submitUrl = "addContract";
      if (["editing", "failed"].indexOf(this.$route.query.newType) >= 0) {
        Object.assign(CTRTData, { id: Number(this.$route.query.renewId) });
        submitUrl = "modifyUnSubmit";
      }
      if (this.formValid.reduce((all, el) => all && el)) {
        this.$http
          .post(`/cms/contractSub/${submitUrl}.json`, CTRTData)
          .then(res => {
            if (res.data.code == 0) {
              if (!isSummit) {
                this.addSnackBar("合同已保存成功 可稍后编辑", "success");
              } else {
                this.addSnackBar("合同已提交成功 即将开始审核", "success");
              }
              this.$router.go(-1);
            } else {
              this.addSnackBar(`合同提交错误: ${res.data.meg}`, "error");
            }
          })
          .catch(() =>
            this.addSnackBar("合同提交出现错误 请检查网络后重试", "error")
          );
      } else {
        this.addSnackBar("合同信息填写有误 请检查后重试", "error");
      }
    },
    nextStep(el) {
      el.validate();
      this.stepNum++;
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

.contract-new {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  max-width: 100%;
  min-height: 100%;
  background: #eceff1;
  z-index: 1;

  .center-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .new-stepper {
    max-width: 800px;
    background: #eceff1;
  }
}
</style>
