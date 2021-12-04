<template>
  <AppModal :is-active="showModal" :title="ui.importTerms" @close="close">
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
                  <fa-icon :icon="['fas', 'upload']" />
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

<script lang="ts" setup>
import { computed, ref } from 'vue'
import AppModal from '../Generic/AppModal.vue'
import AppButton from '../Generic/AppButton.vue'
import { useImportStore } from '../../stores/import'
import { globalService } from '../../machines/globalService'

import ui from '../../assets/ui'

const importStore = useImportStore()

const showModal = ref(false)
const selectedFile = ref<File | null>(null)
let fileReader: FileReader

const importFile = ref<InstanceType<typeof HTMLInputElement>>()

const fileInfo = computed((): string | null => {
  if (selectedFile.value && selectedFile.value.name) {
    return selectedFile.value.name
  } else {
    return null
  }
})

globalService.onTransition(state => {
  showModal.value = state.value === 'confirmImport'
})

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

        globalService.send('IMPORT')
        clear()
        importStore.import([...file])
      }
    }
    fileReader.readAsText(selectedFile.value)
  }
}

const clear = (): void => {
  if (importFile.value) {
    importFile.value.value = ''
  }
  selectedFile.value = null
}

const close = (): void => {
  clear()
  globalService.send('CANCEL')
}

const handleFiles = (e: Event): void => {
  const files = (e.target as HTMLInputElement).files
  selectedFile.value = files ? files[0] : null
}
</script>
<style></style>
