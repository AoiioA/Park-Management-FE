import Assets from "@/views/AssetsView/Assets.vue";

import Point from "@/views/AssetsView/Point/Point.vue";
import PointList from "@/views/AssetsView/Point/PointList.vue";
import PointDetail from "@/views/AssetsView/Point/PointDetail.vue";

import Park from "@/views/AssetsView/Park/Park.vue";
import ParkList from "@/views/AssetsView/Park/ParkList.vue";
import ParkDetail from "@/views/AssetsView/Park/ParkDetail.vue";

import Building from "@/views/AssetsView/Building/Building.vue";
import BuildingList from "@/views/AssetsView/Building/BuildingList.vue";
import BuildingDetail from "@/views/AssetsView/Building/BuildingDetail.vue";

import House from "@/views/AssetsView/House/House.vue";
import HouseNew from "@/views/AssetsView/House/HouseNew.vue";
import HouseSearch from "@/views/AssetsView/House/HouseSearch.vue";
import HouseDetail from "@/views/AssetsView/House/HouseDetail.vue";

export default [
  {
    path: "assets",
    component: Assets,
    children: [
      {
        path: "point",
        component: Point,
        children: [
          {
            path: "",
            redirect: { name: "point-list" }
          },
          {
            path: "list",
            name: "point-list",
            component: PointList
          },
          {
            path: "detail/:pointNo",
            name: "point-detail",
            component: PointDetail
          }
        ]
      },
      {
        path: "park",
        component: Park,
        children: [
          {
            path: "",
            redirect: { name: "park-list" }
          },
          {
            path: "list",
            name: "park-list",
            component: ParkList
          },
          {
            path: "detail/:parkNo",
            name: "park-detail",
            component: ParkDetail
          }
        ]
      },
      {
        path: "building",
        component: Building,
        children: [
          {
            path: "",
            redirect: { name: "building-list" }
          },
          {
            path: "list",
            name: "building-list",
            component: BuildingList
          },
          {
            path: "detail/:buildingNo",
            name: "building-detail",
            component: BuildingDetail
          }
        ]
      },
      {
        path: "house",
        component: House,
        children: [
          {
            path: "",
            redirect: { name: "house-search" }
          },
          {
            path: "new",
            name: "house-new",
            component: HouseNew
          },
          {
            path: "search",
            name: "house-search",
            component: HouseSearch
          },
          {
            path: "detail/:houseNo",
            name: "house-detail",
            component: HouseDetail
          }
        ]
      }
    ]
  }
];
