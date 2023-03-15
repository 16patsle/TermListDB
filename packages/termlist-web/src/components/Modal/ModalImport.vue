<template>
  <AppModal is-active :title="ui.importTerms" @close="close">
    <template #modal-body>
      <p class="subtitle">
        {{ ui.trelloImportInstructions }}
      </p>
      <AppInputField>
        <AppFileInput
          :label="ui.browseForFile"
          accept="application/json"
          centered
          @change="selectedFile = $event"
        />
      </AppInputField>
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
import { ref } from 'vue'
import AppModal from '../Generic/AppModal.vue'
import AppInputField from '../Generic/AppInputField.vue'
import AppButton from '../Generic/AppButton.vue'
import { useImportStore } from '@/stores/import'
import { globalService } from '@/machines/globalService'
import type { TermType } from '@/types/TermType'

import ui from '@/assets/ui'
import AppFileInput from '../Generic/AppFileInput.vue'

import(/* webpackPreload: true */ './ModalImporting.vue')

const importStore = useImportStore()

const selectedFile = ref<File | undefined>()
let fileReader: FileReader

const importTerm = () => {
  //return
  if (
    selectedFile.value &&
    selectedFile.value.type === 'application/json' &&
    selectedFile.value.size > 0
  ) {
    fileReader = new FileReader()
    fileReader.onload = () => {
      if (fileReader && fileReader.result) {
        let file: TermType[] = JSON.parse(fileReader.result.toString())

        globalService.send('IMPORT')
        return importStore.import([...file])
      }
    }
    fileReader.readAsText(selectedFile.value)
  }
}

const close = () => globalService.send('CANCEL')
</script>
