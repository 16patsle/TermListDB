<template>
  <AppModal
    ref="modal"
    :title="ui.exportTerms"
    :close-callback="close"
    :ok-text="null"
    :cancel-text="null"
  >
    <template #modal-body>
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
    </template>
  </AppModal>
</template>
<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import AppModal from '../Generic/AppModal.vue'

const ModalExportProps = Vue.extend({
  props: {
    ui: {
      type: Object,
      required: true,
    },
    exportUri: {
      type: String,
      required: true,
    },
  },
})

@Component({
  components: {
    AppModal,
  },
})
export default class ModalExport extends ModalExportProps {
  $refs!: {
    modal: AppModal
  }

  get exportInstructions(): string {
    if (this.exported) {
      return this.ui.downloadExportInstructions
    } else {
      return this.ui.processingExport
    }
  }

  get exported(): boolean {
    return Boolean(this.exportUri)
  }

  toggleModal(bool: boolean): void {
    this.$refs.modal.toggleModal(bool)
  }

  confirmExportTerm(): void {
    this.toggleModal(true)

    this.exportTerms()
  }

  close(): void {
    this.toggleModal(false)

    this.$emit('close')
  }

  exportTerms(): void {
    this.$emit('export')
  }

  downloadExport(e: MouseEvent): void {
    if (!this.exported) {
      e.preventDefault()
    }
  }
}
</script>
<style></style>
