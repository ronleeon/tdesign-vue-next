<template>
  <t-transfer
    v-model="targetValue"
    v-model:checked="checked"
    :data="items"
    @change="onChange"
    @checked-change="handleCheckedChange"
  >
    <template #tree="slotProps">
      <t-tree v-bind="slotProps" checkable hover expand-all transition />
    </template>
  </t-transfer>
</template>
<script setup>
import { ref } from 'vue';

const items = [
  {
    value: '1',
    label: '1',
    children: [
      {
        value: '1.1',
        label: '1.1',
      },
      {
        value: '1.2',
        label: '1.2',
        children: [
          {
            value: '1.2.1',
            label: '1.2.1',
            children: [
              {
                value: '1.2.1.1',
                label: '1.2.1.1',
              },
              {
                value: '1.2.1.2',
                label: '1.2.1.2',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    value: '2',
    label: '2',
    children: [
      {
        value: '2.1',
        label: '2.1',
      },
      {
        value: '2.2',
        label: '2.2',
      },
    ],
  },
  {
    value: '3',
    label: '3',
    children: [],
  },
];

const targetValue = ref([]);
const checked = ref([]);

const handleCheckedChange = ({ checked, sourceChecked, targetChecked, type }) => {
  console.log('handleCheckedChange', {
    checked,
    sourceChecked,
    targetChecked,
    type,
  });
};

const onChange = (newTargetValue) => {
  console.log('onChange', newTargetValue);
};
</script>
