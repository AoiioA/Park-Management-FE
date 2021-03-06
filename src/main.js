import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./filter";
import "./mock";

import axios from "axios";
import VueAxios from "vue-axios";

import "vuetify/dist/vuetify.min.css";
// import "material-design-icons-iconfont/dist/material-design-icons.css";
import Vuetify from "vuetify";

import ECharts from "vue-echarts/components/ECharts";
import "echarts/lib/chart/bar";
import "echarts/lib/chart/pie";
import "echarts/lib/chart/treemap";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";

// axios.defaults.baseURL = process.env.BASE_URL;
if (process.env.NODE_ENV == "development") {
  axios.defaults.baseURL = "http://122.115.50.65";
}

Vue.use(VueAxios, axios);
Vue.use(Vuetify);

Vue.component("chart", ECharts);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
