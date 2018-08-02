import Property from "@/views/PropertyView/Property.vue";

import Water from "@/views/PropertyView/Water/Water.vue";
import WaterNew from "@/views/PropertyView/Water/WaterNew.vue";
import WaterDetail from "@/views/PropertyView/Water/WaterDetail.vue";
import WaterList from "@/views/PropertyView/Water/WaterList.vue";

import Electric from "@/views/PropertyView/Electric/Electric.vue";
import ElectricNew from "@/views/PropertyView/Electric/ElectricNew.vue";
import ElectricDetail from "@/views/PropertyView/Electric/ElectricDetail.vue";
import ElectricList from "@/views/PropertyView/Electric/ElectricList.vue";

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
            redirect: {
              name: "water-list",
              params: { waterType: "paid" }
            }
          },
          {
            path: "new",
            name: "water-new",
            component: WaterNew
          },
          {
            path: "detail/:waterNo",
            name: "water-detail",
            component: WaterDetail,
            props: true
          },
          {
            path: "list/:waterType",
            name: "water-list",
            component: WaterList,
            props: true
          }
        ]
      },
      {
        path: "electric",
        component: Electric,
        children: [
          {
            path: "",
            redirect: {
              name: "electric-list",
              params: { electricType: "paid" }
            }
          },
          {
            path: "new",
            name: "electric-new",
            component: ElectricNew
          },
          {
            path: "detail/:electricNo",
            name: "electric-detail",
            component: ElectricDetail,
            props: true
          },
          {
            path: "list/:electricType",
            name: "electric-list",
            component: ElectricList,
            props: true
          }
        ]
      }
    ]
  }
];
