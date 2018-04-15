<template>
  <form @submit.prevent>
    <Modal
      ref="modal"
      :title="ui.addterm">
      <div slot="modal-body">
        <div
          v-for="field in fields"
          v-if="!field.immutable"
          :key="field.name"
          class="field">
          <label class="label">{{ ui[field.name] }}</label>
          <div class="control">
            <input
              v-if="field.type === 'short'"
              :ref="field.name+'field'"
              class="input"
              type="text">
            <textarea
              v-else-if="field.type === 'long'"
              :ref="field.name+'field'"
              class="textarea"
              rows="8"/>
            <div
              v-else-if="field.type === 'select' && field.options instanceof Array"
              class="select is-fullwidth">
              <select :ref="field.name+'field'">
                <option
                  v-for="option in field.options"
                  :key="option"
                  :value="option">{{ ui.wordClasses[option] }}</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div slot="modal-footer">
        <!--<AppButton :primary="true" @click="saveTerm">{{ ui.add }}</AppButton>-->
        <input
          :value="ui.add"
          type="submit"
          class="button is-primary"
          accesskey="s"
          @click="saveTerm">
        <AppButton @click="close">{{ ui.cancel }}</AppButton>
      </div>
    </Modal>
  </form>
</template>
<script>
import Modal from './Modal.vue'
import AppButton from '../Generic/AppButton.vue'

export default {
  components: {
    Modal,
    AppButton
  },
  props: {
    ui: {
      type: Object,
      required: true
    },
    fields: {
      type: Array,
      required: true
    }
  },
  methods: {
    toggleModal(bool) {
      this.$refs.modal.toggleModal(bool)
    },
    addTerm() {
      this.toggleModal(true)
      this.$refs.modal.$el
        .querySelector('.field input, .field textarea, .field select')
        .focus()
    },
    saveTerm() {
      let termObject = {}

      for (const field of this.fields) {
        if (!field.immutable && this.$refs[field.name + 'field']) {
          termObject[field.name] = this.$refs[field.name + 'field'][0].value
          this.$refs[field.name + 'field'][0].value = ''
        }
      }

      termObject.date = new Date().toJSON()

      this.$emit(
        'save',
        {
          _id: termObject.date
        },
        termObject
      )

      this.toggleModal(false)
    },
    close() {
      this.toggleModal(false)
    }
  }
}
</script>
<style>
</style>
