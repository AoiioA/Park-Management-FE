<template>
  <v-jumbotron
    dark
    color="primary"
    style="height: auto;"
  >
    <v-layout class="mx-3 bar-content">
      <v-flex>
        <div class="ml-2 mb-2 py-2 bar-title">{{ $store.state.toolBarTitle }}</div>
      </v-flex>
      <slot name="bar-menu"></slot>
    </v-layout>
    <v-tabs
      v-if="barTab&&barTab.length"
      color="primary"
      show-arrows
      class="mx-4 bar-tab"
    >
      <v-tab
        v-for="tab in barTab"
        :key="tab.name"
        :to="tab.to"
      >
        {{ tab.name }}
      </v-tab>
    </v-tabs>
  </v-jumbotron>
</template>

<script>
export default {
  name: "ViewToolBar",
  props: {
    barTab: Array
  }
};
</script>

<style lang="stylus" scoped>
.bar-content
  .bar-title
    font-size 26px
    font-weight 500
    line-height 32px
    overflow hidden
    text-overflow ellipsis
    white-space nowrap
</style>
