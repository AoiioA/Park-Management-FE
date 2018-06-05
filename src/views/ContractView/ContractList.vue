<template>
  <div class="fill-height contract-list">
    <view-tool-bar :barTab="viewToolBarTab">
      <span slot="bar-menu">
        <slot name="newContractBtn"></slot>
        <v-btn icon>
          <v-icon>help</v-icon>
        </v-btn>
      </span>
    </view-tool-bar>
    <router-view></router-view>
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
          { name: "待审核", to: "submitted" },
          { name: "新增过审", to: "new-success" },
          { name: "续签过审", to: "renew-success" },
          { name: "未过审", to: "failed" }
        ]
      },
      list: {
        title: "合同概览",
        tabs: [
          { name: "待提交", to: "editing" },
          { name: "生效中", to: "fulfilling" },
          { name: "已退租", to: "refunded" },
          { name: "已作废", to: "invalidated" },
          { name: "已到期", to: "expired" }
        ]
      }
    }
  }),
  computed: {
    viewToolBarTab() {
      for (const page in this.pageInfo) {
        if (this.$route.path.indexOf(page) != -1) {
          this.$store.commit("changeToolBarTitle", this.pageInfo[page].title);
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
