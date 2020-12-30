<template>
  <AppModal
    ref="modal"
    :title="ui.importTerms"
    :callback="importTerm"
    :close-callback="close"
    :ok-text="ui.save"
    :cancel-text="ui.cancel"
  >
    <template #modal-body>
      <p class="subtitle">
        {{ ui.trelloImportInstructions }}
      </p>
      <div class="field">
        <div class="control">
          <div class="file is-centered has-name is-boxed">
            <label class="file-label">
              <input
                ref="importFile"
                class="file-input"
                type="file"
                accept="application/json"
                @change="handleFiles"
              />
              <span class="file-cta">
                <span class="file-icon">
                  <i class="fa fa-upload" />
                </span>
                <span class="file-label">{{ ui.browseForFile }}</span>
              </span>
              <span v-if="fileInfo" class="file-name">{{ fileInfo }}</span>
            </label>
          </div>
        </div>
      </div>
    </template>
    <template #modal-footer>
      <AppButton primary @click="importTerm">
        {{ ui.importTerms }}!
      </AppButton>
      <AppButton @click="close">
        {{ ui.cancel }}
      </AppButton>
    </template>
  </AppModal>
</template>
<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import AppModal from '../Generic/AppModal.vue'
import AppButton from '../Generic/AppButton.vue'

import type { TermType } from '../../types/TermType'

import ui from '../../assets/ui'

@Component({
  components: {
    AppModal,
    AppButton,
  },
})
export default class ModalImport extends Vue {
  $refs!: {
    modal: AppModal
    importFile: HTMLInputElement
  }

  ui = ui
  selectedFile: File | null = null
  fileReader?: FileReader
  importedTerms: TermType[] = []

  get fileInfo(): string | null {
    if (this.selectedFile && this.selectedFile.name) {
      return this.selectedFile.name
    } else {
      return null
    }
  }

  toggleModal(bool: boolean): void {
    this.$refs.modal.toggleModal(bool)
  }

  confirmImportTerm(): void {
    this.toggleModal(true)
  }

  importTerm(): void {
    if (
      this.selectedFile &&
      this.selectedFile.type === 'application/json' &&
      this.selectedFile.size > 0
    ) {
      this.fileReader = new FileReader()
      this.fileReader.onload = () => {
        if (this.fileReader && this.fileReader.result) {
          let file = JSON.parse(this.fileReader.result.toString())

          this.prepareFileImport(file)
        }
      }
      this.fileReader.readAsText(this.selectedFile)
    }
  }

  prepareFileImport(file: TermType[]): void {
    this.importedTerms = [...file]

    this.$emit('import', this.importedTerms)

    this.close()
  }

  close(): void {
    this.toggleModal(false)

    this.$refs.importFile.value = ''
    this.selectedFile = null
  }

  handleFiles(e: Event): void {
    const files = (e.target as HTMLInputElement).files
    this.selectedFile = files ? files[0] : null
  }
}
</script>
<style></style>
