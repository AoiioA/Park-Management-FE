<template>
  <div class="fill-height water-list">
    <view-tool-bar>
      <span slot="bar-menu">
        <v-btn :to="{ name: 'water-new' }" depressed color="primary">添加水费账单</v-btn>
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
    <router-view></router-view>
  </div>
</template>

<script>
import ViewToolBar from "@/components/ViewToolBar.vue";

export default {
  components: {
    ViewToolBar
  },
  data: () => ({
    viewToolBarTab: [
      {
        name: "待缴账单",
        to: {
          name: "water-pay-list"
        }
      },
      {
        name: "全部账单",
        to: {
          name: "water-all-list"
        }
      }
    ]
  }),
  created() {
    this.$store.commit("changeToolBarTitle", { title: "水费管理" });
  }
};
</script>
