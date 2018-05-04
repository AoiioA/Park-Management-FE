import Vue from "vue";
import Router from "vue-router";

import NotFind from "@/views/NotFind.vue";

// Analysis Module - 分析模块
import Analysis from "./Analysis";
// Assets Module - 资产模块
import Assets from "./Assets";
// Contract Module - 合同模块
import Contract from "./Contract";
// Dashboard Module - 工作台模块
import Dashboard from "./Dashboard";
// Finance Module - 财务模块
import Finance from "./Finance";
// Property Module - 物业模块
import Property from "./Property";
// Sale Module - 招商模块
import Sale from "./Sale";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      redirect: { name: "dashboard" }
    },
    {
      path: "/404",
      name: "NotFind",
      component: NotFind
    },
    ...Analysis,
    ...Assets,
    ...Contract,
    ...Dashboard,
    ...Finance,
    ...Property,
    ...Sale
  ]
});
