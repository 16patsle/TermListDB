<template>
<Modal ref="modal" :title="ui.removeterm" :callback="removeTerm" :ok-text="ui.save" :cancel-text="ui.cancel">
  <div slot="modal-body">
    {{ui.wanttoremove}}
  </div>
  <div slot="modal-footer">
    <button class="button is-danger" @click="removeTerm">{{ui.removeterm}}!</button>
    <button class="button" @click="close">{{ui.cancel}}</button>
  </div>
</Modal>
</template>
<script>
import Modal from './Modal.vue';

export default {
  components: {
    Modal
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
