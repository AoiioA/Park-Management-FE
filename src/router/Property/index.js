import Property from "@/views/PropertyView/Property.vue";

import Water from "@/views/PropertyView/Water/Water.vue";
import WaterList from "@/views/PropertyView/Water/WaterList.vue";
import WaterDetail from "@/views/PropertyView/Water/WaterDetail.vue";
import WaterNew from "@/views/PropertyView/Water/WaterNew.vue";

import Electricity from "@/views/PropertyView/Electricity/Electricity.vue";
import ElectricityList from "@/views/PropertyView/Electricity/ElectricityList.vue";
// import ElectricityDetail from "@/views/PropertyView/Electricity/ElectricityDetail.vue";
// import ElectricityNew from "@/views/PropertyView/Electricity/ElectricityNew.vue";

export default [
  {
    path: "property",
    name: "property",
    component: Property,
    children: [
      {
        path: "water",
        component: Water,
        children: [
          {
            path: "",
            redirect: { name: "water-list" }
          },
          {
            path: "water-list",
            name: "water-list",
            component: WaterList
          },
          {
            path: "water-detail",
            name: "water-detail",
            component: WaterDetail
          },
          {
            path: "water-new",
            name: "water-new",
            component: WaterNew
          }
        ]
      },
      {
        path: "electricity",
        component: Electricity,
        children: [
          {
            path: "",
            redirect: { name: "electricity-list" }
          },
          {
            path: "electricity-list",
            name: "electricity-list",
            component: ElectricityList
          }
        ]
      }
    ]
  }
];
