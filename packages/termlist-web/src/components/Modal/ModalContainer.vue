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
    // Handle switch to current state
    switch (state.value) {
      case 'editing':
        showEditModal.value = true
        break
      case 'removing':
        showRemoveModal.value = true
        break
      case 'confirmImport':
        showImportModal.value = true
        break
      case 'importing':
        showImportModal.value = true
        break
      case 'exporting':
        showExportModal.value = true
        break
      case 'authenticating':
        showAuthModal.value = true
        break
    }
    // Handle switch from previous state
    switch (state.history?.value) {
      case 'editing':
        showEditModal.value = false
        break
      case 'removing':
        showRemoveModal.value = false
        break
      case 'confirmImport':
        showImportModal.value = false
        break
      case 'importing':
        showImportModal.value = false
        break
      case 'exporting':
        showExportModal.value = false
        break
      case 'authenticating':
        showAuthModal.value = false
        break
    }
  }
})
</script>
<style></style>
