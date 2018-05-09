<template>
  <div class="fill-height contract-list">
    <view-tool-bar
      :barTitle="viewToolBarTitle"
      :barTab="viewToolBarTab"
    >
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
  props: ["viewToolBarTitle"],
  data: () => ({
    viewToolBarTab: [
      { name: "待审核", url: "/contract/list/submitted" },
      { name: "生效中", url: "/contract/list/fulfilling" },
      { name: "已到期", url: "/contract/list/expired" },
      { name: "已作废", url: "/contract/list/invalidated" }
    ]
  }),
  components: {
    ViewToolBar
  },
  computed: {
    ...mapState({})
  }
};
</script>
