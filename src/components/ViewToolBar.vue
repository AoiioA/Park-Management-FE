<template>
  <v-jumbotron
    dark
    color="primary"
    style="height: auto;"
  >
    <v-breadcrumbs
      v-if="$store.state.toolBarCrumbs.length"
      divider="/"
      class="px-4 py-0 bar-crumbs"
    >
      <v-breadcrumbs-item
        v-for="crumbs in $store.state.toolBarCrumbs"
        :key="crumbs.name"
      >
        <span @click="$router.push(crumbs.to)">
          {{ crumbs.name }}
        </span>
      </v-breadcrumbs-item>
    </v-breadcrumbs>
    <v-layout class="mx-3 bar-content">
      <v-btn v-if="$store.state.toolBarIsBack" @click="$router.go(-1)" class="mx-0" flat icon>
        <v-icon>arrow_back</v-icon>
      </v-btn>
      <v-flex>
        <div class="ml-2 mb-2 bar-title" v-html="$store.state.toolBarTitle"></div>
      </v-flex>
      <slot name="bar-menu"></slot>
    </v-layout>
    <slot name="bar-extend"></slot>
  </v-jumbotron>
</template>

<script>
export default {
  name: "ViewToolBar"
};
</script>

<style lang="stylus" scoped>
.bar-crumbs
  & /deep/ .v-breadcrumbs__item
    color inherit
.bar-content
  .bar-title
    font-size 26px
    font-weight 500
    line-height 48px
    overflow hidden
    text-overflow ellipsis
    white-space nowrap
</style>
