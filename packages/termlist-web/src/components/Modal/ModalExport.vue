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
  </AppModal>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import AppModal, { AppModalMethods } from '../Generic/AppModal.vue'
import { useStore } from '../../store'

import ui from '../../assets/ui'

const store = useStore()

const exportInstructions = computed(() => {
  if (exportURI.value) {
    return ui.downloadExportInstructions
  } else {
    return ui.processingExport
  }
})

const exportURI = computed(() => store.state.import.exportURI)

const modal = ref<InstanceType<typeof AppModal> & AppModalMethods>()

const toggleModal = (bool: boolean): void => {
  modal.value?.toggleModal(bool)
}

const confirmExportTerm = (bool: boolean): void => {
  if (bool) {
    toggleModal(true)

    store.dispatch('import/export')
  }
}

watch(() => store.state.import.askingForExportConfirmation, confirmExportTerm)

const close = (): void => {
  toggleModal(false)

  store.commit('import/cancelExport')
}

const downloadExport = (e: MouseEvent): void => {
  if (!exportURI.value) {
    e.preventDefault()
  }
}
</script>
<style></style>
