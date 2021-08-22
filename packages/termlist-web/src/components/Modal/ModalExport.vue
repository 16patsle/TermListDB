<template>
  <AppModal ref="modal" :title="ui.exportTerms" :close-callback="close">
    <template #modal-body>
      <p class="subtitle">{{ exportInstructions }}</p>
      <a
        :href="exportUri"
        :disabled="!exported"
        class="button is-primary"
        download="terms.json"
        @click="downloadExport"
        >{{ ui.download }}</a
      >
    </template>
  </AppModal>
</template>

<script lang="ts">
export type ModalExportMethods = {
  confirmExportTerm(): void
}
</script>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import AppModal, { AppModalMethods } from '../Generic/AppModal.vue'

import ui from '../../assets/ui'

const props = defineProps<{ exportUri: string }>()
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'export'): void
}>()

const exportInstructions = computed((): string => {
  if (exported) {
    return ui.downloadExportInstructions
  } else {
    return ui.processingExport
  }
})

const exported = computed((): boolean => Boolean(props.exportUri))

const modal = ref<InstanceType<typeof AppModal> & AppModalMethods>()

const toggleModal = (bool: boolean): void => {
  modal.value?.toggleModal(bool)
}

const confirmExportTerm = (): void => {
  toggleModal(true)

  exportTerms()
}

const close = (): void => {
  toggleModal(false)

  emit('close')
}

const exportTerms = (): void => {
  emit('export')
}

const downloadExport = (e: MouseEvent): void => {
  if (!exported) {
    e.preventDefault()
  }
}

defineExpose({ confirmExportTerm })
</script>
<style></style>
