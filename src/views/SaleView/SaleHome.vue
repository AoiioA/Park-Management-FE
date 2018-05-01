<template>
  <v-layout column class="fill-height sale-home">
    <view-tool-bar
      :barTitle="barTitle"
    >
      <span slot="bar-menu">
        <v-btn icon>
          <v-icon>help</v-icon>
        </v-btn>
      </span>
    </view-tool-bar>
    <v-container fill-height>
      <v-layout align-center justify-center>
        <v-flex xs3>
          <v-card>
            <v-container>
              <h1>Oops~</h1>This module is not completed, so it can't be used yet!
            </v-container>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <!-- <router-view></router-view> -->
  </v-layout>
</template>

<script>
import ViewToolBar from "@/components/ViewToolBar.vue";

export default {
  data() {
    return {
      barTitle: "预约管理"
    };
  },
  components: {
    ViewToolBar
  }
};
</script>
