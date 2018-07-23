<template>
  <v-container class="contract-new px-2 pb-5">
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
                  <v-flex xs12 sm4><v-text-field :disabled="$route.query.newType == 'change'" v-model="newCTRT.businessLicense" :rules="[$store.state.rules.required]" mask="####################" label="承租方营业执照" hint="" persistent-hint box required></v-text-field></v-flex>
                  <v-flex xs12 sm4><v-text-field v-model="newCTRT.legalPerson" :rules="[$store.state.rules.required]" label="承租方公司法人" hint="" persistent-hint box required></v-text-field></v-flex>
                </v-layout>
                <v-layout row wrap>
                  <v-flex xs12 sm4><v-text-field v-model="newCTRT.signedPersonB" :rules="[$store.state.rules.required]" label="承租方签订人" hint="" persistent-hint box required></v-text-field></v-flex>
                  <v-flex xs12 sm4><v-text-field v-model="newCTRT.companyTel" :rules="[$store.state.rules.required]" mask="(+##)###-####-####" label="承租方联系方式" hint="" persistent-hint box required></v-text-field></v-flex>
                  <v-flex xs12 sm4><v-select v-model="newCTRT.companyIndustry" :items="companyIndustryInfo" :rules="[$store.state.rules.required]" label="承租方所属行业" hint="" persistent-hint box require></v-select></v-flex>
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
                <v-layout row no-wrap v-for="(assets, assetsIndex) in newAssets" :key="assetsIndex" align-start style="overflow:auto;">
                  <v-flex xs1 order-sm1 v-if="newAssets.length!=1&&$route.query.newType != 'change'" style="min-width: 44px;">
                    <v-btn @click="deleteNewAssets(assetsIndex)" flat icon color="pink" class="mx-0">
                      <v-icon>delete</v-icon>
                    </v-btn>
                  </v-flex>
                  <v-flex xs6 sm3 style="min-width: 150px;">
                    <v-menu v-model="assets.buildingMenu" :disabled="$route.query.newType == 'change'" :close-on-content-click="false" offset-y nudge-top="20" lazy>
                      <div slot="activator" @click="getPark()">
                        <v-text-field :disabled="$route.query.newType == 'change'" :rules="[$store.state.rules.required]" :value="assets.buildingName" label="签约楼宇" :hint="assets.parkName" persistent-hint box required readonly></v-text-field>
                      </div>
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
                    <v-menu v-model="assets.houseMenu" :disabled="!assets.buildingName||$route.query.newType == 'change'" :close-on-content-click="false" lazy offset-y nudge-top="20">
                      <div slot="activator" @click="getHouse(assets.buildingNo)">
                        <v-text-field :disabled="!assets.buildingName||$route.query.newType == 'change'" :rules="[$store.state.rules.required]" :value="assets.doorNumber ? `${((n)=>{return n>=0?n:'地下'+Math.abs(n)})(assets.floorNumber)}层 - ${assets.doorNumber}室` : ''" label="签约房源" :hint="assets.houseId?`${assets.buildArea}M², ${(oldCTRT.id?oldCTRT.endDate:assets.availableDate).slice(0, 10)}可租`:''" persistent-hint box required readonly></v-text-field>
                      </div>
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
              <v-btn v-if="$route.query.newType != 'change'" @click="addNewAssets({})" flat color="primary">添加房源</v-btn>
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
                  <v-flex xs12 sm6><v-text-field v-model="newCTRT.contractNo" :rules="[$store.state.rules.required, val => (['renew', 'change'].indexOf($route.query.newType) < 0 ? true : (val != oldCTRT.contractNo || '该项不能与原合同相同'))]" label="合同编号" hint="例:ABCD-YYYYMMDD-1234" persistent-hint box></v-text-field></v-flex>
                  <v-flex xs12 sm6><v-text-field :disabled="$route.query.newType == 'change'" v-model="newCTRT.contractName" :rules="[$store.state.rules.required]" label="合同名称" hint="" persistent-hint box required></v-text-field></v-flex>
                  <v-flex xs12 sm6><v-text-field :disabled="$route.query.newType == 'change'" v-model="newCTRT.address" :rules="[$store.state.rules.required]" label="合同签署地址" hint="" persistent-hint box required></v-text-field></v-flex>
                  <v-flex xs12 sm3><v-select :disabled="$route.query.newType == 'change'" v-model="newCTRTOther.purpose" :items="purposeInfo" :rules="[$store.state.rules.required]" label="租赁用途" hint="" persistent-hint box require></v-select></v-flex>
                  <v-flex xs12 sm3>
                    <v-menu :close-on-content-click="false" :disabled="$route.query.newType == 'change'" v-model="menu.signingDate" offset-y lazy>
                      <v-text-field slot="activator" :disabled="$route.query.newType == 'change'" v-model="newCTRT.signingDate" :rules="[$store.state.rules.required]" label="签订日期" hint="" persistent-hint box required readonly></v-text-field>
                      <v-date-picker v-model="newCTRT.signingDate" :min="minSigningDate" :first-day-of-week="0" show-current locale="zh-cn" @input="menu.signingDate = false;newCTRT.startDate='';newCTRT.endDate=''"></v-date-picker>
                    </v-menu>
                  </v-flex>
                  <v-flex xs12 sm3>
                    <v-menu :close-on-content-click="false" v-model="menu.startDate" :disabled="!newCTRT.signingDate||$route.query.newType == 'change'" offset-y lazy>
                      <v-text-field slot="activator" v-model="newCTRT.startDate" :rules="[$store.state.rules.required]" :disabled="!newCTRT.signingDate||$route.query.newType == 'change'" label="记租开始日期" hint="" persistent-hint box required readonly></v-text-field>
                      <v-date-picker v-model="newCTRT.startDate" :min="minStartDate" :first-day-of-week="0" show-current locale="zh-cn" @input="menu.startDate = false;newCTRT.endDate=''"></v-date-picker>
                    </v-menu>
                  </v-flex>
                  <v-flex xs12 sm3>
                    <v-menu :close-on-content-click="false" v-model="menu.endDate" :disabled="!newCTRT.startDate||$route.query.newType == 'change'" offset-y lazy>
                      <v-text-field slot="activator" v-model="newCTRT.endDate" :rules="[$store.state.rules.required]" :disabled="!newCTRT.startDate||$route.query.newType == 'change'" label="记租结束日期" hint="" persistent-hint box required readonly></v-text-field>
                      <v-date-picker v-model="newCTRT.endDate" :min="newCTRT.startDate" :first-day-of-week="0" show-current locale="zh-cn" @input="menu.endDate = false"></v-date-picker>
                    </v-menu>
                  </v-flex>
                  <v-flex xs12 sm3><v-text-field v-model.number="newCTRT.beforeFree" mask="###" :rules="[$store.state.rules.required, $store.state.rules.nonnegative]" :disabled="!newCTRT.startDate||$route.query.newType == 'change'" label="记租开始前免租(天)" :hint="beforeFreeHint" persistent-hint box required></v-text-field></v-flex>
                  <v-flex xs12 sm3><v-text-field v-model.number="newCTRT.afterFree" mask="###" :rules="[$store.state.rules.required, $store.state.rules.nonnegative]" :disabled="!newCTRT.endDate||$route.query.newType == 'change'" label="记租结束后免租(天)" :hint="afterFreeHint" persistent-hint box required></v-text-field></v-flex>
                  <!-- <v-flex xs12 sm4><v-text-field v-model="newCTRT.rentDate" :rules="[$store.state.rules.required, $store.state.rules.nonnegative]" label="租金缴纳应提前(天)" hint="" persistent-hint type="number" box required></v-text-field></v-flex> -->
                  <v-flex xs12 sm4><v-text-field v-model="newCTRT.deposit" :rules="[$store.state.rules.required, $store.state.rules.nonnegative]" label="押金(元)" hint="" persistent-hint type="number" box required></v-text-field></v-flex>
                  <v-flex xs12 sm4><v-text-field v-model="newCTRT.liquidatedDamages" :rules="[$store.state.rules.required, $store.state.rules.nonnegative]" label="违约金(元)" hint="" persistent-hint type="number" box required></v-text-field></v-flex>
                  <!-- <v-flex xs12 sm4><v-text-field v-model="newCTRT.month" :rules="[$store.state.rules.required, $store.state.rules.noZero]" mask="##" label="租金缴纳周期(月)" hint="" persistent-hint box required></v-text-field></v-flex> -->
                  <v-flex xs12 sm4><v-select v-model="newCTRT.month" :items="monthInfo" item-text="text" item-value="value" :rules="[$store.state.rules.required]" label="租金缴纳周期" hint="" persistent-hint box require></v-select></v-flex>
                  <v-flex xs12 sm4><v-text-field v-model="newCTRTOther.increaseRate" :rules="[$store.state.rules.required]" label="租金年递增率(%)" hint="" persistent-hint type="number" box required></v-text-field></v-flex>
                  <v-flex xs12 sm4><v-select v-model="newCTRTOther.increaseType" :items="increaseTypeInfo" item-text="text" item-value="value" :rules="[$store.state.rules.required]" label="租金年递增率基数" hint="" persistent-hint box require></v-select></v-flex>
                  <v-flex xs12 sm4><v-text-field v-model="newCTRT.propertyFee" :rules="[$store.state.rules.required, $store.state.rules.nonnegative]" label="物业费(元/m²·天)" hint="" persistent-hint type="number" box required></v-text-field></v-flex>
                </v-layout>
              </v-container>
              <v-btn @click.native="nextStep($refs.dateForm);getRentDetail()" color="primary" depressed>继续核对信息</v-btn>
              <v-btn @click.native="stepNum--" flat>后退</v-btn>
            </v-form>
          </v-stepper-content>
          <v-stepper-step :complete="stepNum>4" step="4">
            请确认租金信息无误
            <!-- <small>未通过的申请将在审核未通过列表中供重新填写提交</small> -->
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
                      <td v-if="props.item.fromDate">{{ props.item.fromDate.slice(0, 10) }}</td>
                      <td v-if="props.item.endDate">{{ props.item.endDate.slice(0, 10) }}</td>
                      <td v-if="props.item.payDay">{{ props.item.payDay.slice(0, 10) }}</td>
                      <td>{{ props.item.houseTotal.toFixed(2) }}元</td>
                      <td>{{ props.item.propertyFees.toFixed(2) }}元</td>
                    </template>
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
            <v-btn v-if="$route.query.newType != 'change'" :disabled="!formValid.reduce((all, el) => all && el)" @click.native="addContract(true)" color="primary" depressed>确认无误并提交</v-btn>
            <v-btn v-if="$route.query.newType != 'change'" :disabled="!formValid.reduce((all, el) => all && el)" @click.native="addContract(false)" flat>仅保存</v-btn>
            <v-btn v-if="$route.query.newType == 'change'" @click.native="nextStep($refs.dateForm)" color="primary" depressed>填写变更申请</v-btn>
            <v-btn @click.native="stepNum--" flat>后退</v-btn>
          </v-stepper-content>
          <v-stepper-step step="5" v-if="$route.query.newType == 'change'">
            填写申请信息并提交
            <small></small>
          </v-stepper-step>
          <v-stepper-content step="5" v-if="$route.query.newType == 'change'">
            <v-form ref="changeForm" v-model="changeFormValid" lazy-validation>
              <v-container grid-list-md>
                <v-layout row wrap>
                  <v-flex xs6>
                    <v-menu v-model="menu.changeDate" :close-on-content-click="false" lazy offset-y>
                      <v-text-field slot="activator" v-model="changeInfo.cancelDate" :rules="[$store.state.rules.required]" label="变更时间" :hint="`将于${oldCTRT.endDate&&oldCTRT.endDate.slice(0, 10)}到期`" persistent-hint box required readonly></v-text-field>
                      <v-date-picker v-model="changeInfo.cancelDate" :min="oldCTRT.startDate" :max="oldCTRT.endDate" :first-day-of-week="0" show-current locale="zh-cn" @input="menu.changeDate = false;"></v-date-picker>
                    </v-menu>
                  </v-flex>
                  <v-flex xs12><v-textarea v-model="changeInfo.reason" :rules="[$store.state.rules.required, $store.state.rules.lengthLessThan(100)]" label="变更理由" counter="100" box required></v-textarea></v-flex>
                </v-layout>
              </v-container>
            </v-form>
            <v-btn :disabled="!(formValid.reduce((all, el) => all && el)&&changeFormValid)" @click.native="changeContract" color="primary" depressed>确认无误并提交</v-btn>
            <v-btn @click.native="stepNum--" flat>后退</v-btn>
          </v-stepper-content>
        </v-stepper>
      </v-flex>
    </v-layout>
  </v-container>
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
      edit: { title: "编辑合同", to: "contractSub/queryOne" },
      renew: { title: "续签合同", to: "contract/view" },
      change: { title: "变更合同", to: "contract/view" }
    },
    stepNum: 1,
    formValid: [true, true, true, true],
    assetsInfo: [],
    assetsFloorInfo: [],
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
    monthInfo: [
      {
        text: "每月",
        value: 1
      },
      {
        text: "每季度",
        value: 3
      },
      {
        text: "每半年",
        value: 6
      },
      {
        text: "每年",
        value: 12
      }
    ],
    increaseTypeInfo: [
      {
        text: "首年租金",
        value: 0
      },
      {
        text: "上一年租金",
        value: 1
      }
    ],
    menu: {
      companyIndustry: false,
      signingDate: false,
      startDate: false,
      endDate: false,
      month: false,
      increaseType: false,
      changeDate: false
    },
    rentHeaders: [
      { text: "待缴起始日期", value: "fromDate", sortable: false },
      { text: "待缴结束日期", value: "endDate", sortable: false },
      { text: "应缴日期", value: "payDay", sortable: false },
      { text: "应缴租金", value: "total", sortable: false },
      { text: "物业费", value: "propertyFees", sortable: false }
    ],
    rentDetail: {},
    changeFormValid: true,
    changeInfo: {
      cancelDate: "",
      reason: ""
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
      if (this.oldCTRT && this.oldCTRT.signingDate) {
        return this.getDay(this.oldCTRT.signingDate, 1);
      }
      return "";
    },
    minStartDate() {
      // 续签的记租日期需晚于前合同的结束日期
      if (this.oldCTRT && this.oldCTRT.signingDate) {
        return this.getDay(
          new Date(
            Math.max(
              new Date(this.newCTRT.signingDate),
              new Date(this.getDay(this.oldCTRT.endDate, 1))
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
  watch: {
    "$route.query.newType"() {
      this.$router.go(0);
    },
    "$route.query.newId"() {
      this.$router.go(0);
    }
  },
  created() {
    // this.$store.commit("changeToolBarTitle", { title: "添加合同" });
    this.initialize();
  },
  methods: {
    initialize() {
      switch (this.$route.query.newType) {
        case "new":
          // 若为新建 则添加一条空房源信息
          this.addNewAssets({});
          break;
        case "edit":
          // 若为编辑 则加载原合同信息
          this.getCTRT();
          break;
        case "change":
          // 若为变更 则加载原合同信息
          this.getCTRT();
          break;
        case "renew":
          // 若为新建 则加载原合同信息
          this.getCTRT();
          break;
        default:
          this.networkError = "参数错误";
      }
    },
    getCTRT() {
      this.networkLoading = true;
      this.networkError = null;
      // 查询编辑的合同信息
      this.$http
        .get(`/cms/${this.CTRTInfoURL[this.$route.query.newType].to}.json`, {
          params: {
            id: this.$route.query.newId
          }
        })
        .then(res => {
          this.oldCTRT = res.data.data;
          this.copyCTRTInfo(this.oldCTRT);
        })
        .catch(err => {
          this.networkError = err;
          this.$store.commit("addErrorBar", "原合同信息查询失败");
        })
        .finally(() => (this.networkLoading = false));
    },
    copyCTRTInfo(oldCTRT) {
      // 改变newCTRT
      let uselessKeys = [];
      // 续签时不需要的字段
      if (this.$route.query.newType == "renew") {
        uselessKeys = [
          "contractNo",
          "contractState",
          "signingDate",
          "startDate",
          "endDate"
        ];
      }
      // 复制合同信息
      for (let key in _.omit(oldCTRT, uselessKeys)) {
        if (this.newCTRT.hasOwnProperty(key)) {
          if (["signingDate", "startDate", "endDate"].indexOf(key) >= 0) {
            this.newCTRT[key] = oldCTRT[key].slice(0, 10);
          } else {
            this.newCTRT[key] = oldCTRT[key];
          }
        }
      }
      // 处理是否有中介
      this.newCTRT.hasIntermediator = !!oldCTRT.idCode;
      // 处理前序合同字段
      if (["renew", "change"].indexOf(this.$route.query.newType) >= 0) {
        this.newCTRT.exContractNo = oldCTRT.contractNo;
      } else {
        this.newCTRT.exContractNo = oldCTRT.exContractNo;
      }
      // 处理房屋信息中需统一的字段
      this.newCTRTOther = {
        increaseType: oldCTRT.houseAndBuildingDtos[0].increaseType,
        increaseRate: oldCTRT.houseAndBuildingDtos[0].increaseRate * 100,
        purpose: oldCTRT.houseAndBuildingDtos[0].purpose
      };
      // 转换房屋信息部分字段
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
      // 若不为续签 则获取全部闲置房源
      if (["renew", "change"].indexOf(this.$route.query.newType) < 0) {
        this.$http
          .post("/cms/AssetsInfo/park.json")
          .then(res => {
            let resData = res.data.data;
            resData = resData && resData.length ? resData : [];
            // 转换数据结构为Tree并保存至assetsInfo
            this.assetsInfo = this.translatePark(resData);
          })
          .catch(() => this.$store.commit("addErrorBar", "楼宇信息查询失败"));
      } else {
        // 若为续签 则仅获取原合同房源
        this.assetsInfo = this.translatePark(this.oldCTRT.houseAndBuildingDtos);
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
      // 若不为续签 则获取全部闲置房源
      if (["renew", "change"].indexOf(this.$route.query.newType) < 0) {
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
          .catch(() =>
            this.$store.commit("addErrorBar", "楼宇所含房源信息查询失败")
          );
      } else {
        // 若为续签 则仅获取原合同房源
        this.assetsFloorInfo = this.translateBuilding(
          this.oldCTRT.houseAndBuildingDtos,
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
        // 若不为续签 则请求该楼宇下房源信息
        if (["renew", "change"].indexOf(this.$route.query.newType) < 0) {
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
            .catch(() => this.$store.commit("addErrorBar", "房源信息查询失败"));
        } else {
          // 若为续签 则仅获取原合同房源
          let exHouse = this.oldCTRT.houseAndBuildingDtos.find(
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
              this.$store.commit("addSuccessBar", "租金明细生成成功");
              this.rentDetail = res.data.data;
            } else {
              throw new Error(res.date.msg);
            }
          })
          .catch(err =>
            this.$store.commit("addErrorBar", `租金明细生成出现错误 ${err}`)
          );
      } else {
        this.$store.commit("addErrorBar", "合同信息填写有误 请检查后重试");
      }
    },
    addContract(isSummit) {
      let CTRTData = Object.assign({}, this.newCTRT, {
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
      if (this.$route.query.newType == "edit") {
        Object.assign(CTRTData, { id: Number(this.oldCTRT.id) });
        submitUrl = "modifyUnSubmit";
      }
      if (this.formValid.reduce((all, el) => all && el)) {
        this.$http
          .post(`/cms/contractSub/${submitUrl}.json`, CTRTData)
          .then(res => {
            if (res.data.code == 0) {
              if (!isSummit) {
                this.$store.commit("addSuccessBar", "合同保存成功 可稍后编辑");
              } else {
                this.$store.commit("addSuccessBar", "合同提交成功 等待审核");
              }
              this.$router.go(-1);
            } else {
              throw new Error(res.data.meg);
            }
          })
          .catch(() =>
            this.$store.commit(
              "addErrorBar",
              "合同提交出现错误 请检查网络后重试"
            )
          );
      } else {
        this.$store.commit("addErrorBar", "合同信息填写有误 请检查后重试");
      }
    },
    changeContract() {
      let CTRTData = {
        contractSubDTO: Object.assign({}, this.newCTRT, {
          contractState: "待审核",
          operationType: "合同变更",
          contractHouseDtos: this.newAssets.map(item => ({
            houseId: item.houseId,
            rent: item.price,
            increaseType: this.newCTRTOther.increaseType,
            increaseRate: this.newCTRTOther.increaseRate / 100,
            purpose: this.newCTRTOther.purpose,
            type: "房屋"
          }))
        }),
        contractCancelDto: Object.assign({}, this.changeInfo, {
          id: Number(this.oldCTRT.id)
        })
      };
      let submitUrl = "/cms/contract/cancel.json";
      if (
        this.formValid.reduce((all, el) => all && el) &&
        this.$refs.changeForm.validate()
      ) {
        this.$http
          .post(submitUrl, CTRTData)
          .then(res => {
            if (res.data.code == 0) {
              this.$store.commit("addSuccessBar", "合同变更提交成功 等待审核");
              this.$router.go(-1);
            } else {
              throw new Error(res.data.meg);
            }
          })
          .catch(() =>
            this.$store.commit(
              "addErrorBar",
              "合同变更提交出现错误 请检查网络后重试"
            )
          );
      } else {
        this.$store.commit("addErrorBar", "合同信息填写有误 请检查后重试");
      }
    },
    nextStep(el) {
      el.validate();
      this.stepNum++;
    }
  }
};
</script>

<style lang="stylus" scoped>
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
