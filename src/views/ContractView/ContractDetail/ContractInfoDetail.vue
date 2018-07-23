<template>
  <v-jumbotron height="auto">
    <v-container grid-list-xl fluid fill-height>
      <v-layout justify-center wrap>
        <!-- <v-flex xs12 sm52 class="subheading grey--text text--darken-1">合同明细</v-flex> -->
        <v-flex xs12 sm5>
          <v-subheader>出租方</v-subheader>
          <v-card>
            <!-- <v-card-title><h4>{{ CTRTInfo.partyA }}</h4></v-card-title>
            <v-divider></v-divider> -->
            <v-list dense style="height: 288px;">
              <v-list-tile>
                <v-list-tile-content>出租方公司:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ CTRTInfo.partyA }}</v-list-tile-content>
              </v-list-tile>
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
        <v-flex xs12 sm5>
          <v-subheader>租赁方</v-subheader>
          <v-card>
            <v-list dense style="height: 288px;">
              <v-list-tile>
                <v-list-tile-content>租赁方公司:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ CTRTInfo.companyName }}</v-list-tile-content>
              </v-list-tile>
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
        <v-flex xs12 sm5>
          <v-subheader>合同信息</v-subheader>
          <v-card>
            <v-list dense style="height: 288px;overflow: auto;">
              <v-list-tile>
                <v-list-tile-content>合同名称:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ CTRTInfo.contractName }}</v-list-tile-content>
              </v-list-tile>
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
              <v-list-tile>
                <v-list-tile-content>押金:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ CTRTInfo.deposit }}元</v-list-tile-content>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-content>违约金:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ CTRTInfo.liquidatedDamages }}元</v-list-tile-content>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-content>物业费:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ CTRTInfo.propertyFee }}元/m²·天</v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card>
        </v-flex>
        <v-flex xs12 sm5>
          <v-subheader>租赁资产</v-subheader>
          <v-card>
            <v-list dense style="height: 288px;overflow: auto;">
              <v-list-tile v-for="(house, houseIndex) in CTRTInfo.houseAndBuildingDtos" :key="houseIndex" avatar ripple>
                <v-list-tile-content>
                  <v-list-tile-title>{{ `${house.doorNumber}室` }}</v-list-tile-title>
                  <v-list-tile-sub-title>{{ `${house.parkName ? house.parkName + ' - ' : ''}${house.buildingName} ${((n)=>{return n>=0?n:'地下'+Math.abs(n)})(house.floorNumber)}层` }}</v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-list-tile-action-text>{{ house.buildArea }}m²</v-list-tile-action-text>
                  <v-list-tile-action-text>{{ house.rent.toFixed(2) }}元/m²·天</v-list-tile-action-text>
                </v-list-tile-action>
              </v-list-tile>
            </v-list>
          </v-card>
        </v-flex>
        <v-flex xs12 sm10 v-if="CTRTInfo.contractRentTotalDto">
          <v-subheader>金额明细</v-subheader>
          <v-data-table
            :headers="rentPreHeaders"
            :items="CTRTInfo.contractRentTotalDto.contractRentDetailDtoList"
            item-key="payDay"
            no-data-text="暂无租金明细"
            class="elevation-1"
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
        <v-flex xs12 sm10 v-if="CTRTInfo.rentBillListDtos">
          <v-subheader>所含交易明细</v-subheader>
          <v-data-table
            :headers="rentHeaders"
            :items="CTRTInfo.rentBillListDtos"
            item-key="id"
            no-data-text="暂无交易明细"
            class="elevation-1"
          >
            <template slot="items" slot-scope="props">
              <td v-if="props.item.rentType">{{ props.item.rentType }}</td>
              <td v-if="props.item.payDate">{{ props.item.payDate.slice(0, 10) }}</td>
              <td v-if="props.item.fromDate">{{ props.item.fromDate.slice(0, 10) }}</td>
              <td v-if="props.item.endDate">{{ props.item.endDate.slice(0, 10) }}</td>
              <td>{{ props.item.totalRent }}元</td>
              <td>{{ props.item.state }}</td>
            </template>
            <template slot="footer">
              <td colspan="100%">
                <small v-if="CTRTInfo.rentBillListDtos">金额总计 : {{ CTRTInfo.rentBillListDtos.map(el=>el.totalRent).reduce((all, el, i) => parseFloat(all) + parseFloat(el)) }}元</small>
              </td>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-container>
  </v-jumbotron>
</template>

<script>
export default {
  name: "contract-info-detail",
  data: () => ({
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
    ]
  }),
  props: {
    CTRTInfo: {
      type: Object,
      required: true
    }
  },
  created() {},
  methods: {}
};
</script>
