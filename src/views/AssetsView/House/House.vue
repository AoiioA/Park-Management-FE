<template>
  <div class="fill-height house">
    <view-tool-bar>
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
// import "@/mock/house-mock";
import ViewToolBar from "@/components/ViewToolBar.vue";

export default {
  components: {
    ViewToolBar
  },
  data: () => ({}),
  created() {
    this.$store.commit("changeToolBarTitle", "房源概览");
  }
};
</script>
