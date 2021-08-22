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
      <AppButton primary @click="importTerm"> {{ ui.importTerms }}! </AppButton>
      <AppButton @click="close">
        {{ ui.cancel }}
      </AppButton>
    </template>
  </AppModal>
</template>

<script lang="ts">
export type ModalImportMethods = {
  confirmImportTerm(): void
}
</script>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import AppModal, { AppModalMethods } from '../Generic/AppModal.vue'
import AppButton from '../Generic/AppButton.vue'
import type { TermType } from '../../types/TermType'

import ui from '../../assets/ui'

const emit = defineEmits<{
  (e: 'import', importedTerms: TermType[]): void
}>()

const selectedFile = ref<File | null>(null)
const importedTerms = ref<TermType[]>([])
let fileReader: FileReader

const modal = ref<InstanceType<typeof AppModal> & AppModalMethods>()
const importFile = ref<InstanceType<typeof HTMLInputElement>>()

const fileInfo = computed((): string | null => {
  if (selectedFile.value && selectedFile.value.name) {
    return selectedFile.value.name
  } else {
    return null
  }
})

const toggleModal = (bool: boolean): void => {
  modal.value?.toggleModal(bool)
}

const confirmImportTerm = (): void => {
  toggleModal(true)
}

const importTerm = (): void => {
  if (
    selectedFile.value &&
    selectedFile.value.type === 'application/json' &&
    selectedFile.value.size > 0
  ) {
    fileReader = new FileReader()
    fileReader.onload = () => {
      if (fileReader && fileReader.result) {
        let file = JSON.parse(fileReader.result.toString())

        prepareFileImport(file)
      }
    }
    fileReader.readAsText(selectedFile.value)
  }
}

const prepareFileImport = (file: TermType[]): void => {
  importedTerms.value = [...file]

  emit('import', importedTerms.value)

  close()
}

const close = (): void => {
  if (!importFile.value) {
    return
  }

  toggleModal(false)

  importFile.value.value = ''
  selectedFile.value = null
}

const handleFiles = (e: Event): void => {
  const files = (e.target as HTMLInputElement).files
  selectedFile.value = files ? files[0] : null
}

defineExpose({ confirmImportTerm })
</script>
<style></style>
