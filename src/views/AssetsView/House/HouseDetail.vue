<template>
  <div class="fill-height house-detail">
    <view-tool-bar>
      <span slot="bar-menu">
        <v-btn :to="{ name: 'house-new' }" depressed color="primary">添加房源</v-btn>
        <v-btn icon>
          <v-icon>help</v-icon>
        </v-btn>
      </span>
      <span slot="bar-extend">
        <v-tabs color="primary" class="px-4" show-arrows>
          <v-tab v-for="tab in viewToolBarTab" :key="tab.value" :to="tab.to">{{ tab.name }}</v-tab>
        </v-tabs>
      </span>
    </view-tool-bar>
    <router-view/>
  </div>
</template>

<script>
import ViewToolBar from "@/components/ViewToolBar.vue";

export default {
  components: {
    ViewToolBar
  },
  data: () => ({}),
  computed: {
    viewToolBarTab() {
      return [
        {
          name: "资源",
          to: {
            name: "house-info-detail",
            params: { houseNo: this.$route.params.houseNo }
          }
        },
        {
          name: "图片",
          to: {
            name: "house-image-detail",
            params: { houseNo: this.$route.params.houseNo }
          }
        }
      ];
    }
  },
  created() {
    this.$store.commit("changeToolBarTitle", { title: "房源详情" });
  }
};
</script>
