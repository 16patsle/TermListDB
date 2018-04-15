<template>
  <AppModal
    ref="modal"
    :title="current.term">
    <div slot="modal-body">
      <div
        v-for="field in fields"
        v-if="!field.immutable && current[field.name] && field.name !== 'term'"
        :key="field.name"
        class="content">
        <h4>{{ ui[field.name] }}</h4>
        <p v-html="getFieldValue(field)"/>
      </div>
    </div>
    <div slot="modal-footer">
      <AppButton @click="close">{{ ui.close }}</AppButton>
    </div>
  </AppModal>
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
    },
    md: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      current: {}
    }
  },
  methods: {
    toggleModal(bool) {
      this.$refs.modal.toggleModal(bool)
    },
    showTerm(current) {
      this.current = current

      /*for (const field of this.fields) {
        if (!field.immutable && this.$refs[field.name + 'field']) {
          this.$refs[field.name + 'field'][0].value =
            this.current[field.name] || ''
        }
      }*/
      this.toggleModal(true)
    },
    close() {
      this.toggleModal(false)
    },
    getFieldValue(field) {
      if (!this.current[field.name]) {
        return ''
      } else if (field.name === 'desc') {
        return this.md.render(String(this.current[field.name]))
      } else if (field.name === 'type') {
        return this.ui.wordClasses[this.current.type]
      } else if (field.name === 'date') {
        let date = new Date(this.current.date)
        return new Intl.DateTimeFormat(undefined, {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }).format(date)
      } else {
        return this.current[field.name]
      }
    }
  }
}
</script>
<style>
.content {
  white-space: pre-line;
}
</style>
