<template>
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
    <v-toolbar-side-icon v-if="!$vuetify.breakpoint.lgAndUp" @click.stop="$emit('toggleDrawer')"></v-toolbar-side-icon>
    <!-- <v-text-field
      flat
      solo-inverted
      prepend-icon="search"
      label="Search"
      class="hidden-sm-and-down"
    ></v-text-field> -->
    <v-spacer></v-spacer>
    <v-btn icon>
      <v-icon>help</v-icon>
    </v-btn>
    <v-btn icon>
      <v-icon>notifications</v-icon>
    </v-btn>
    <v-menu
      offset-y
      :close-on-content-click="false"
      :nudge-width="160"
      v-model="menu"
    >
      <v-btn icon large slot="activator">
        <v-avatar size="32px" tile>
          <img src="https://vuetifyjs.com/static/doc-images/logo.svg" alt="Vuetify">
        </v-avatar>
      </v-btn>
      <v-card>
        <v-list>
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <img src="https://vuetifyjs.com/static/doc-images/logo.svg" alt="Vuetify">
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>Bilibala</v-list-tile-title>
              <v-list-tile-sub-title>系统管理员</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn small depressed color="primary" @click="menu = false">
            <v-icon small>account_circle</v-icon>&nbsp;账号设置
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn small flat color="error" @click="menu = false">退出登录</v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </v-toolbar>
</template>

<script>
export default {
  name: "ToolBar",
  data() {
    return {
      menu: false
    };
  }
};
</script>
