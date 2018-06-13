<template>
  <div class="fill-height park">
    <view-tool-bar :barTab="viewToolBarTab">
      <span slot="bar-menu">
        <v-btn icon>
          <v-icon>help</v-icon>
        </v-btn>
      </span>
    </view-tool-bar>
    <router-view></router-view>
  </div>
</template>

<script>
import ViewToolBar from "@/components/ViewToolBar.vue";

export default {
  data: () => ({
    // viewToolBarTab: [{ name: "园区概览", to: "park-list" }]
    viewToolBarTab: []
  }),
  created() {
    this.$store.commit("changeToolBarTitle", { title: "园区概览" });
  },
  components: {
    ViewToolBar
  }
};
</script>
