import Contract from "@/views/ContractView/Contract.vue";

import ContractNew from "@/views/ContractView/ContractNew.vue";
import ContractDetail from "@/views/ContractView/ContractDetail.vue";
import ContractRefundedDetail from "@/views/ContractView/ContractRefundedDetail.vue";
import ContractList from "@/views/ContractView/ContractList.vue";

import ExamineNew from "@/views/ContractView/ContractExamine/ExamineNew.vue";
import ExamineRefunded from "@/views/ContractView/ContractExamine/ExamineRefunded.vue";
import ExamineChanged from "@/views/ContractView/ContractExamine/ExamineChanged.vue";

import Editing from "@/views/ContractView/ContractList/Editing.vue";
import Fulfilling from "@/views/ContractView/ContractList/Fulfilling.vue";
import Refunded from "@/views/ContractView/ContractList/Refunded.vue";
import Changed from "@/views/ContractView/ContractList/Changed.vue";
import Expired from "@/views/ContractView/ContractList/Expired.vue";

export default [
  {
    path: "contract",
    component: Contract,
    children: [
      {
        path: "",
        redirect: { name: "contract-list-fulfilling" }
      },
      {
        path: "new",
        name: "contract-new",
        component: ContractNew
      },
      {
        path: "detail/:contractId",
        name: "contract-detail",
        component: ContractDetail
      },
      {
        path: "refunded-detail/:contractId",
        name: "contract-refunded-detail",
        component: ContractRefundedDetail
      },
      {
        path: "examine",
        component: ContractList,
        children: [
          {
            path: "",
            redirect: { name: "contract-examine-new" }
          },
          {
            path: "new",
            name: "contract-examine-new",
            component: ExamineNew
          },
          {
            path: "changed",
            name: "contract-examine-changed",
            component: ExamineChanged
          },
          {
            path: "refunded",
            name: "contract-examine-refunded",
            component: ExamineRefunded
          }
        ]
      },
      {
        path: "list",
        component: ContractList,
        children: [
          {
            path: "",
            redirect: { name: "contract-list-fulfilling" }
          },
          {
            path: "editing",
            name: "contract-list-editing",
            component: Editing
          },
          {
            path: "fulfilling",
            name: "contract-list-fulfilling",
            component: Fulfilling
          },
          {
            path: "refunded",
            name: "contract-list-refunded",
            component: Refunded
          },
          {
            path: "changed",
            name: "contract-list-changed",
            component: Changed
          },
          {
            path: "expired",
            name: "contract-list-expired",
            component: Expired
          }
        ]
      }
    ]
  }
];
