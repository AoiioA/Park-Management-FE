<template>
  <v-jumbotron height="auto">
    <v-container grid-list-xl fluid fill-height>
      <v-layout justify-center wrap>
      </v-layout>
    </v-container>
  </v-jumbotron>
</template>

<script>
export default {
  name: "contract-rent-detail",
  data: () => ({}),
  props: {
    CTRTInfo: {
      type: Object,
      required: true
    }
  },
  created() {},
  methods: {}
};
</script>
