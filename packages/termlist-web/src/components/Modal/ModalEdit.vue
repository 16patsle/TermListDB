<template>
<Modal ref="modal" :title="ui.editterm" :callback="saveTerm" :ok-text="ui.save" :cancel-text="ui.cancel">
  <div slot="modal-body">
    <div class="field" v-for="field in fields" v-if="!field.immutable">
      <label class="label">{{ui[field.name]}}</label>
      <div class="control">
        <input v-if="field.type === 'short'" class="input" type="text" :ref="field.name+'field'">
        <textarea v-else-if="field.type === 'long'" class="textarea" :ref="field.name+'field'"></textarea>
      </div>
    </div>
  </div>
</Modal>
</template>
<script>
import Modal from './Modal.vue';

export default {
  data() {
    return {
      current: null
    }
  },
  components: {
    Modal
  },
  props: ['ui', 'fields'],
  methods: {
    toggleModal(bool) {
      this.$refs.modal.toggleModal(bool);
    },
    editTerm(current) {
      this.current = current;

      for (const field of this.fields) {
        if (!field.immutable && this.$refs[field.name + 'field']) {
          this.$refs[field.name + 'field'][0].value = this.current[field.name] || '';
        }
      }
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

      this.$emit('save', this.current, termObject);

      this.toggleModal(false);

      this.current = null;
    }
  }
}
</script>
<style>

</style>
