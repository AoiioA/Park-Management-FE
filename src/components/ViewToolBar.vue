<template>
  <div class="bar-container">
    <v-layout class="bar-content ml-3 mr-3">
      <v-flex>
        <div class="bar-title ml-2 mb-2 pt-2 pb-2">{{ barTitle }}</div>
      </v-flex>
      <slot class="bar-menu" name="bar-menu"></slot>
    </v-layout>
    <!-- <div class="bar-tab"></div> -->
    <v-tabs
      dark
      color="primary"
      show-arrows
      class="ml-4 mr-4"
    >
      <v-tab
        v-for="tab in barTab"
        :key="tab.name"
        :to="{ path: tab.url }"
      >
        {{ tab.name }}
      </v-tab>
      <!-- <v-tabs-items>
        <v-tab-item
          v-for="i in 25"
          :key="i"
        >
          <v-card flat>
            <v-card-text>123</v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items> -->
    </v-tabs>
  </div>
</template>

<script>
export default {
  name: "ViewToolBar",
  props: {
    barTitle: String,
    barTab: Array
  }
};
</script>

<style lang="stylus" scoped>
$primary = #1976d2

.bar-container
  background $primary
  .bar-content
    .bar-title
      font-size: 26px;
      font-weight: 500;
      line-height: 32px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #fff;
  .bar-tab
    height 44px
</style>
