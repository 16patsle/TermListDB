<template>
  <form @submit.prevent>
    <AppModal ref="modal" :title="ui.editterm">
      <div slot="modal-body">
        <div v-for="field in fields" v-if="!field.immutable" :key="field.name" class="field">
          <label class="label">{{ ui[field.name] }}</label>
          <div class="control">
            <input
              v-if="field.type === 'short'"
              :ref="field.name+'field'"
              class="input"
              type="text"
            >
            <textarea
              v-else-if="field.type === 'long'"
              :ref="field.name+'field'"
              class="textarea"
              rows="8"
            />
            <AppSelect
              v-else-if="field.type === 'select' && field.options instanceof Array"
              :ref="field.name+'field'"
              :options="reduce(field.options)"
              fullwidth
            />
          </div>
        </div>
      </div>
      <div slot="modal-footer">
        <input
          :value="ui.save"
          type="submit"
          class="button is-primary"
          accesskey="s"
          @click="saveTerm"
        >
        <AppButton @click="close">{{ ui.cancel }}</AppButton>
      </div>
    </AppModal>
  </form>
</template>
<script>
import AppModal from '../Generic/AppModal.vue'
import AppButton from '../Generic/AppButton.vue'
import AppSelect from '../Generic/AppSelect.vue'

export default {
  components: {
    AppModal,
    AppButton,
    AppSelect
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
  data() {
    return {
      current: null
    }
  },
  methods: {
    toggleModal(bool) {
      this.$refs.modal.toggleModal(bool)
    },
    editTerm(current) {
      this.current = current

      for (const field of this.fields) {
        if (!field.immutable && this.$refs[field.name + 'field']) {
          this.$refs[field.name + 'field'][0].value =
            this.current[field.name] || ''
        }
      }
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

      if (!termObject.date) {
        termObject.date = this.current._id
      }

      this.$emit('save', this.current, termObject)

      this.toggleModal(false)

      this.current = null
    },
    close() {
      this.toggleModal(false)
    },
    reduce(fields) {
      return fields.reduce((allFields, field) => {
        allFields.push({
          name: field,
          ui: this.ui.wordClasses[field]
        })
        return allFields
      }, [])
    }
  }
}
</script>
<style>
</style>
