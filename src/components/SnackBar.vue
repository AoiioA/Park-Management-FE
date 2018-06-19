<template>
  <!-- <v-container style="width:initial;position:fixed;right:0;bottom:0;z-index:3" grid-list-md>
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
  </v-container> -->
  <div>
    <v-snackbar
      v-for="(snackItem, index) in $store.state.snackbar"
      :key="index"
      v-model="snackItem.value"
      :color="snackItem.color"
      bottom
      right
    >
      {{ snackItem.text }}<v-btn flat color="pink" @click.native="$store.commit('closeSnackBar', index)">关闭</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: "snack-bar"
};
</script>
