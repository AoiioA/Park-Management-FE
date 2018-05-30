<template>
  <div class="house-detail">
    <v-jumbotron color="blue-grey lighten-4" height="auto">
      <v-container grid-list-xl>
        <v-layout justify-center align-center>
          <v-flex xs12 lg10>
            <v-subheader class="px-0">
              <v-btn depressed color="primary">button</v-btn>
            </v-subheader>
          </v-flex>
        </v-layout>
      </v-container>
    </v-jumbotron>
  </div>
</template>

<script>
export default {
  data: () => ({}),
  created() {
    this.$store.commit("changeToolBarTitle", "房源详情");
    this.initialize();
  },
  watch: {
    $route: "initialize"
  },
  methods: {
    initialize() {
      this.networkLoading = true;
      this.houseInfo = {};
      this.$http
        .all([
          this.$http.post("/cms/houseInfo/list.json", {
            houseId: this.$route.params.houseId
          })
        ])
        .then(
          this.$http.spread(house => {
            this.networkLoading = false;
            let hData = house.data.data;
            this.houseInfo = hData && hData.length ? hData[0] : {};
          })
        )
        .catch(err => {
          this.networkLoading = false;
          this.networkError = true;
          console.log(err);
        });
    }
  }
};
</script>
