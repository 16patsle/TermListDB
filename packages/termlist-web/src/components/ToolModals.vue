<template>
  <div>
    <ModalImport v-if="showImportModal" />
    <ModalImporting v-if="showImportingModal" />
    <ModalExport v-if="showExportModal" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { currentState } from '../machines/globalService'
import ModalImport from './Modal/ModalImport.vue'
import ModalImporting from './Modal/ModalImporting.vue'
import ModalExport from './Modal/ModalExport.vue'

const showImportModal = computed(() => currentState.value === 'confirmImport')
const showImportingModal = computed(() => currentState.value === 'importing')
const showExportModal = computed(() => currentState.value === 'exporting')
</script>
<style></style>
