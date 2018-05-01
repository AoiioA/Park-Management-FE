<template>
  <v-layout column class="fill-height building-home">
    <view-tool-bar
      :barTitle="barTitle"
      :barTab="barTab"
    >
      <span slot="bar-menu">
        <v-btn icon>
          <v-icon>help</v-icon>
        </v-btn>
      </span>
    </view-tool-bar>
    <router-view></router-view>
  </v-layout>
</template>

<script>
import ViewToolBar from "@/components/ViewToolBar.vue";

export default {
  data() {
    return {
      barTitle: "楼宇管理",
      barTab: [
        { name: "楼宇概览", url: "building-all" },
        { name: "楼宇详情", url: "building-list" }
      ]
    };
  },
  components: {
    ViewToolBar
  }
};
</script>
