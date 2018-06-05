<template>
  <v-app>
    <nav-drawer
      :isDrawer.sync="drawer"
      :isMini.sync="mini"
    ></nav-drawer>
    <tool-bar @toggleDrawer="drawer = !drawer"></tool-bar>
    <v-content>
      <router-view></router-view>
    </v-content>
    <v-footer app absolute inset height="auto" style="z-index:0">
      <v-layout row wrap justify-center>
        <v-flex xs12 py-3 text-xs-center>
          &copy;2018 — <strong>普惠互联</strong>
        </v-flex>
      </v-layout>
    </v-footer>
    <snack-bar></snack-bar>
  </v-app>
</template>

<script>
import NavDrawer from "@/components/NavDrawer.vue";
import ToolBar from "@/components/ToolBar.vue";
import SnackBar from "@/components/SnackBar.vue";

export default {
  name: "home",
  data: () => ({
    drawer: null,
    mini: false
  }),
  components: {
    NavDrawer,
    ToolBar,
    SnackBar
  }
};
</script>
