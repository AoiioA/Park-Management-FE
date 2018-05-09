<template>
  <div id="app">
    <v-app>
      <nav-drawer
        :isDrawer.sync="drawer"
        :isMini.sync="mini"
      ></nav-drawer>
      <ToolBar @toggleDrawer="drawer = !drawer"></ToolBar>
      <v-content>
        <router-view></router-view>
      </v-content>
      <v-footer app absolute inset height="auto" style="z-index:0">
        <v-layout row wrap justify-center>
          <v-flex xs12 py-3 text-xs-center>
            &copy;2018 — <strong>BILIBALA</strong>
          </v-flex>
        </v-layout>
      </v-footer>
    </v-app>
  </div>
</template>

<script>
import NavDrawer from "@/components/NavDrawer.vue";
import ToolBar from "@/components/ToolBar.vue";

export default {
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

<style lang="stylus">
#app
  background #cfd8dc
</style>
