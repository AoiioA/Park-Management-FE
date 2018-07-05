<template>
  <div class="fill-height point-detail">
    <view-tool-bar>
      <span slot="bar-menu">
        <v-dialog :disabled="networkLoading || networkError || !parkInfo" v-model="menu.newDialog" max-width="500px" persistent>
          <v-btn slot="activator" :disabled="networkLoading || networkError || !parkInfo" color="primary" depressed>编辑园区</v-btn>
          <v-form ref="newParkForm" v-model="newParkValid" lazy-validation>
            <v-card>
              <v-card-title primary-title>
                <span class="headline">编辑园区</span>
                <v-spacer></v-spacer>
                <v-dialog v-model="menu.delDialog" persistent max-width="290">
                  <v-btn slot="activator" flat color="error">删除园区</v-btn>
                  <v-card>
                    <v-card-title class="headline">确认删除园区?</v-card-title>
                    <v-card-text>删除园区前请先移除该园区所含资源。</v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="primary" flat @click.native="menu.delDialog = false">再看看</v-btn>
                      <v-btn color="error" flat @click.native="delPark">我确认</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-card-title>
              <v-card-text class="pt-0">
                <v-container grid-list-md class="pa-0">
                  <v-layout wrap>
                    <v-flex xs12><v-text-field v-model="editedPark.parkName" :rules="[$store.state.rules.required]" label="园区名称" hint="如 : 望京园区" persistent-hint required></v-text-field></v-flex>
                    <v-flex xs12><v-text-field v-model="editedPark.address" :rules="[$store.state.rules.required]" label="详细地址" hint="省市区县不可更换" persistent-hint required></v-text-field></v-flex>
                    <v-flex xs6 sm3><v-text-field v-model="editedPark.floorArea" :rules="[$store.state.rules.noZero, $store.state.rules.nonnegative]" label="占地面积(m²)" type="number"></v-text-field></v-flex>
                    <v-flex xs6 sm3><v-text-field v-model="editedPark.constructionArea" :rules="[$store.state.rules.noZero, $store.state.rules.nonnegative]" label="建筑面积(m²)" type="number"></v-text-field></v-flex>
                    <v-flex xs6 sm3><v-text-field v-model="editedPark.greeningRate" :rules="[$store.state.rules.nonnegative, rules.lessThen(100)]" label="绿化率(%)" type="number"></v-text-field></v-flex>
                    <v-flex xs6 sm3><v-text-field v-model="editedPark.volumeRate" :rules="[$store.state.rules.nonnegative, rules.lessThen(100)]" label="容积率(%)" type="number"></v-text-field></v-flex>
                    <v-flex xs12><v-textarea v-model="editedPark.environment" label="环境描述"></v-textarea></v-flex>
                  </v-layout>
                  <small class="red--text text--accent-2">*&nbsp;标记为必填项</small>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn depressed @click="newParkClose(true)">取消操作</v-btn>
                <v-btn :disabled="!newParkValid" @click="newParkSave" depressed color="primary">确认修改</v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-dialog>
      </span>
    </view-tool-bar>
    <v-jumbotron height="auto">
      <v-progress-linear v-if="networkLoading" indeterminate class="my-0"></v-progress-linear>
      <v-alert v-else-if="networkError" :value="true" type="error">网络出现异常 - 检查网络后刷新重试</v-alert>
      <v-container v-else grid-list-xl fluid fill-height>
        <v-layout justify-center wrap>
          <v-flex xs12 sm10 md4 xl2>
            <v-subheader>园区基础信息</v-subheader>
            <v-card>
              <!-- <v-card-title></v-card-title>
              <v-divider></v-divider> -->
              <v-list dense>
                <v-list-tile>
                  <v-list-tile-content>省市区县 : </v-list-tile-content>
                  <v-list-tile-content class="align-end">{{ `${parkInfo.province} ${parkInfo.city} ${parkInfo.district}` }}</v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>详细地址 : </v-list-tile-content>
                  <v-list-tile-content class="align-end">{{ parkInfo.address }}</v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>占地面积 : </v-list-tile-content>
                  <v-list-tile-content class="align-end">{{ parkInfo.floorArea }}m²</v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>建筑面积 : </v-list-tile-content>
                  <v-list-tile-content class="align-end">{{ parkInfo.constructionArea }}m²</v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>绿化率 : </v-list-tile-content>
                  <v-list-tile-content class="align-end">{{ parkInfo.greeningRate }}%</v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>容积率 : </v-list-tile-content>
                  <v-list-tile-content class="align-end">{{ parkInfo.volumeRate }}%</v-list-tile-content>
                </v-list-tile>
                <v-flex class="px-3" style="text-align: justify;">{{ parkInfo.environment }}</v-flex>
              </v-list>
            </v-card>
          </v-flex>
          <v-flex xs12 sm10 md8 xl8>
            <v-subheader>园区所含楼宇</v-subheader>
            <v-card>
              <v-data-table
                :search="search"
                :headers="headers"
                :items="buildingInfoArr"
                item-key="buildingId"
                :loading="networkLoading"
                :no-data-text="networkError?`网络出现异常 - 检查网络后刷新重试`:`暂无记录`"
                :no-results-text="`没能找到“${ search }”的结果...`"
              >
                <template slot="items" slot-scope="props">
                  <td>{{ props.item.buildingName }}</td>
                  <td>{{ `${props.item.province} ${props.item.city} ${props.item.district}` }}</td>
                  <td>{{ props.item.constructionArea }}m²</td>
                  <td>{{ props.item.vacancyRate }}%</td>
                  <!-- <td>{{ props.item.createDate.slice(0, 10) }}</td> -->
                  <td class="px-3">
                    <v-btn icon class="mx-0" :to="{ name: 'building-detail', params: { buildingNo: props.item.buildingNo, buildingDetailType: 'area' } }">
                      <v-icon color="primary">visibility</v-icon>
                    </v-btn>
                  </td>
                </template>
              </v-data-table>
            </v-card>
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
    networkError: null,
    rules: {
      lessThen: num => val => parseFloat(val) <= num || `该项需小于${num}`
    },
    menu: {
      newDialog: false,
      delDialog: false
    },
    select: {
      provinceInfoArr: [],
      cityInfoArr: [],
      districtInfoArr: []
    },
    newParkValid: true,
    editedPark: {
      parkName: "",
      province: "",
      city: "",
      district: "",
      address: "",
      floorArea: "",
      constructionArea: "",
      greeningRate: "",
      volumeRate: "",
      environment: ""
    },
    defaultPark: {
      parkName: "",
      province: "",
      city: "",
      district: "",
      address: "",
      floorArea: "",
      constructionArea: "",
      greeningRate: "",
      volumeRate: "",
      environment: ""
    },
    parkInfo: {},
    buildingInfoArr: [],
    parkDataInfo: {},
    search: "",
    headers: [
      { text: "楼宇名称", value: "buildingName" },
      { text: "省市区", value: "city" },
      { text: "建筑面积", value: "constructionArea" },
      { text: "空置率", value: "vacancyRate" },
      // { text: "创建日期", value: "createDate" },
      { text: "操作", value: "houseNo", sortable: false }
    ]
  }),
  created() {
    this.$store.commit("changeToolBarTitle", {
      title: "园区详情",
      isBack: true,
      crumbs: [
        { name: "园区概览", to: { name: "park-list" } },
        { name: "园区详情" }
      ]
    });
    this.initialize();
  },
  methods: {
    initialize() {
      this.networkLoading = true;
      this.networkError = null;
      this.parkInfo = {};
      this.buildingInfoArr = [];
      this.$http
        .all([
          this.$http.post("/cms/parkInfo/listParkInfo.json", {
            parkNo: Number(this.$route.params.parkNo)
          }),
          this.$http.post("/cms/parkInfo/listBuildingInfoByParkNo.json", {
            parkNo: Number(this.$route.params.parkNo)
          }),
          this.$http.post("/cms/AssetsInfo/queryParkAssetsStatistics.json", {
            parkNo: Number(this.$route.params.parkNo)
          })
        ])
        .then(
          this.$http.spread((park, building, parkData) => {
            this.networkLoading = false;
            if (park.data.code == 500) {
              throw new Error(park.data.msg);
            }
            if (building.data.code == 500) {
              throw new Error(building.data.msg);
            }
            if (parkData.data.code == 500) {
              throw new Error(parkData.data.msg);
            }
            let pData = park.data.data;
            let bData = building.data.data;
            this.parkInfo = pData && pData.length ? pData[0] : {};
            this.buildingInfoArr = bData && bData.length ? bData : [];
            this.parkDataInfo = parkData.data.data;
            for (let key in this.parkInfo) {
              if (this.defaultPark.hasOwnProperty(key)) {
                this.defaultPark[key] = this.parkInfo[key];
              }
            }
            this.editedPark = Object.assign({}, this.defaultPark);
            this.$store.commit("changeToolBarTitle", {
              title: this.parkInfo.parkName,
              isBack: true,
              crumbs: [
                { name: "园区概览", to: { name: "park-list" } },
                { name: "园区详情" }
              ]
            });
          })
        )
        .catch(err => {
          this.networkLoading = false;
          this.networkError = true;
          this.$store.commit("addSnackBar", `园区查询失败 ${err}`, "error");
        });
    },
    newParkClose(isCancel) {
      if (!isCancel || confirm("取消后内容将不会保存")) {
        // this.$refs.newParkForm.reset();
        this.menu.newDialog = false;
        this.editedPark = Object.assign({}, this.defaultPark);
      }
    },
    newParkSave() {
      if (this.$refs.newParkForm.validate()) {
        this.$http
          .post(
            "/cms/parkInfo/updateParkInfo.json",
            Object.assign(
              {
                parkId: this.parkInfo.parkId,
                parkNo: this.parkInfo.parkNo
              },
              this.editedPark
            )
          )
          .then(res => {
            if (res.data.code != 500) {
              this.newParkClose(false);
              this.$store.commit("addSnackBar", "园区编辑成功", "success");
              let Idd;
              this.$http
                .post("/cms/parkInfo/listParkInfo.json", {})
                .then(res => {
                  Idd = res.data.data.find(
                    item => item.parkNo == this.parkInfo.parkNo
                  ).parkId;
                  this.$router.replace({
                    name: "park-detail",
                    params: { parkNo: this.parkInfo.parkNo },
                    query: { parkId: Idd }
                  });
                  this.initialize();
                });
            } else {
              this.$store.commit(
                "addSnackBar",
                `园区编辑失败 ${res.data.msg}`,
                "error"
              );
            }
          })
          .catch(err => {
            this.$store.commit("addSnackBar", `园区编辑失败 ${err}`, "error");
          });
      }
    },
    delPark() {
      this.$http
        .post(
          `/cms/parkInfo/deleteParkInfo.json?parkNos=${this.parkInfo.parkNo}`
        )
        .then(res => {
          if (res.data.code != 500) {
            this.$store.commit("addSnackBar", "园区删除成功", "success");
            this.$router.replace({
              name: "park-list"
            });
          }
        })
        .catch(err =>
          this.$store.commit("addSnackBar", `园区删除失败${err}`, "error")
        );
    }
  }
};
</script>

<style lang="stylus" scoped>
.no-data {
  height: 400px;
  line-height: 400px;
  text-align: center;
}
</style>
