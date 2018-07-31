import Finance from "@/views/FinanceView/Finance.vue";

import Rent from "@/views/FinanceView/Rent/Rent.vue";
import RentDetail from "@/views/FinanceView/Rent/RentDetail.vue";
import RentList from "@/views/FinanceView/Rent/RentList.vue";
import RentPayList from "@/views/FinanceView/Rent/RentList/RentPayList.vue";
import RentAllList from "@/views/FinanceView/Rent/RentList/RentAllList.vue";

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
            redirect: { name: "rent-list-pay" }
          },
          {
            path: "detail/:rentNo",
            name: "rent-detail",
            component: RentDetail
          },
          {
            path: "list",
            component: RentList,
            children: [
              {
                path: "",
                redirect: { name: "rent-list-pay" }
              },
              {
                path: "pay",
                name: "rent-list-pay",
                component: RentPayList
              },
              {
                path: "all",
                name: "rent-list-all",
                component: RentAllList
              }
            ]
          }
        ]
      }
    ]
  }
];
