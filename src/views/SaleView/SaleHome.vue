<template>
  <v-layout column class="fill-height sale-home">
    <view-tool-bar>
      <span slot="bar-menu">
        <v-btn icon>
          <v-icon>help</v-icon>
        </v-btn>
      </span>
    </view-tool-bar>
    <not-find></not-find>
    <!-- <router-view></router-view> -->
  </v-layout>
</template>

<script>
import ViewToolBar from "@/components/ViewToolBar.vue";
import NotFind from "@/views/NotFind.vue";

export default {
  data: () => ({}),
  created() {
    this.$store.commit("changeToolBarTitle", { title: "预约管理" });
  },
  components: {
    ViewToolBar,
    NotFind
  }
};
</script>
