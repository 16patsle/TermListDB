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
import { ref } from 'vue'
import ModalEdit from './ModalEdit.vue'
import ModalRemove from './ModalRemove.vue'
import ModalImport from './ModalImport.vue'
import ModalImporting from './ModalImporting.vue'
import ModalExport from './ModalExport.vue'
import ModalAuth from './ModalAuth.vue'
import { addTransitionListener } from '../../utils/addTransitionListener'

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
