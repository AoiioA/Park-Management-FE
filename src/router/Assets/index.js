import Park from "@/views/AssetsView/Park/Park.vue";
import ParkList from "@/views/AssetsView/Park/ParkList.vue";

import Building from "@/views/AssetsView/Building/Building.vue";
import BuildingDetail from "@/views/AssetsView/Building/BuildingDetail.vue";
import BuildingAll from "@/views/AssetsView/Building/BuildingAll.vue";

import House from "@/views/AssetsView/House/House.vue";
import HouseSearch from "@/views/AssetsView/House/HouseSearch.vue";
import HouseDetail from "@/views/AssetsView/House/HouseDetail.vue";

export default [
  {
    path: "park",
    component: Park,
    props: { viewToolBarTitle: "园区管理" },
    children: [
      {
        path: "",
        redirect: { name: "park-list" }
      },
      {
        path: "park-list",
        name: "park-list",
        component: ParkList
      }
    ]
  },
  {
    path: "building",
    component: Building,
    props: { viewToolBarTitle: "楼宇管理" },
    children: [
      {
        path: "building-detail/:buildingId",
        name: "building-detail",
        component: BuildingDetail
      },
      {
        path: "building-all",
        name: "building-all",
        component: BuildingAll
      }
    ]
  },
  {
    path: "house",
    component: House,
    props: { viewToolBarTitle: "房源管理" },
    children: [
      {
        path: "",
        redirect: { name: "house-search" }
      },
      {
        path: "house-search",
        name: "house-search",
        component: HouseSearch
      },
      {
        path: "house-detail",
        name: "house-detail",
        component: HouseDetail
      }
    ]
  }
];
