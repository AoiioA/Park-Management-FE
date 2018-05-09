import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import axios from "axios";
import VueAxios from "vue-axios";

import "vuetify/dist/vuetify.min.css";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import Vuetify from "vuetify";

axios.defaults.baseURL = "http://122.115.50.65";
Vue.use(VueAxios, axios);
Vue.use(Vuetify);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
