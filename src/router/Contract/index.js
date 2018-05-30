import Contract from "@/views/ContractView/Contract.vue";

import ContractList from "@/views/ContractView/ContractList.vue";

import Submitted from "@/views/ContractView/ContractExamine/Submitted.vue";
import NewSuccess from "@/views/ContractView/ContractExamine/NewSuccess.vue";
import RenewSuccess from "@/views/ContractView/ContractExamine/RenewSuccess.vue";
import Failed from "@/views/ContractView/ContractExamine/Failed.vue";

import Editing from "@/views/ContractView/ContractList/Editing.vue";
import Fulfilling from "@/views/ContractView/ContractList/Fulfilling.vue";
import Refunded from "@/views/ContractView/ContractList/Refunded.vue";
import Invalidated from "@/views/ContractView/ContractList/Invalidated.vue";
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
            redirect: { name: "submitted" }
          },
          {
            path: "submitted",
            name: "submitted",
            component: Submitted
          },
          {
            path: "failed",
            name: "failed",
            component: Failed
          },
          {
            path: "new-success",
            name: "new-success",
            component: NewSuccess
          },
          {
            path: "renew-success",
            name: "renew-success",
            component: RenewSuccess
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
            path: "invalidated",
            name: "invalidated",
            component: Invalidated
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
