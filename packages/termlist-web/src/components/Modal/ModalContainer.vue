<template>
  <div>
    <ModalEdit v-if="showEditModal" :term="currentContext.currentTerm" />
    <ModalRemove v-if="showRemoveModal" :term="currentContext.currentTerm" />
    <ModalImport v-if="showImportModal" />
    <ModalImporting v-if="showImportingModal" />
    <ModalExport v-if="showExportModal" />
    <ModalAuth v-if="showAuthModal" />
  </div>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent } from 'vue'
import { currentState, currentContext } from '../../machines/globalService'

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

const showEditModal = computed(() => currentState.value === 'editing')
const showRemoveModal = computed(() => currentState.value === 'removing')
const showImportModal = computed(() => currentState.value === 'confirmImport')
const showImportingModal = computed(() => currentState.value === 'importing')
const showExportModal = computed(() => currentState.value === 'exporting')
const showAuthModal = computed(() => currentState.value === 'authenticating')
</script>
<style></style>
