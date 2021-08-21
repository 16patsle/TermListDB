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
import { Options, Vue } from 'vue-class-component'
import AppModal from '../Generic/AppModal.vue'

import ui from '../../assets/ui'

@Options({
  components: {
    AppModal,
  },
  props: {
    exportUri: {
      type: String,
      required: true,
    },
  },
})
export default class ModalExport extends Vue {
  $refs!: {
    modal: AppModal
  }

  ui = ui

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
