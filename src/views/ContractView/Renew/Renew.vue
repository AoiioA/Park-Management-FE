<template>
  <v-layout column class="fill-height contract">
    <view-tool-bar
      :barTitle="barTitle"
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
    barTitle: "合同续签"
  }),
  components: {
    ViewToolBar
  }
};
</script>
