<template>
  <transition name="slide-fade">
    <v-container class="contract-new px-2">
      <v-layout align-start align-content-start justify-center wrap>
        <v-flex xs12 md10 lg8>
          <v-toolbar dense flat>
            <v-toolbar-side-icon @click="$router.push({})">
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
                  <v-divider class="mt-3"></v-divider>
                  <!-- <v-flex xs12 sm6>
                    <v-radio-group v-model="newCTRT.customerType" :rules="[$store.state.rules.required]" required hint="切换承租方类型" persistent-hint row>
                      <v-radio label="企业承租" value="企业"></v-radio>
                      <v-radio label="个人承租" value="个人"></v-radio>
                    </v-radio-group>
                  </v-flex> -->
                  <v-layout row wrap v-if="newCTRT.customerType=='企业'">
                    <v-flex xs12 sm4><v-text-field v-model="newCTRT.companyName" :rules="[$store.state.rules.required]" label="承租方公司" hint="" persistent-hint box required></v-text-field></v-flex>
                    <v-flex xs12 sm4><v-text-field v-model="newCTRT.businessLicense" :rules="[$store.state.rules.required]" label="承租方营业执照" hint="" persistent-hint box required></v-text-field></v-flex>
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
                    <v-flex xs12 sm6><v-text-field v-model="newCTRT.intermediator" :rules="[$store.state.rules.required]" label="经纪人姓名" hint="" persistent-hint box required></v-text-field></v-flex>
                    <v-flex xs12 sm6><v-text-field v-model="newCTRT.idCode" :rules="[$store.state.rules.required]" mask="#################N" label="经纪人身份证" hint="" persistent-hint box required></v-text-field></v-flex>
                    <v-flex xs12 sm6><v-text-field v-model="newCTRT.intermediatorTel" :rules="[$store.state.rules.required]" mask="(+##)###-####-####" label="经纪人联系方式" hint="" persistent-hint box required></v-text-field></v-flex>
                    <v-flex xs12 sm6><v-text-field v-model="newCTRT.agency" :rules="[$store.state.rules.required]" label="经纪人公司" hint="" persistent-hint box required></v-text-field></v-flex>
                  </v-layout>
                </v-container>
                <v-btn @click.native="nextStep($refs.peopleForm)" color="primary" depressed>继续添加房源</v-btn>
              </v-form>
            </v-stepper-content>
            <v-stepper-step :rules="[() => !!formValid[1]]" :complete="stepNum>2" step="2">
              添加租赁房屋及租赁信息
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
                        <v-text-field slot="activator" :rules="[$store.state.rules.required]" :value="assets.buildingName" label="签约楼宇" :hint="assets.parkName" persistent-hint box required readonly></v-text-field>
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
                        <v-text-field slot="activator" @click="getHouse(assets.buildingId)" :disabled="!assets.buildingName" :rules="[$store.state.rules.required]" :value="assets.doorNumber ? `${assets.doorNumber}室 - ${assets.floorNumber}层` : ''" label="签约房源" :hint="assets.availableDate?`${assets.buildArea}M²&nbsp;最早${getDay(assets.availableDate, 0)}可租`:''" persistent-hint box required readonly></v-text-field>
                        <v-list style="max-height: 200px; overflow-y: auto;">
                          <v-list-tile v-if="!assetsFloorInfo.length">
                            <v-list-tile-title>暂无房源可以添加</v-list-tile-title>
                          </v-list-tile>
                          <v-menu v-else v-for="(assetsFloor, i) in assetsFloorInfo" :key="i" offset-x style="display:block">
                            <v-list-tile slot="activator" @click="1">
                              <v-list-tile-title>{{ assetsFloor.floorNumber }}层</v-list-tile-title>
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
                    <v-flex xs6 sm3 style="min-width: 150px;"><v-text-field v-model="assets.price" :disabled="!assets.houseId" :rules="[$store.state.rules.required, $store.state.rules.noZero, $store.state.rules.greaterThanZero]" label="每平日价(元)" :hint="assets.buildArea ? `首年约${parseInt(30 * assets.price * assets.buildArea)}元/30天` : ''" persistent-hint type="number" box required></v-text-field></v-flex>
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
                    <v-flex xs12 sm9><v-text-field v-model="newCTRT.address" :rules="[$store.state.rules.required]" label="合同签署地址" hint="" persistent-hint box required></v-text-field></v-flex>
                    <v-flex xs12 sm3>
                      <v-menu :close-on-content-click="false" v-model="menu.signingDate" offset-y lazy>
                        <v-text-field slot="activator" v-model="newCTRT.signingDate" :rules="[$store.state.rules.required]" label="签订日期" hint="仅可选择上个月后的日期" persistent-hint box required readonly></v-text-field>
                        <v-date-picker v-model="newCTRT.signingDate" :min="getDay(new Date(), -30)" :first-day-of-week="0" show-current locale="zh-cn" @input="menu.signingDate = false"></v-date-picker>
                      </v-menu>
                    </v-flex>
                    <v-flex xs12 sm3>
                      <v-menu :close-on-content-click="false" v-model="menu.startDate" :disabled="!newCTRT.signingDate" offset-y lazy>
                        <v-text-field slot="activator" v-model="newCTRT.startDate" :rules="[$store.state.rules.required]" :disabled="!newCTRT.signingDate" label="记租开始日期" hint="" persistent-hint box required readonly></v-text-field>
                        <v-date-picker v-model="newCTRT.startDate" :min="newCTRT.signingDate" :first-day-of-week="0" show-current locale="zh-cn" @input="menu.startDate = false"></v-date-picker>
                      </v-menu>
                    </v-flex>
                    <v-flex xs12 sm3>
                      <v-menu :close-on-content-click="false" v-model="menu.endDate" :disabled="!newCTRT.startDate" offset-y lazy>
                        <v-text-field slot="activator" v-model="newCTRT.endDate" :rules="[$store.state.rules.required]" :disabled="!newCTRT.startDate" label="记租结束日期" hint="" persistent-hint box required readonly></v-text-field>
                        <v-date-picker v-model="newCTRT.endDate" :min="newCTRT.startDate" :first-day-of-week="0" show-current locale="zh-cn" @input="menu.endDate = false"></v-date-picker>
                      </v-menu>
                    </v-flex>
                    <v-flex xs12 sm3><v-text-field v-model="newCTRT.beforeFree" :rules="[$store.state.rules.required, $store.state.rules.greaterThanZero]" :disabled="!newCTRT.startDate" label="记租开始前免租(天)" :hint="beforeFreeHint" persistent-hint type="number" box required></v-text-field></v-flex>
                    <v-flex xs12 sm3><v-text-field v-model="newCTRT.afterFree" :rules="[$store.state.rules.required, $store.state.rules.greaterThanZero]" :disabled="!newCTRT.endDate" label="记租结束后免租(天)" :hint="afterFreeHint" persistent-hint type="number" box required></v-text-field></v-flex>
                    <v-flex xs12 sm4>
                      <v-menu v-model="menu.houseUse" lazy offset-y nudge-top="20">
                        <v-text-field slot="activator" :rules="[$store.state.rules.required]" :value="newCTRTOther.houseUse" label="租赁用途" hint="" persistent-hint box required readonly></v-text-field>
                        <v-list style="max-height: 200px; overflow-y: auto;">
                          <v-list-tile v-for="use in houseUseInfo" :key="use" @click="newCTRTOther.houseUse=use">
                            <v-list-tile-title>{{ use }}</v-list-tile-title>
                          </v-list-tile>
                        </v-list>
                      </v-menu>
                    </v-flex>
                    <!-- <v-flex xs12 sm4><v-text-field v-model="newCTRT.rentDate" :rules="[$store.state.rules.required, $store.state.rules.greaterThanZero]" label="租金缴纳应提前(天)" hint="" persistent-hint type="number" box required></v-text-field></v-flex> -->
                    <v-flex xs12 sm4><v-text-field v-model="newCTRT.deposit" :rules="[$store.state.rules.required, $store.state.rules.greaterThanZero]" label="押金(元)" hint="合同生效后既缴纳<br />合同到期后返还" persistent-hint type="number" box required></v-text-field></v-flex>
                    <v-flex xs12 sm4><v-text-field v-model="newCTRT.liquidatedDamages" :rules="[$store.state.rules.required, $store.state.rules.greaterThanZero]" label="违约金(元)" hint="" persistent-hint type="number" box required></v-text-field></v-flex>
                    <!-- <v-flex xs12 sm4><v-text-field v-model="newCTRT.month" :rules="[$store.state.rules.required, $store.state.rules.noZero]" mask="##" label="租金缴纳间隔(月)" hint="" persistent-hint box required></v-text-field></v-flex> -->
                    <v-flex xs12 sm4>
                      <v-menu v-model="menu.month" lazy offset-y nudge-top="20">
                        <v-text-field slot="activator" :rules="[$store.state.rules.required]" :value="`每${newCTRT.month}个月`" label="租金缴纳间隔" hint="" persistent-hint box required readonly></v-text-field>
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
                  </v-layout>
                </v-container>
                <v-btn @click.native="nextStep($refs.dateForm)" color="primary" depressed>继续核对信息</v-btn>
                <v-btn @click.native="stepNum--" flat>后退</v-btn>
              </v-form>
            </v-stepper-content>
            <v-stepper-step step="4">
              请确认信息无误并提交申请
              <small>未通过的申请将出现在作废合同列表中供重新填写</small>
            </v-stepper-step>
            <v-stepper-content step="4">
              <!-- <v-data-table :items="rentDetailList" item-key="name" hide-actions hide-headers class="mb-4">
                <template slot="items" slot-scope="props">
                  <tr @click="props.expanded = !props.expanded">
                    <td>{{ props.item.name }}</td>
                    <td class="text-xs-right">{{ props.item.calories }}</td>
                    <td class="text-xs-right">{{ props.item.fat }}</td>
                    <td class="text-xs-right">{{ props.item.carbs }}</td>
                    <td class="text-xs-right">{{ props.item.protein }}</td>
                    <td class="text-xs-right">{{ props.item.iron }}</td>
                  </tr>
                </template>
                <template slot="expand" slot-scope="props">
                  <v-card flat>
                    <v-card-text>Peek-a-boo!</v-card-text>
                  </v-card>
                </template>
              </v-data-table> -->
              <v-btn :disabled="formValid.reduce((all, el) => all && el)" @click.native="submitContract(true)" color="primary" depressed>确认无误并提交</v-btn>
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
      invalidated: { title: "续签作废合同", to: "contract/viewCancelContract" },
      refunded: { title: "续签退租合同", to: "contract/viewThrowALease" },
      expired: { title: "续签到期合同", to: "contract/view" }
    },
    stepNum: 1,
    formValid: [true, true, true, true],
    assetsInfo: [],
    assetsFloorInfo: [],
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
      intermediator: "",
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
      liquidatedDamages: 0
    },
    newCTRTOther: {
      increaseType: 0,
      increaseRate: 3,
      houseUse: ""
    },
    newAssets: [],
    defaultAssets: {
      parkId: "",
      parkName: "",
      buildingId: "",
      buildingName: "",
      houseId: "",
      floorNumber: "",
      doorNumber: "",
      buildArea: 0,
      price: 10,
      houseType: 1,
      availableDate: ""
    },
    rentDetailList: [
      {
        value: false,
        name: "Frozen Yogurt",
        calories: 159,
        fat: 6.0,
        carbs: 24,
        protein: 4.0,
        iron: "1%"
      },
      {
        value: false,
        name: "Ice cream sandwich",
        calories: 237,
        fat: 9.0,
        carbs: 37,
        protein: 4.3,
        iron: "1%"
      },
      {
        value: false,
        name: "Eclair",
        calories: 262,
        fat: 16.0,
        carbs: 23,
        protein: 6.0,
        iron: "7%"
      }
    ],
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
    houseUseInfo: ["办公", "餐饮", "娱乐"],
    menu: {
      companyIndustry: false,
      houseUse: false,
      signingDate: false,
      startDate: false,
      endDate: false,
      month: false,
      increaseType: false
    },
    rules: {
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
    this.getPark();
    this.$route.query.newType == "new"
      ? this.addNewAssets({})
      : this.initialize();
  },
  methods: {
    initialize() {
      this.networkLoading = true;
      this.networkError = null;
      this.$http
        .get(`/cms/${this.CTRTInfoURL[this.$route.query.newType].to}.json`, {
          params: {
            id: this.$route.query.renewId
          }
        })
        .then(res => {
          this.networkLoading = false;
          let resData = res.data.data;
          let resDataAssets = resData.houseAndBuildingDtos;
          // 改变newCTRT
          Object.assign(
            this.newCTRT,
            _.omit(resData, [
              "id",
              "contractRentTotalDto",
              "houseAndBuildingDtos",
              "signingDate",
              "startDate",
              "endDate",
              "partyB",
              "createTime"
            ])
          );
          // 改变newCTRTOther
          this.newCTRTOther = {
            increaseType: resDataAssets[0].increaseType,
            increaseRate: resDataAssets[0].increaseRate,
            houseUse: resDataAssets[0].houseUse
          };
          // 改变newAssets
          resDataAssets.map(item => {
            this.addNewAssets(item);
          });
        })
        .catch(err => {
          this.networkLoading = false;
          this.networkError = err;
          this.addSnackBar("合同详情查询失败 请检查网络后刷新", "error");
        });
    },
    getPark() {
      this.$http
        .post("/cms/AssetsInfo/park.json")
        .then(res => {
          let resData = res.data.data;
          resData = resData && resData.length ? resData : [];
          // 将List形式的数据转换为Tree形式并存入assetsInfo
          let parkInfo = [];
          resData.forEach(item => {
            if (item.parkId === null) {
              item.parkId = 0;
              item.parkName = "无归属楼宇";
            }
            if (!parkInfo[item.parkId]) {
              parkInfo[item.parkId] = {
                parkId: item.parkId,
                parkName: item.parkName,
                building: []
              };
            }
            parkInfo[item.parkId].building.push({
              buildingId: item.buildingId,
              buildingName: item.buildingName
            });
          });
          this.assetsInfo = parkInfo.filter(el => el);
        })
        .catch(() => this.addSnackBar("楼宇信息查询失败", "error"));
    },
    changeBuilding(assetsIndex, assetsPark, assetsBuilding) {
      // 关闭菜单
      this.newAssets[assetsIndex].buildingMenu = false;
      // 将assetsFloorInfo置空
      this.assetsFloorInfo = [];
      // 若楼宇ID改变
      if (this.newAssets[assetsIndex].buildingId != assetsBuilding.buildingId) {
        // 改变表单中楼宇信息
        Object.assign(this.newAssets[assetsIndex], this.defaultAssets, {
          parkId: assetsPark.parkId,
          parkName: assetsPark.parkName,
          buildingId: assetsBuilding.buildingId,
          buildingName: assetsBuilding.buildingName
        });
      }
    },
    getHouse(assetsBuildingId) {
      // 将assetsFloorInfo置空
      this.assetsFloorInfo = [];
      // 请求楼宇下房屋列表
      this.$http
        .post("/cms/AssetsInfo/building.json", {
          buildingId: assetsBuildingId
        })
        .then(res => {
          let resData = res.data.data;
          resData = resData && resData.length ? resData : [];
          // 将List形式的数据转换为Tree形式并存入assetsFloorInfo
          let floorInfo = [];
          resData.forEach(resDataItem => {
            if (!floorInfo[resDataItem.floorNumber]) {
              floorInfo[resDataItem.floorNumber] = {
                floorNumber: resDataItem.floorNumber,
                house: []
              };
            }
            floorInfo[resDataItem.floorNumber].house.push({
              isAdded: (resDataItem => {
                let isAdded = false;
                this.newAssets.map(el => {
                  if (resDataItem.houseId == el.houseId) {
                    isAdded = true;
                  }
                });
                return isAdded;
              })(resDataItem),
              houseId: resDataItem.houseId,
              doorNumber: resDataItem.doorNumber
            });
          });
          this.assetsFloorInfo = floorInfo.filter(el => el);
        })
        .catch(() => this.addSnackBar("楼宇所含房源信息查询失败", "error"));
    },
    changeHouse(assetsIndex, assetsFloor, assetsHouse) {
      let newAssetsData = this.newAssets[assetsIndex];
      // 关闭菜单
      newAssetsData.houseMenu = false;
      // 若房源ID改变
      if (newAssetsData.houseId != assetsHouse.houseId) {
        // 将newAssets的房源信息置空并改变表单中楼宇信息
        Object.assign(newAssetsData, {
          houseId: assetsHouse.houseId,
          floorNumber: assetsFloor.floorNumber,
          doorNumber: assetsHouse.doorNumber,
          buildArea: 0,
          price: 10,
          houseType: 1,
          availableDate: ""
        });
        // 请求该楼宇下房屋信息
        this.$http
          .post("/cms/AssetsInfo/house.json", {
            houseId: assetsHouse.houseId
          })
          .then(res => {
            let resData = res.data.data[0];
            if (resData) {
              Object.assign(newAssetsData, {
                buildArea: resData.buildArea,
                price: resData.price,
                houseType: resData.houseType,
                availableDate: resData.availableDate
              });
            }
          })
          .catch(() => this.addSnackBar("房源信息查询失败", "error"));
      }
    },
    addNewAssets(Obj) {
      this.newAssets.push(Object.assign({}, this.defaultAssets, Obj));
    },
    deleteNewAssets(index) {
      this.newAssets.splice(index, 1);
    },
    getDay(date, day) {
      let time = new Date(
        new Date(date).getTime() + parseInt(day) * 24 * 60 * 60 * 1000
      );
      return `${time.getFullYear()}-${_.padStart(
        time.getMonth() + 1,
        2,
        0
      )}-${_.padStart(time.getDate(), 2, 0)}`;
    },
    nextStep(el) {
      el.validate();
      this.stepNum++;
    },
    submitContract(isSummit) {
      let CTRTData = Object.assign(
        {
          contractState: isSummit ? "待审核" : "待提交",
          contractHouseDtos: this.newAssets.map(item => ({
            houseId: item.houseId,
            rent: item.price,
            increaseType: this.newCTRTOther.increaseType,
            increaseRate: this.newCTRTOther.increaseRate / 100,
            houseUse: this.newCTRTOther.houseUse,
            type: "房屋"
          }))
        },
        (() =>
          this.$route.query.newType == "editing"
            ? {
                contractId: Number(this.$route.query.renewId),
                exContractNo: this.newCTRT.exContractNo
              }
            : {
                exContractNo: Number(this.$route.query.renewId) || null
              })(),
        this.newCTRT
      );
      console.log(CTRTData);
      let submitUrl =
        this.$route.query.newType == "editing"
          ? "modifyUnSubmit"
          : "addContract";
      if (this.formValid.reduce((all, el) => all && el)) {
        this.$http
          .post(`/cms/contractSub/${submitUrl}.json`, CTRTData)
          .then(res => {
            if (res.data.code == 0) {
              if (!isSummit) {
                this.addSnackBar("新合同已保存成功 可稍后编辑", "success");
                if (isSummit) this.$router.push({});
              } else {
                this.addSnackBar("新合同已提交成功 即将开始审核", "success");
              }
            } else {
              this.addSnackBar(`合同提交错误: ${res.data.meg}`, "error");
            }
          })
          .catch(() =>
            this.addSnackBar("新合同提交出现错误 请检查网络后重试", "error")
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

.contract-new {
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

  .new-stepper {
    max-width: 800px;
    background: #f5f5f5;
  }
}
</style>
