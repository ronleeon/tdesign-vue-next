<template>
  <t-config-provider :global-config="globalConfig">
    <t-pagination v-model="current" :total="36" show-jumper :max-page-btn="5" />
  </t-config-provider>
</template>

<script setup>
import { ref } from 'vue';

const current = ref(1);
const globalConfig = {
  pagination: {
    itemsPerPage: '{size} / page',
    jumpTo: 'jump to',
    page: '',
    total: 'Total {total} items',
  },
};
</script>

<style scoped>
.tdesign-demo-item--locale-provider-base {
  margin: 24px -120px 0 0;
}
</style>
