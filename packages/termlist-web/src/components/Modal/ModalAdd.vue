<template>
  <form @submit.prevent>
    <AppModal ref="modal" :title="ui.addterm">
      <template #modal-body>
        <div v-for="field in mutableFields" :key="field.name" class="field">
          <label class="label">{{ ui[field.name] }}</label>
          <div class="control">
            <input
              v-if="field.type === 'short'"
              :ref="field.name + 'field'"
              class="input"
              type="text"
            />
            <textarea
              v-else-if="field.type === 'long'"
              :ref="field.name + 'field'"
              class="textarea"
              rows="8"
            />
            <AppSelect
              v-else-if="
                field.type === 'select' && field.options instanceof Array
              "
              :ref="field.name + 'field'"
              :options="reduce(field.options)"
              fullwidth
            />
          </div>
        </div>
      </template>
      <template #modal-footer>
        <!--<AppButton :primary="true" @click="saveTerm">{{ ui.add }}</AppButton>-->
        <input
          :value="ui.add"
          type="submit"
          class="button is-primary"
          accesskey="s"
          @click="saveTerm"
        />
        <AppButton @click="close">
          {{ ui.cancel }}
        </AppButton>
      </template>
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
    AppSelect,
  },
  props: {
    ui: {
      type: Object,
      required: true,
    },
    fields: {
      type: Array,
      required: true,
    },
  },
  computed: {
    mutableFields() {
      return this.fields.filter(field => {
        return !field.immutable
      })
    },
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
          _id: termObject.date,
        },
        termObject
      )

      this.toggleModal(false)
    },
    close() {
      this.toggleModal(false)
    },
    reduce(fields) {
      return fields.reduce((allFields, field) => {
        allFields.push({
          name: field,
          ui: this.ui.wordClasses[field],
        })
        return allFields
      }, [])
    },
  },
}
</script>
<style></style>
