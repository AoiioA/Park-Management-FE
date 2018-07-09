import Property from "@/views/PropertyView/Property.vue";

import Water from "@/views/PropertyView/Water/Water.vue";
import WaterNew from "@/views/PropertyView/Water/WaterNew.vue";
import WaterDetail from "@/views/PropertyView/Water/WaterDetail.vue";
import WaterList from "@/views/PropertyView/Water/WaterList.vue";
import WaterPayList from "@/views/PropertyView/Water/WaterList/WaterPayList.vue";
import WaterAllList from "@/views/PropertyView/Water/WaterList/WaterAllList.vue";

import Electric from "@/views/PropertyView/Electric/Electric.vue";
import ElectricNew from "@/views/PropertyView/Electric/ElectricNew.vue";
import ElectricDetail from "@/views/PropertyView/Electric/ElectricDetail.vue";
import ElectricList from "@/views/PropertyView/Electric/ElectricList.vue";
import ElectricPayList from "@/views/PropertyView/Electric/ElectricList/ElectricPayList.vue";
import ElectricAllList from "@/views/PropertyView/Electric/ElectricList/ElectricAllList.vue";

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
        path: "electric",
        component: Electric,
        children: [
          {
            path: "",
            redirect: { name: "electric-pay-list" }
          },
          {
            path: "electric-new",
            name: "electric-new",
            component: ElectricNew
          },
          {
            path: "electric-detail/:electricNo",
            name: "electric-detail",
            component: ElectricDetail
          },
          {
            path: "electric-list",
            component: ElectricList,
            children: [
              {
                path: "",
                redirect: { name: "electric-pay-list" }
              },
              {
                path: "electric-pay-list",
                name: "electric-pay-list",
                component: ElectricPayList
              },
              {
                path: "electric-all-list",
                name: "electric-all-list",
                component: ElectricAllList
              }
            ]
          }
        ]
      }
    ]
  }
];
