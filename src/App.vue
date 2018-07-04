<template>
  <div id="app">
    <router-view/>
    <snack-bar></snack-bar>
  </div>
</template>

<script>
import SnackBar from "@/components/SnackBar.vue";

export default {
  components: {
    SnackBar
  }
};
</script>

<style lang="stylus" scoped>
#app
  & /deep/ .v-input--hide-details .v-text-field__details
    margin 0
</style>
