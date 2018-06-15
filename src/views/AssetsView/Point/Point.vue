<template>
  <div class="fill-height point">
    <view-tool-bar :barTab="viewToolBarTab">
      <span slot="bar-menu">
        <v-btn icon>
          <v-icon>help</v-icon>
        </v-btn>
      </span>
    </view-tool-bar>
    <router-view />
  </div>
</template>

<script>
import ViewToolBar from "@/components/ViewToolBar.vue";

export default {
  components: {
    ViewToolBar
  },
  data: () => ({
    // viewToolBarTab: [{ name: "商圈概览", to: "point-list" }]
    viewToolBarTab: []
  }),
  created() {
    this.$store.commit("changeToolBarTitle", { title: "商圈概览" });
  }
};
</script>
