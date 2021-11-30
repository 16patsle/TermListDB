<template>
  <AppModal ref="modal" :title="ui.exportTerms" :close-callback="close">
    <template #modal-body>
      <p class="subtitle">{{ exportInstructions }}</p>
      <a
        :href="exportURI"
        :disabled="!exportURI ? true : null"
        class="button is-primary"
        download="terms.json"
        @click="downloadExport"
        >{{ ui.download }}</a
      >
    </template>
    <template #modal-footer>
      <AppButton @click="close">
        {{ ui.close }}
      </AppButton>
    </template>
  </AppModal>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import AppModal, { AppModalMethods } from '../Generic/AppModal.vue'
import AppButton from '../Generic/AppButton.vue'
import { useImportStore } from '../../stores/import'
import { globalService } from '../../machines/globalService'

import ui from '../../assets/ui'

const importStore = useImportStore()

const exportURI = ref<string | undefined>(undefined)
const exportInstructions = computed(() =>
  exportURI.value ? ui.downloadExportInstructions : ui.processingExport
)

const modal = ref<InstanceType<typeof AppModal> & AppModalMethods>()

globalService.onTransition(state => {
  if (state.value === 'exporting' && state.history?.value !== 'exporting') {
    modal.value?.toggleModal(true)
    importStore.export().then(uri => (exportURI.value = uri))
  } else if (
    state.value !== 'exporting' &&
    state.history?.value === 'exporting'
  ) {
    modal.value?.toggleModal(false)
  }
})

const close = () => globalService.send('CANCEL')

const downloadExport = (e: MouseEvent): void => {
  if (!exportURI.value) {
    e.preventDefault()
  }
}
</script>
<style></style>
