import Contract from "@/views/ContractView/Contract.vue";
import ContractList from "@/views/ContractView/Contract/ContractList.vue";

import ContractDetail from "@/views/ContractView/Contract/ContractDetail.vue";

import Invalid from "@/views/ContractView/Contract/Invalid.vue";

import Renew from "@/views/ContractView/Contract/Renew.vue";

import Surrender from "@/views/ContractView/Contract/Surrender.vue";

export default [
  {
    path: "/contract",
    component: Contract,
    meta: { viewToolBarTitle: "合同概览" },
    children: [
      {
        path: "",
        redirect: { name: "contract-list" }
      },
      {
        path: "contract-list",
        name: "contract-list",
        component: ContractList
      },
      {
        path: "contract-detail",
        name: "contract-detail",
        component: ContractDetail
      },
      {
        path: "invalid",
        name: "invalid",
        component: Invalid
      },
      {
        path: "renew",
        name: "renew",
        component: Renew
      },
      {
        path: "surrender",
        name: "surrender",
        component: Surrender
      }
    ]
  }
];
