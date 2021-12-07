<template>
  <div>
    <ModalEdit v-if="showEditModal" :term="currentContext.currentTerm" />
    <ModalRemove v-if="showRemoveModal" :term="currentContext.currentTerm" />
    <ModalImport v-if="showImportModal" />
    <ModalImporting v-if="showImportingModal" />
    <ModalExport v-if="showExportModal" />
    <ModalTools v-if="showToolsModal" />
    <ModalAuth v-if="showAuthModal" />
  </div>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent } from 'vue'
import { currentState, currentContext } from '../machines/globalService'
import AppLoadingModal from './Generic/AppLoadingModal.vue'

const ModalEdit = defineAsyncComponent(
  () => import(/* webpackPrefetch: true */ './Modal/ModalEdit.vue')
)
const ModalRemove = defineAsyncComponent(
  () => import('./Modal/ModalRemove.vue')
)
const ModalImport = defineAsyncComponent({
  loader: () => import('./Modal/ModalImport.vue'),
  delay: 0,
  loadingComponent: AppLoadingModal,
})
const ModalImporting = defineAsyncComponent({
  loader: () => import('./Modal/ModalImporting.vue'),
  delay: 0,
  loadingComponent: AppLoadingModal,
})
const ModalExport = defineAsyncComponent({
  loader: () => import('./Modal/ModalExport.vue'),
  delay: 0,
  loadingComponent: AppLoadingModal,
})
const ModalTools = defineAsyncComponent(() => import('./Modal/ModalTools.vue'))
const ModalAuth = defineAsyncComponent(
  () => import(/* webpackPreload: true */ './Modal/ModalAuth.vue')
)

const showEditModal = computed(() => currentState.value === 'editing')
const showRemoveModal = computed(() => currentState.value === 'removing')
const showImportModal = computed(() => currentState.value === 'confirmImport')
const showImportingModal = computed(() => currentState.value === 'importing')
const showExportModal = computed(() => currentState.value === 'exporting')
const showToolsModal = computed(() => currentState.value === 'viewTools')
const showAuthModal = computed(() => currentState.value === 'authenticating')
</script>
<style></style>
