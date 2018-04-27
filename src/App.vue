<template>
  <div id="app">
    <v-app>
      <nav-drawer
        :isDrawer.sync="drawer"
        :isMini.sync="mini"
      ></nav-drawer>
      <v-toolbar
        app
        dark
        fixed
        flat
        color="blue darken-3"
      >
        <!-- <v-toolbar-title
          class="ml-0 pl-3"
          v-if="$vuetify.breakpoint.lgAndUp"
          :style="{width: mini?'80px':'300px'}"
        >
          <v-avatar size="32px" tile style="display: inline-block;margin: 0 8px;">
            <img
              src="https://vuetifyjs.com/static/doc-images/logo.svg"
              alt="Vuetify"
            >
          </v-avatar>
          <span v-if="!mini" class="hidden-sm-and-down">Park Management</span>
        </v-toolbar-title> -->
        <v-toolbar-side-icon v-if="!$vuetify.breakpoint.lgAndUp" @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <!-- <v-text-field
          flat
          solo-inverted
          prepend-icon="search"
          label="Search"
          class="hidden-sm-and-down"
        ></v-text-field> -->
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon>apps</v-icon>
        </v-btn>
        <v-btn icon>
          <v-icon>notifications</v-icon>
        </v-btn>
        <v-btn icon large>
          <v-avatar size="32px" tile>
            <img
              src="https://vuetifyjs.com/static/doc-images/logo.svg"
              alt="Vuetify"
            >
          </v-avatar>
        </v-btn>
      </v-toolbar>
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

export default {
  components: {
    NavDrawer
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
