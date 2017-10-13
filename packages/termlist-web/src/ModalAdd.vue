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
  data() {
    return {
      current: null
    }
  },
  components: {
    Modal
  },
  props: ['ui'],
  methods: {
    toggleModal(bool) {
      this.$refs.modal.toggleModal(bool);
    },
    addTerm(current) {
      this.current = current;
      this.toggleModal(true);
    },
    saveTerm() {
      this.$emit('save', this.current, {
        term: this.$refs.termfield.value,
        desc: this.$refs.descfield.value
      });
      this.$refs.termfield.value = '';
      this.$refs.descfield.value = '';
      this.toggleModal(false);
      this.current = null;
    }
  }
}
</script>
<style>

</style>
