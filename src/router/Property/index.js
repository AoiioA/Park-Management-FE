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
            redirect: { name: "water-list-pay" }
          },
          {
            path: "new",
            name: "water-new",
            component: WaterNew
          },
          {
            path: "detail/:waterNo",
            name: "water-detail",
            component: WaterDetail
          },
          {
            path: "list",
            component: WaterList,
            children: [
              {
                path: "",
                redirect: { name: "water-list-pay" }
              },
              {
                path: "pay",
                name: "water-list-pay",
                component: WaterPayList
              },
              {
                path: "all",
                name: "water-list-all",
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
            redirect: { name: "electric-list-pay" }
          },
          {
            path: "new",
            name: "electric-new",
            component: ElectricNew
          },
          {
            path: "detail/:electricNo",
            name: "electric-detail",
            component: ElectricDetail
          },
          {
            path: "electric-list",
            component: ElectricList,
            children: [
              {
                path: "",
                redirect: { name: "electric-list-pay" }
              },
              {
                path: "pay",
                name: "electric-list-pay",
                component: ElectricPayList
              },
              {
                path: "all",
                name: "electric-list-all",
                component: ElectricAllList
              }
            ]
          }
        ]
      }
    ]
  }
];
