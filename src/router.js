import Vue from "vue";
import Router from "vue-router";

import AnalysisHome from "./views/AnalysisView/AnalysisHome.vue";
import BuildingHome from "./views/BuildingView/BuildingHome.vue";
import BuildingAll from "./views/BuildingView/BuildingAll.vue";
import BuildingList from "./views/BuildingView/BuildingList.vue";
import ContractHome from "./views/ContractView/ContractHome.vue";
import DashboardHome from "./views/DashboardView/DashboardHome.vue";
import FinanceHome from "./views/FinanceView/FinanceHome.vue";
import PropertyHome from "./views/PropertyView/PropertyHome.vue";
import SaleHome from "./views/SaleView/SaleHome.vue";
import About from "./views/About.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      redirect: { name: "dashboard" }
    },
    {
      path: "/analysis",
      name: "analysis",
      component: AnalysisHome
    },
    {
      path: "/building",
      name: "building",
      component: BuildingHome,
      children: [
        {
          path: "",
          redirect: { name: "building-all" }
        },
        {
          path: "building-all",
          name: "building-all",
          component: BuildingAll
        },
        {
          path: "building-list",
          name: "building-list",
          component: BuildingList
        }
      ]
    },
    {
      path: "/contract",
      name: "contract",
      component: ContractHome
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: DashboardHome
    },
    {
      path: "/finance",
      name: "finance",
      component: FinanceHome
    },
    {
      path: "/property",
      name: "property",
      component: PropertyHome
    },
    {
      path: "/sale",
      name: "sale",
      component: SaleHome
    },
    {
      path: "/about",
      name: "about",
      component: About
    }
  ]
});
