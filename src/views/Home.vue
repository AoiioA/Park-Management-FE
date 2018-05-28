<template>
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
          &copy;2018 — <strong>普惠互联</strong>
        </v-flex>
      </v-layout>
    </v-footer>
    <v-container style="width:initial;position:fixed;right:0;bottom:0;z-index:3" grid-list-md>
      <v-layout column reverse wrap align-end>
        <v-flex
          v-for="(snackItem, index) in $store.state.snackbar"
          :key="index"
          tag="v-snackbar"
          v-model="snackItem.value"
          :color="snackItem.color"
          style="position:static;"
        >
          {{ snackItem.text }}<v-btn flat color="pink" @click.native="$store.commit('closeSnackBar', index)">OK</v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
import Login from "@/views/User/Login.vue";
import NavDrawer from "@/components/NavDrawer.vue";
import ToolBar from "@/components/ToolBar.vue";

export default {
  name: "home",
  data: () => ({
    drawer: null,
    mini: false
  }),
  components: {
    Login,
    NavDrawer,
    ToolBar
  }
};
</script>
