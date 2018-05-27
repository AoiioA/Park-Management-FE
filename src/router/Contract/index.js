import Contract from "@/views/ContractView/Contract.vue";

import ContractNew from "@/views/ContractView/ContractNew.vue";

import ContractDetail from "@/views/ContractView/ContractDetail.vue";

import ContractExamine from "@/views/ContractView/ContractExamine.vue";

import ContractList from "@/views/ContractView/ContractList/ContractList.vue";
import Submitted from "@/views/ContractView/ContractList/Submitted.vue";
import Fulfilling from "@/views/ContractView/ContractList/Fulfilling.vue";
import Expired from "@/views/ContractView/ContractList/Expired.vue";
import Refunded from "@/views/ContractView/ContractList/Refunded.vue";
import Invalidated from "@/views/ContractView/ContractList/Invalidated.vue";

export default [
  {
    path: "/contract",
    component: Contract,
    props: route => ({
      detailId: route.query.detailId,
      newItem: route.query.newItem,
      renewId: route.query.renewId
    }),
    children: [
      {
        path: "",
        redirect: { name: "fulfilling" }
      },
      {
        path: "new",
        name: "new",
        component: ContractNew
      },
      {
        path: "detail",
        name: "detail",
        component: ContractDetail
      },
      {
        path: "examine",
        name: "examine",
        component: ContractExamine
      },
      {
        path: "list",
        component: ContractList,
        props: { viewToolBarTitle: "合同概览" },
        children: [
          {
            path: "",
            redirect: { name: "fulfilling" }
          },
          {
            path: "submitted",
            name: "submitted",
            component: Submitted
          },
          {
            path: "fulfilling",
            name: "fulfilling",
            component: Fulfilling
          },
          {
            path: "expired",
            name: "expired",
            component: Expired
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
          }
        ]
      }
    ]
  }
];
