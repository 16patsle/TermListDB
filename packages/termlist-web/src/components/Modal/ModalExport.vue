<template>
<Modal ref="modal" :title="ui.exportTerms" :closeCallback="close" :ok-text="null" :cancel-text="null">
  <div slot="modal-body">
    <p class="subtitle">{{exportInstructions}}</p>
    <a :href="exportUri" class="button is-primary" :disabled="!exported" download="terms.json" @click="downloadExport">{{ui.download}}</a>
  </div>
</Modal>
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
    exportUri: {
      type: String,
      required: true
    }
  },
  data() {
    return {}
  },
  computed: {
    exportInstructions() {
      if (this.exported) {
        return this.ui.downloadExportInstructions
      } else {
        return this.ui.processingExport
      }
    },
    exported() {
      return Boolean(this.exportUri)
    }
  },
  methods: {
    toggleModal(bool) {
      this.$refs.modal.toggleModal(bool)
    },
    confirmExportTerm() {
      this.toggleModal(true)

      this.exportTerms()
    },
    close() {
      this.toggleModal(false)

      this.$emit('close')
    },
    exportTerms() {
      this.$emit('export')
    },
    downloadExport(e) {
      if (!this.exported) {
        e.preventDefault()
      }
    }
  }
}
</script>
<style>
</style>
