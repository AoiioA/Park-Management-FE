<template>
  <v-layout column class="fill-height property-home">
    <view-tool-bar
      :barTitle="barTitle"
    >
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
  data: () => ({
    barTitle: "资产维护"
  }),
  components: {
    ViewToolBar,
    NotFind
  }
};
</script>
