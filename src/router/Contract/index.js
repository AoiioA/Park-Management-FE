import Contract from "@/views/ContractView/Contract.vue";

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
        redirect: { name: "fulfilling" }
      },
      {
        path: "examine",
        component: ContractList,
        children: [
          {
            path: "",
            redirect: { name: "examine-new" }
          },
          {
            path: "examine-new",
            name: "examine-new",
            component: ExamineNew
          },
          {
            path: "examine-changed",
            name: "examine-changed",
            component: ExamineChanged
          },
          {
            path: "examine-refunded",
            name: "examine-refunded",
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
            redirect: { name: "fulfilling" }
          },
          {
            path: "editing",
            name: "editing",
            component: Editing
          },
          {
            path: "fulfilling",
            name: "fulfilling",
            component: Fulfilling
          },
          {
            path: "refunded",
            name: "refunded",
            component: Refunded
          },
          {
            path: "changed",
            name: "changed",
            component: Changed
          },
          {
            path: "expired",
            name: "expired",
            component: Expired
          }
        ]
      }
    ]
  }
];
