<template>
  <v-jumbotron height="auto">
    <v-progress-linear v-if="networkLoading" indeterminate class="my-0"></v-progress-linear>
    <v-alert v-else-if="networkError" :value="true" type="error">网络出现异常 - 检查网络后刷新重试</v-alert>
    <v-container v-else grid-list-xl>
      <v-layout justify-center align-center>
        <v-flex xs12 sm10>
          <v-subheader>
            <h3>
              {{ `${((n)=>{return n>=0?n:'地下'+Math.abs(n)})(houseInfo.floorNumber)}层&nbsp;${houseInfo.doorNumber}室` }}<br />
              <small v-if="buildingInfo.parkId">{{ `${buildingInfo.parkName} - ` }}</small>
              <small>{{ buildingInfo.buildingName }}</small>
            </h3>
            <v-spacer></v-spacer>
            <v-tooltip bottom>
              <v-btn
                slot="activator"
                :disabled="houseInfo.resourceStatus!==0"
                :to="{ 'name': 'house-new', 'query': { 'editHouseNo': houseNo } }"
                flat
                color="primary"
                class="mx-0"
              >编辑房源</v-btn>
              <span>空置状态才可编辑</span>
            </v-tooltip>
            <v-dialog :disabled="houseInfo.resourceStatus!==0" v-model="menu.delDialog" persistent max-width="290">
              <v-btn slot="activator" :disabled="houseInfo.resourceStatus!==0" flat color="error" class="mx-0">删除房源</v-btn>
              <v-card>
                <v-card-title class="headline">确认删除房源?</v-card-title>
                <v-card-text>请您谨慎进行此操作。</v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" flat @click.native="menu.delDialog = false">再看看</v-btn>
                  <v-btn color="error" flat @click.native="delHouse">我确认</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-subheader>
        </v-flex>
      </v-layout>
      <v-layout justify-center wrap>
        <v-flex xs12 sm10>
          <v-layout wrap>
            <v-flex xs6 sm3>
              <v-card>
                <v-container fluid>
                  <div class="mb-1">房源状态</div>
                  <p class="subheading text-xs-center">{{ houseInfo.resourceStatus==0?`已闲置${houseInfo.idleDays}天`:houseStatus[houseInfo.resourceStatus] }}</p>
                </v-container>
              </v-card>
            </v-flex>
            <v-flex xs6 sm3>
              <v-card>
                <v-container fluid>
                  <div class="mb-1">建筑面积</div>
                  <p class="subheading text-xs-center"><span class="title">{{ houseInfo.buildArea }}</span><span class="caption">m²</span></p>
                </v-container>
              </v-card>
            </v-flex>
            <v-flex xs6 sm3>
              <v-card>
                <v-container fluid>
                  <div class="mb-1">租金单价</div>
                  <p class="subheading text-xs-center"><span class="title">{{ houseInfo.price}}</span><span class="caption">{{`${["元/m²·天"][houseInfo.priceUnit]}` }}</span></p>
                </v-container>
              </v-card>
            </v-flex>
            <v-flex xs6 sm3>
              <v-card>
                <v-container fluid>
                  <div class="mb-1">装修情况</div>
                  <p class="subheading text-xs-center">{{ decorationInfo[houseInfo.decorationSituation] }}</p>
                </v-container>
              </v-card>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs12 sm5>
          <v-subheader>基础信息</v-subheader>
          <v-card height="328px">
            <!-- <v-card-title></v-card-title>
            <v-divider></v-divider> -->
            <v-list dense>
              <v-list-tile>
                <v-list-tile-content>建筑面积:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ houseInfo.buildArea }}m²</v-list-tile-content>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-content>可容纳人数:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ houseInfo.accommodatingNumber }}人</v-list-tile-content>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-content>房源朝向:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ houseInfo.orientation }}</v-list-tile-content>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-content>使用率:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ houseInfo.usageRate }}%</v-list-tile-content>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-content>装修情况:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ decorationInfo[houseInfo.decorationSituation] }}</v-list-tile-content>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-content>办公家具:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ `${houseInfo.isOfficeFurniture?'含':'不含'}办公家具` }}</v-list-tile-content>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-content>消防手续:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ `${houseInfo.isFireProcedure?'已有':'暂无'}消防手续` }}</v-list-tile-content>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-content>创建日期:</v-list-tile-content>
                <v-list-tile-content v-if="houseInfo.createDate" class="align-end">{{ houseInfo.createDate.slice(0, 10) }}</v-list-tile-content>
              </v-list-tile>
              <!-- <v-layout>
                <v-flex><v-checkbox :label="`${houseInfo.isDecoration?'可':'不可'}自行装修`" :input-value="Boolean(houseInfo.isDecoration)" value></v-checkbox></v-flex>
                <v-flex><v-checkbox :label="`${houseInfo.isOfficeFurniture?'含':'不含'}办公家具`" :input-value="Boolean(houseInfo.isOfficeFurniture)" value></v-checkbox></v-flex>
                <v-flex><v-checkbox :label="`${houseInfo.isRegister?'已':'暂无'}注册`" :input-value="Boolean(houseInfo.isRegister)" value></v-checkbox></v-flex>
                <v-flex><v-checkbox :label="`${houseInfo.isFireProcedure?'已有':'暂无'}消防手续`" :input-value="Boolean(houseInfo.isFireProcedure)" value></v-checkbox></v-flex>
              </v-layout> -->
            </v-list>
          </v-card>
        </v-flex>
        <v-flex xs12 sm5>
          <v-subheader>租赁信息</v-subheader>
          <v-card height="328px">
            <!-- <v-card-title></v-card-title>
            <v-divider></v-divider> -->
            <v-list dense>
              <v-list-tile>
                <v-list-tile-content>房源类型:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ ["整租", "工位"][houseInfo.houseType] }}</v-list-tile-content>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-content>房源租价:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ `${houseInfo.price}${["元/m²·天"][houseInfo.priceUnit]}` }}</v-list-tile-content>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-content>物业费:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ houseInfo.propertyFee }}元/m²·天</v-list-tile-content>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-content>房源状态:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ houseInfo.resourceStatus==0?`已闲置${houseInfo.idleDays}天`:houseStatus[houseInfo.resourceStatus] }}</v-list-tile-content>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-content>自行装修:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ `${houseInfo.isDecoration?'可':'不可'}自行装修` }}</v-list-tile-content>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-content>注册情况:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ `${houseInfo.isRegister?'可':'不可'}注册` }}</v-list-tile-content>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-content>备注:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ houseInfo.remark }}</v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-jumbotron>
</template>

<script>
export default {
  name: "house-info-detail",
  props: ["houseNo"],
  data: () => ({
    menu: {
      delDialog: false
    },
    networkLoading: false,
    networkError: null,
    houseStatus: ["空置", "租赁中", "预定", "维护", "租赁审核"],
    decorationInfo: ["毛坯", "简装修", "中等装修", "豪华装修", "精装修"],
    houseInfo: {
      // 建筑信息
      parkId: "",
      parkName: "",
      buildingId: "",
      buildingName: "",
      floorNumber: "",
      doorNumber: "",
      orientation: "",
      buildArea: "",
      usageRate: "",
      accommodatingNumber: "",
      decorationSituation: "",
      isDecoration: 1,
      isOfficeFurniture: 1,
      isRegister: 1,
      isFireProcedure: 1,
      // 财务信息
      houseType: "",
      price: "",
      priceUnit: "",
      propertyFee: "",
      remark: ""
    },
    buildingInfo: {}
  }),
  created() {
    this.initialize();
    this.$store.commit("changeToolBarTitle", {
      title: "房源详情",
      isBack: true,
      crumbs: [
        { name: "房源概览", to: { name: "house-search" } },
        { name: "房源详情" }
      ]
    });
  },
  methods: {
    initialize() {
      this.networkLoading = true;
      this.networkError = null;
      this.houseInfo = {};
      this.buildingInfo = {};
      this.$http
        .all([
          this.$http.post("/cms/houseInfo/queryHouseInfoByHouseNo.json", {
            houseNo: Number(this.houseNo)
          }),
          this.$http.post("/cms/AssetsInfo/park.json")
        ])
        .then(
          this.$http.spread((houseRes, buildingRes) => {
            if (houseRes.data.code == 500 || !houseRes.data.data) {
              this.networkError = true;
              throw new Error(houseRes.data.msg);
            }
            if (buildingRes.data.code == 500 || !buildingRes.data.data) {
              this.networkError = true;
              throw new Error(buildingRes.data.msg);
            }
            this.houseInfo = houseRes.data.data;
            this.buildingInfo = buildingRes.data.data.find(
              item => item.buildingNo == this.houseInfo.buildingNo
            );
            this.$store.commit("changeToolBarTitle", {
              title: `${this.houseInfo.doorNumber}`,
              isBack: true,
              crumbs: [
                { name: "房源概览", to: { name: "house-search" } },
                { name: "房源详情" }
              ]
            });
          })
        )
        .catch(err => {
          this.networkError = true;
          this.$store.commit("addErrorBar", `房源查询失败 ${err}`);
        })
        .finally(() => (this.networkLoading = false));
    },
    delHouse() {
      this.$http
        .post(
          `/cms/houseInfo/batchDelHouseInfoByHouseNo.json?houseNos=${
            this.houseInfo.houseNo
          }`
        )
        .then(res => {
          if (res.data.code != 500) {
            this.$store.commit("addSuccessBar", "房源删除成功");
            this.$router.go(-1);
          } else {
            throw new Error(res.data.msg);
          }
        })
        .catch(err => this.$store.commit("addErrorBar", `房源删除失败 ${err}`));
    }
  }
};
</script>
