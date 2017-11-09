<template>
<Modal ref="modal" :title="ui.addterm" :callback="saveTerm" :ok-text="ui.add" :cancel-text="ui.cancel">
  <div slot="modal-body">
    <div class="field">
      <label class="label">{{ui.term}}</label>
      <div class="control">
        <input class="input" type="text" ref="termfield">
      </div>
    </div>
    <div class="field">
      <label class="label">{{ui.description}}</label>
      <div class="control">
        <textarea class="textarea" ref="descfield"></textarea>
      </div>
    </div>
  </div>
</Modal>
</template>
<script>
import Modal from './components/Modal.vue';

export default {
  components: {
    Modal
  },
  props: ['ui'],
  methods: {
    toggleModal(bool) {
      this.$refs.modal.toggleModal(bool);
    },
    addTerm() {
      this.toggleModal(true);
    },
    saveTerm() {
      this.$emit('save', {
        _id: new Date().toJSON()
      }, {
        term: this.$refs.termfield.value,
        desc: this.$refs.descfield.value
      });
      this.$refs.termfield.value = '';
      this.$refs.descfield.value = '';
      this.toggleModal(false);
    }
  }
}
</script>
<style>

</style>
