<template>
  <div class="fill-height electricity-list">
    <view-tool-bar>
      <span slot="bar-menu">
        <v-btn icon>
          <v-icon>help</v-icon>
        </v-btn>
      </span>
    </view-tool-bar>
    <not-find></not-find>
    <!-- <router-view /> -->
  </div>
</template>

<script>
import NotFind from "@/views/NotFind.vue";
import ViewToolBar from "@/components/ViewToolBar.vue";

export default {
  components: {
    NotFind,
    ViewToolBar
  },
  data: () => ({}),
  created() {
    this.$store.commit("changeToolBarTitle", { title: "电费管理" });
  }
};
</script>
