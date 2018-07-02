<template>
  <div class="fill-height water-list">
    <view-tool-bar>
      <span slot="bar-menu">
        <v-btn :to="{ name: 'water-new' }" depressed color="primary">添加水费账单</v-btn>
        <v-btn icon>
          <v-icon>help</v-icon>
        </v-btn>
      </span>
      <span slot="bar-extend">
        <v-tabs color="primary" class="px-4" show-arrows>
          <v-tab v-for="tab in viewToolBarTab" :key="tab.value" :to="tab.to">{{ tab.name }}</v-tab>
        </v-tabs>
      </span>
    </view-tool-bar>
		<v-jumbotron height="auto">
			<v-container grid-list-xl fill-height>
				<v-layout align-start align-content-start justify-center wrap>
					<v-flex xs12 xl10>
						<v-subheader>代缴水费账单</v-subheader>
						<v-card>
							<v-data-table
								:no-data-text="networkError?`网络出现异常 - 检查网络后刷新重试`:`暂无记录`"
								:no-results-text="`没能找到“${ search }”的结果...`"
								:search="search"
								:headers="headers"
								:loading="networkLoading"
								:items="contractList"
								item-key="id"
							>
								<v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
								<template slot="items" slot-scope="props">
									<td>{{ props.item.contractNo }}</td>
									<td>{{ props.item.contractName }}</td>
									<td>{{ props.item.companyName }}</td>
									<td>{{ props.item.signedPersonA }}</td>
									<td>{{ props.item.signingDate.slice(0, 10) }}</td>
									<td>{{ props.item.startDate.slice(0, 10) }}</td>
									<td>{{ props.item.endDate.slice(0, 10) }}</td>
									<td class="px-3">
										<v-btn icon class="mx-0" :to="{ query: { detailType: $route.name, detailId: props.item.id } }">
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
    viewToolBarTab: [
      {
        name: "代缴水费账单",
        to: {
          name: "water-list"
        }
      },
      {
        name: "已缴水费账单",
        to: {
          name: "water-list"
        }
      }
    ],
    networkLoading: false,
    networkError: false,
    search: "",
    headers: [
      { text: "合同编号", value: "contractNo", sortable: false },
      { text: "合同名", value: "contractName" },
      { text: "承租方", value: "companyName" },
      { text: "甲方签订人", value: "signedPersonA" },
      { text: "签订日期", value: "signingDate" },
      { text: "计租日期", value: "startDate" },
      { text: "到期日期", value: "endDate" },
      { text: "操作", value: "id", align: "center", sortable: false }
    ],
    contractList: []
  }),
  created() {
    this.$store.commit("changeToolBarTitle", { title: "水费管理" });
    this.initialize();
  },
  methods: {
    initialize() {
      this.networkLoading = true;
      this.$http
        .post("/cms/contract/cancelList.json")
        .then(res => {
          this.networkLoading = false;
          let resData = res.data.data;
          this.contractList = resData && resData.length ? resData : [];
        })
        .catch(() => {
          this.networkLoading = false;
          this.networkError = true;
        });
    }
  }
};
</script>
