<template>
  <div class="fill-height contract">
    <router-view>
      <v-btn flat slot="newContractBtn" :to="{ query: { newItem: 'yes' } }">添加合同</v-btn>
    </router-view>
    <contract-new v-if="newItem"></contract-new>
  </div>
</template>

<script>
import ContractNew from "@/views/ContractView/ContractNew.vue";

export default {
  props: {
    detailId: {
      type: String,
      default: ""
    },
    newItem: {
      type: String,
      default: ""
    },
    renewItem: {
      type: String,
      default: ""
    }
  },
  data: () => ({}),
  components: {
    ContractNew
  }
};
</script>

<style lang="stylus" scoped>
.contract
  position relative
</style>
