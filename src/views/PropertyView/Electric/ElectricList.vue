<template>
  <div class="fill-height electric-list">
    <view-tool-bar>
      <span slot="bar-menu">
        <v-btn :to="{ name: 'electric-new' }" depressed color="primary">添加电费账单</v-btn>
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
          name: "electric-list-pay"
        }
      },
      {
        name: "全部账单",
        to: {
          name: "electric-list-all"
        }
      }
    ]
  }),
  created() {
    this.$store.commit("changeToolBarTitle", { title: "电费管理" });
  }
};
</script>
