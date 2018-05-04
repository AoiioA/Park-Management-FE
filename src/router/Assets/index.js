import Building from "@/views/AssetsView/Building/Building.vue";
import BuildingAll from "@/views/AssetsView/Building/BuildingAll.vue";
import BuildingList from "@/views/AssetsView/Building/BuildingList.vue";

import Park from "@/views/AssetsView/Park/Park.vue";
import ParkList from "@/views/AssetsView/Park/ParkList.vue";

export default [
  {
    path: "/building",
    component: Building,
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
    path: "/park",
    component: Park,
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
  }
];
