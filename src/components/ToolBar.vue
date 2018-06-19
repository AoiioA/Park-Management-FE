<template>
  <v-toolbar
    app
    fixed
    :flat="offsetTop<56"
    dark
    color="primary"
    v-scroll="onScroll"
  >
    <!-- <v-toolbar-title
      class="ml-0 pl-3"
      v-if="$vuetify.breakpoint.lgAndUp"
      :style="{width: mini?'80px':'300px'}"
    >
      <v-avatar size="32px" tile style="display: inline-block;margin: 0 8px;">
        <img src="https://vuetifyjs.com/static/doc-images/logo.svg" alt="Vuetify">
      </v-avatar>
      <span v-if="!mini" class="hidden-sm-and-down">科技金融园区共享服务平台</span>
    </v-toolbar-title> -->
    <v-toolbar-side-icon v-if="!$vuetify.breakpoint.lgAndUp" @click.stop="$emit('toggleDrawer')"></v-toolbar-side-icon>
    <transition name="fade">
      <v-toolbar-title :class="{ 'ml-0': $vuetify.breakpoint.mdAndDown }" v-if="offsetTop>=56">{{ $store.state.toolBarTitle }}</v-toolbar-title>
    </transition>
    <!-- <v-text-field
      flat
      solo-inverted
      prepend-icon="search"
      label="Search"
      class="hidden-sm-and-down"
    ></v-text-field> -->
    <v-spacer></v-spacer>
    <v-badge overlap color="error">
      <span slot="badge">3</span>
      <v-btn icon class="mx-0 my-0">
        <v-icon>notifications</v-icon>
      </v-btn>
    </v-badge>
    <v-menu
      offset-y
      :close-on-content-click="false"
      :nudge-width="160"
      :nudge-bottom="10"
      v-model="menu"
    >
      <v-btn icon slot="activator">
        <v-avatar>
          <v-icon>account_circle</v-icon>
          <!-- <strong class="blue--text text--darken-2 body-1"><strong>中海融</strong></strong> -->
        </v-avatar>
      </v-btn>
      <v-card>
        <v-list>
          <v-list-tile avatar>
            <v-list-tile-avatar color="primary">
              <span class="white--text body-2 caption">中海融</span>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>中海融科技</v-list-tile-title>
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
          <v-btn small flat color="error" @click="logout">退出登录</v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </v-toolbar>
</template>

<script>
export default {
  name: "tool-bar",
  data: () => ({
    offsetTop: 0,
    menu: false
  }),
  methods: {
    onScroll() {
      this.offsetTop = window.pageYOffset || document.documentElement.scrollTop;
    },
    logout() {
      this.menu = false;
      window.localStorage.removeItem("userInfo");
      this.$store.commit("addSnackBar", "用户已退出登录", "success");
      this.$router.push({ name: "login" });
    }
  }
};
</script>

<style lang="stylus" scoped>
.fade-enter-active, .fade-leave-active
  transition opacity .3s
.fade-enter, .fade-leave-to
  opacity 0
</style>
