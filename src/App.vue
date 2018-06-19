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
