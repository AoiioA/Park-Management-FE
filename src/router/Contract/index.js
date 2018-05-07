import Contract from "@/views/ContractView/Contract/Contract.vue";
import ContractList from "@/views/ContractView/Contract/ContractList.vue";

import Invalid from "@/views/ContractView/Invalid/Invalid.vue";
import InvalidList from "@/views/ContractView/Invalid/InvalidList.vue";

import Renew from "@/views/ContractView/Renew/Renew.vue";
import RenewList from "@/views/ContractView/Renew/RenewList.vue";

import Surrender from "@/views/ContractView/Surrender/Surrender.vue";
import SurrenderList from "@/views/ContractView/Surrender/SurrenderList.vue";

export default [
  {
    path: "/contract",
    component: Contract,
    children: [
      {
        path: "",
        redirect: { name: "contractList" }
      },
      {
        path: "contractList",
        name: "contractList",
        component: ContractList
      }
    ]
  },
  {
    path: "/invalid",
    component: Invalid,
    children: [
      {
        path: "",
        redirect: { name: "invalidList" }
      },
      {
        path: "invalidList",
        name: "invalidList",
        component: InvalidList
      }
    ]
  },
  {
    path: "/renew",
    component: Renew,
    children: [
      {
        path: "",
        redirect: { name: "renewList" }
      },
      {
        path: "renewList",
        name: "renewList",
        component: RenewList
      }
    ]
  },
  {
    path: "/surrender",
    component: Surrender,
    children: [
      {
        path: "",
        redirect: { name: "surrenderList" }
      },
      {
        path: "surrenderList",
        name: "surrenderList",
        component: SurrenderList
      }
    ]
  }
];
