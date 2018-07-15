<template>
  <div class="fill-height contract-list">
    <view-tool-bar>
      <span slot="bar-menu">
        <v-btn flat :to="{ name: 'contract-new', query: { newType: 'new' } }">添加合同</v-btn>
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
    <router-view />
  </div>
</template>

<script>
import { mapState } from "vuex";
import ViewToolBar from "@/components/ViewToolBar.vue";

export default {
  components: {
    ViewToolBar
  },
  data: () => ({
    pageInfo: {
      examine: {
        title: "合同审核",
        tabs: [
          { name: "签订审核", to: "new" },
          { name: "变更审核", to: "changed" },
          { name: "退租审核", to: "refunded" }
        ]
      },
      list: {
        title: "合同概览",
        tabs: [
          { name: "待提交", to: "editing" },
          { name: "生效中", to: "fulfilling" },
          { name: "已到期", to: "expired" }
          // { name: "已退租", to: "refunded" },
          // { name: "已变更", to: "changed" }
        ]
      }
    }
  }),
  computed: {
    viewToolBarTab() {
      for (const page in this.pageInfo) {
        if (this.$route.path.indexOf(page) != -1) {
          this.$store.commit("changeToolBarTitle", {
            title: this.pageInfo[page].title
          });
          return this.pageInfo[page].tabs.map(tab => ({
            name: tab.name,
            to: `/home/contract/${page}/${tab.to}`
          }));
        }
      }
    },
    ...mapState({})
  }
};
</script>
