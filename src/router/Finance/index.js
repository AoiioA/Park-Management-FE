import Finance from "@/views/FinanceView/Finance.vue";

import Rent from "@/views/FinanceView/Rent/Rent.vue";
import RentDetail from "@/views/FinanceView/Rent/RentDetail.vue";
import RentList from "@/views/FinanceView/Rent/RentList.vue";

export default [
  {
    path: "finance",
    name: "finance",
    component: Finance,
    children: [
      {
        path: "rent",
        component: Rent,
        children: [
          {
            path: "",
            redirect: { name: "rent-list", params: { rentType: "toBePaid" } }
          },
          {
            path: "detail/:rentNo",
            name: "rent-detail",
            component: RentDetail,
            props: true
          },
          {
            path: "list/:rentType",
            name: "rent-list",
            component: RentList,
            props: true
          }
        ]
      }
    ]
  }
];
