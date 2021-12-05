<template>
  <div>
    <ModalEdit v-if="showEditModal" />
    <ModalRemove v-if="showRemoveModal" />
    <ModalImport v-if="showImportModal" />
    <ModalImporting v-if="showImportingModal" />
    <ModalExport v-if="showExportModal" />
    <ModalAuth v-if="showAuthModal" />
  </div>
</template>

<script lang="ts" setup>
import { defineAsyncComponent, ref } from 'vue'
import { addTransitionListener } from '../../utils/addTransitionListener'

const ModalEdit = defineAsyncComponent(
  () => import(/* webpackPrefetch: true */ './ModalEdit.vue')
)
const ModalRemove = defineAsyncComponent(() => import('./ModalRemove.vue'))
const ModalImport = defineAsyncComponent(() => import('./ModalImport.vue'))
const ModalImporting = defineAsyncComponent(
  () => import('./ModalImporting.vue')
)
const ModalExport = defineAsyncComponent(() => import('./ModalExport.vue'))
const ModalAuth = defineAsyncComponent(
  () => import(/* webpackPreload: true */ './ModalAuth.vue')
)

const showEditModal = ref(false)
const showRemoveModal = ref(false)
const showImportModal = ref(false)
const showImportingModal = ref(false)
const showExportModal = ref(false)
const showAuthModal = ref(false)

addTransitionListener(state => {
  if (state.changed) {
    showEditModal.value = state.value === 'editing'
    showRemoveModal.value = state.value === 'removing'
    showImportModal.value = state.value === 'confirmImport'
    showImportingModal.value = state.value === 'importing'
    showExportModal.value = state.value === 'exporting'
    showAuthModal.value = state.value === 'authenticating'
  }
})
</script>
<style></style>
