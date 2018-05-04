<template>
  <v-layout column class="fill-height park">
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
  data: () => ({
    barTitle: "园区管理",
    barTab: [{ name: "园区概览", url: "park-list" }]
  }),
  components: {
    ViewToolBar
  }
};
</script>
