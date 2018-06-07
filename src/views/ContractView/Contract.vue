<template>
  <div class="fill-height contract">
    <router-view>
      <v-btn flat slot="newContractBtn" :to="{ query: { newType: 'new' } }">添加合同</v-btn>
    </router-view>
    <contract-new v-if="newType"></contract-new>
    <contract-detail v-if="detailType&&detailId"></contract-detail>
  </div>
</template>

<script>
// import "@/mock/contract-mock";
import ContractNew from "@/views/ContractView/ContractNew.vue";
import ContractDetail from "@/views/ContractView/ContractDetail.vue";

export default {
  components: {
    ContractNew,
    ContractDetail
  },
  data: () => ({}),
  computed: {
    detailType() {
      return this.$route.query.detailType;
    },
    detailId() {
      return this.$route.query.detailId;
    },
    // 操作类型
    newType() {
      return this.$route.query.newType;
    },
    // 重新编辑合同的ID
    renewId() {
      return this.$route.query.renewId;
    },
    // 续签的原合同ID
    exId() {
      return this.$route.query.exId;
    }
  }
};
</script>

<style lang="stylus" scoped>
.contract {
  position: relative;
}
</style>
