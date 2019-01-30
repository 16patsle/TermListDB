<template>
  <AppModal
    ref="modal"
    :title="ui.exportTerms"
    :close-callback="close"
    :ok-text="null"
    :cancel-text="null"
  >
    <div slot="modal-body">
      <p class="subtitle">
        {{ exportInstructions }}
      </p>
      <a
        :href="exportUri"
        :disabled="!exported"
        class="button is-primary"
        download="terms.json"
        @click="downloadExport"
      >
        {{ ui.download }}
      </a>
    </div>
  </AppModal>
</template>
<script>
import AppModal from '../Generic/AppModal.vue'

export default {
  components: {
    AppModal
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
<style></style>
