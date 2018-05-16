<template>
  <div class="fill-height park">
    <view-tool-bar
      :barTitle="viewToolBarTitle"
      :barTab="viewToolBarTab"
    >
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
  props: ["viewToolBarTitle"],
  data: () => ({
    viewToolBarTab: [{ name: "园区概览", to: "park-list" }]
  }),
  components: {
    ViewToolBar
  },
  created() {
    this.$store.commit("changeToolBarTitle", this.viewToolBarTitle);
  }
};
</script>
