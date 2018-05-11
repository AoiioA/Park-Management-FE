import Building from "@/views/AssetsView/Building/Building.vue";
import BuildingDetail from "@/views/AssetsView/Building/BuildingDetail.vue";
import BuildingAll from "@/views/AssetsView/Building/BuildingAll.vue";

import Park from "@/views/AssetsView/Park/Park.vue";
import ParkList from "@/views/AssetsView/Park/ParkList.vue";

export default [
  {
    path: "/building",
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
    path: "/park",
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
  }
];
