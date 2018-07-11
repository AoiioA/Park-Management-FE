<template>
  <div class="fill-height contract">
    <router-view />
    <contract-new v-if="newType"></contract-new>
  </div>
</template>

<script>
// import "@/mock/contract-mock";
import ContractNew from "@/views/ContractView/ContractNew.vue";

export default {
  components: {
    ContractNew
  },
  data: () => ({}),
  computed: {
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
