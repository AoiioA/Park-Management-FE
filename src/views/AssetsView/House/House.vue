<template>
  <div class="fill-height house">
    <view-tool-bar
      :barTitle="viewToolBarTitle"
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
  components: {
    ViewToolBar
  },
  props: ["viewToolBarTitle"],
  created() {
    this.$store.commit("changeToolBarTitle", this.viewToolBarTitle);
  }
};
</script>
