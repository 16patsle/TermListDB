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

const exportInstructions = computed(() =>
  exportURI.value ? ui.downloadExportInstructions : ui.processingExport
)
const exportURI = computed(() => store.state.import.exportURI)

const modal = ref<InstanceType<typeof AppModal> & AppModalMethods>()

watch(
  () => store.state.import.askingForExportConfirmation,
  (bool: boolean): void => {
    modal.value?.toggleModal(bool)
    if (bool) {
      store.dispatch('import/export')
    }
  }
)

const close = (): void => {
  store.commit('import/cancelExport')
}

const downloadExport = (e: MouseEvent): void => {
  if (!exportURI.value) {
    e.preventDefault()
  }
}
</script>
<style></style>
