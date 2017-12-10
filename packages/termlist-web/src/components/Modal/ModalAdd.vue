<template>
<Modal ref="modal" :title="ui.addterm" :callback="saveTerm" :ok-text="ui.add" :cancel-text="ui.cancel">
  <div slot="modal-body">
    <div class="field" v-for="field in fields" v-if="!field.immutable">
      <label class="label">{{ui[field.name]}}</label>
      <div class="control">
        <input v-if="field.type === 'short'" class="input" type="text" :ref="field.name+'field'">
        <textarea v-else-if="field.type === 'long'" class="textarea" rows="8" :ref="field.name+'field'"></textarea>
        <div v-else-if="field.type === 'select' && field.options instanceof Array" class="select is-fullwidth">
          <select :ref="field.name+'field'">
            <option v-for="option in field.options" :value="option">{{ui.wordClasses[option]}}</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</Modal>
</template>
<script>
import Modal from './Modal.vue';

export default {
  components: {
    Modal
  },
  props: ['ui', 'fields'],
  methods: {
    toggleModal(bool) {
      this.$refs.modal.toggleModal(bool);
    },
    addTerm() {
      this.toggleModal(true);
    },
    saveTerm() {
      let termObject = {}

      for (const field of this.fields) {
        if (!field.immutable && this.$refs[field.name + 'field']) {
          termObject[field.name] = this.$refs[field.name + 'field'][0].value;
          this.$refs[field.name + 'field'][0].value = '';
        }
      }

      this.$emit('save', {
        _id: new Date().toJSON()
      }, termObject);

      this.toggleModal(false);
    }
  }
}
</script>
<style>

</style>
