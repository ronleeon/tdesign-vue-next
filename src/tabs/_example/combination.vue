<template>
  <t-space direction="vertical" size="large">
    <t-space>
      <t-radio-group v-model="theme" variant="default-filled">
        <t-radio-button value="normal">常规型</t-radio-button>
        <t-radio-button value="card">卡片型</t-radio-button>
      </t-radio-group>
    </t-space>
    <t-tabs v-model="value" :theme="theme">
      <t-tab-panel v-for="index in 20" :key="index" :value="index + ''" :label="`选项卡${index}`">
        <p style="padding: 25px">选项卡{{ index }}</p>
      </t-tab-panel>
    </t-tabs>
  </t-space>
</template>

<script setup>
import { ref } from 'vue';

const value = ref('1');
const theme = ref('normal');
</script>
