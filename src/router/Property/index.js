import Property from "@/views/PropertyView/Property.vue";

import Water from "@/views/PropertyView/Water/Water.vue";
import WaterNew from "@/views/PropertyView/Water/WaterNew.vue";
import WaterDetail from "@/views/PropertyView/Water/WaterDetail.vue";
import WaterList from "@/views/PropertyView/Water/WaterList.vue";
import WaterPayList from "@/views/PropertyView/Water/WaterList/WaterPayList.vue";
import WaterAllList from "@/views/PropertyView/Water/WaterList/WaterAllList.vue";

import Electricity from "@/views/PropertyView/Electricity/Electricity.vue";
// import ElectricityNew from "@/views/PropertyView/Electricity/ElectricityNew.vue";
// import ElectricityDetail from "@/views/PropertyView/Electricity/ElectricityDetail.vue";
import ElectricityList from "@/views/PropertyView/Electricity/ElectricityList.vue";

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
            redirect: { name: "water-pay-list" }
          },
          {
            path: "water-new",
            name: "water-new",
            component: WaterNew
          },
          {
            path: "water-detail/:waterNo",
            name: "water-detail",
            component: WaterDetail
          },
          {
            path: "water-list",
            component: WaterList,
            children: [
              {
                path: "",
                redirect: { name: "water-pay-list" }
              },
              {
                path: "water-pay-list",
                name: "water-pay-list",
                component: WaterPayList
              },
              {
                path: "water-all-list",
                name: "water-all-list",
                component: WaterAllList
              }
            ]
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
