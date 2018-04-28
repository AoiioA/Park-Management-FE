<template>
  <div id="app">
    <v-app>
      <nav-drawer
        :isDrawer.sync="drawer"
        :isMini.sync="mini"
      ></nav-drawer>
      <ToolBar @toggleDrawer="drawer = !drawer"></ToolBar>
      <v-content>
        <v-container fluid fill-height>
          <router-view></router-view>
        </v-container>
      </v-content>
      <v-footer height="auto">
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
  components: {
    NavDrawer,
    ToolBar
  },
  data() {
    return {
      drawer: null,
      mini: false
    };
  }
};
</script>

<style lang="stylus"></style>
