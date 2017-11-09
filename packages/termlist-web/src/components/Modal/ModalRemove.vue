<template>
<Modal ref="modal" :title="ui.removeterm" :callback="removeTerm" :ok-text="ui.save" :cancel-text="ui.cancel">
  <div slot="modal-body">
    {{ui.wanttoremove}}
  </div>
  <div slot="modal-footer">
    <AppButton danger="true" @click="removeTerm">{{ui.removeterm}}!</AppButton>
    <AppButton @click="close">{{ui.cancel}}</AppButton>
  </div>
</Modal>
</template>
<script>
import Modal from './Modal.vue';
import AppButton from '../Generic/AppButton.vue';

export default {
  components: {
    Modal,
    AppButton
  },
  props: ['ui'],
  methods: {
    toggleModal(bool) {
      this.$refs.modal.toggleModal(bool);
    },
    confirmRemoveTerm(current) {
      this.current = current;
      this.toggleModal(true);
    },
    removeTerm() {
      this.$emit('remove', this.current);
      this.toggleModal(false);
    },
    close() {
      this.toggleModal(false);
    }
  }
}
</script>
<style>

</style>
