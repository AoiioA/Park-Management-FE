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
        <v-tabs v-model="activeTab" color="primary" class="px-4" show-arrows>
          <v-tab v-for="tab in viewToolBarTab" :key="tab.value" :to="tab.to">{{ tab.name }}</v-tab>
        </v-tabs>
      </span>
    </view-tool-bar>
    <v-tabs-items v-model="activeTab">
      <v-tab-item>
        <house-info-detail></house-info-detail>
      </v-tab-item>
      <v-tab-item>
        <house-image-detail></house-image-detail>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import ViewToolBar from "@/components/ViewToolBar.vue";
import HouseInfoDetail from "@/views/AssetsView/House/HouseDetail/HouseInfoDetail.vue";
import HouseImageDetail from "@/views/AssetsView/House/HouseDetail/HouseImageDetail.vue";

export default {
  components: {
    ViewToolBar,
    HouseInfoDetail,
    HouseImageDetail
  },
  data: () => ({
    activeTab: null,
    viewToolBarTab: [
      {
        name: "资源",
        value: "info"
      },
      {
        name: "图片",
        value: "image"
      }
    ]
  }),
  created() {
    this.$store.commit("changeToolBarTitle", { title: "房源详情" });
  }
};
</script>
