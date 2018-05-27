<template>
  <div class="fill-height contract">
    <router-view>
      <v-btn flat slot="newContractBtn" :to="{ query: { newItem: 'yes' } }">添加合同</v-btn>
    </router-view>
    <contract-new v-if="newItem"></contract-new>
    <contract-detail v-if="detailId"></contract-detail>
  </div>
</template>

<script>
// import "@/mock/contract-mock";
import ContractNew from "@/views/ContractView/ContractNew.vue";
import ContractDetail from "@/views/ContractView/ContractDetail.vue";

export default {
  props: ["detailId", "newItem", "renewId"],
  data: () => ({}),
  components: {
    ContractNew,
    ContractDetail
  }
};
</script>

<style lang="stylus" scoped>
.contract
  position relative
</style>
