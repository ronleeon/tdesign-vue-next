<template>
  <t-space>
    <t-button theme="primary" @click="showDialog">dialog</t-button>
    <t-button theme="primary" @click="handleDN">handleDialogNode</t-button>
    <t-button theme="primary" @click="onConfirm">confirm</t-button>
    <t-button theme="primary" @click="onAlert">alert</t-button>
    <t-button theme="primary" @click="onDialogPluginConfirm">DialogPlugin.confirm</t-button>
  </t-space>
</template>
<script>
import { defineComponent } from 'vue';
import { DialogPlugin } from 'tdesign-vue-next';

export default defineComponent({
  data() {
    return {
      mydialog: '',
    };
  },
  methods: {
    showDialog() {
      if (this.myDialog) {
        this.myDialog.show();
        return;
      }
      this.myDialog = this.$dialog({
        header: 'Dialog-Plugin',
        body: 'Plugin 方式创建新弹窗',
        className: 't-dialog-new-class1 t-dialog-new-class2',
        style: 'color: rgba(0, 0, 0, 0.6)',
        onConfirm: ({ e }) => {
          this.myDialog.hide();
        },
      });
    },
    handleDN() {
      const dialogNode = this.$dialog({
        header: 'Dialog-Plugin',
        body: 'Hi, darling! Do you want to be my lover?',
      });
      // 更新弹框内容
      dialogNode.update({
        header: 'Updated-Dialog-Plugin',
        cancelBtn: '',
        onConfirm: ({ e }) => {
          console.log('confirm button has been clicked!');
          console.log('e: ', e);
          // 隐藏弹框
          dialogNode.hide();
        },
      });
    },
    onConfirm() {
      const confirmDia = this.$dialog.confirm({
        header: 'Dialog-Confirm-Plugin',
        body: 'Are you sure to delete it?',
        confirmBtn: 'ok',
        cancelBtn: 'cancel',
        onConfirm: ({ e }) => {
          console.log('confirm button has been clicked!');
          console.log('e: ', e);
          // 请求成功后，销毁弹框
          confirmDia.destroy();
        },
        onClose: ({ e, trigger }) => {
          console.log('e: ', e);
          console.log('trigger: ', trigger);
          confirmDia.hide();
        },
      });
    },
    onAlert() {
      const alertDia = this.$dialog.alert({
        header: 'Dialog-Alert-Plugin',
        body: 'Notice: Your balance is going to be empty.',
        confirmBtn: {
          content: 'Got it!',
          variant: 'base',
          theme: 'danger',
        },
        onConfirm: ({ e }) => {
          console.log('confirm e: ', e);
          alertDia.hide();
        },
        onClose: ({ e, trigger }) => {
          console.log('close e: ', e);
          console.log('trigger: ', trigger);
          alertDia.hide();
        },
      });
    },

    onDialogPluginConfirm() {
      const confirmDia = DialogPlugin({
        header: 'Dialog-Confirm-Plugin',
        body: 'Are you sure to delete it?',
        confirmBtn: 'ok',
        cancelBtn: 'cancel',
        onConfirm: ({ e }) => {
          console.log('confirm button has been clicked!');
          console.log('e: ', e);
          confirmDia.hide();
        },
        onClose: ({ e, trigger }) => {
          console.log('e: ', e);
          console.log('trigger: ', trigger);
          confirmDia.hide();
        },
      });
    },
  },
});
</script>
