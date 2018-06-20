<template>
  <v-app>
    <nav-drawer
      :isDrawer.sync="drawer"
      :isMini.sync="mini"
    ></nav-drawer>
    <tool-bar @toggleDrawer="drawer = !drawer"></tool-bar>
    <v-content style="background: #ECEFF1">
      <router-view></router-view>
    </v-content>
    <v-footer app absolute inset height="auto" style="z-index:0">
      <v-layout row wrap justify-center>
        <v-flex xs12 py-3 text-xs-center>
          &copy;2018 — <strong>中海融科技</strong>
        </v-flex>
      </v-layout>
    </v-footer>
  </v-app>
</template>

<script>
import NavDrawer from "@/components/NavDrawer.vue";
import ToolBar from "@/components/ToolBar.vue";

export default {
  name: "home",
  data: () => ({
    drawer: null,
    mini: false
  }),
  components: {
    NavDrawer,
    ToolBar
  }
};
</script>
