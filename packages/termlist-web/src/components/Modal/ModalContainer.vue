<template>
  <div>
    <ModalEdit v-if="showEditModal" />
    <ModalRemove />
    <ModalImport />
    <ModalImporting />
    <ModalExport />
    <ModalAuth />
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

addTransitionListener(state => {
  if (state.changed) {
    if (state.value === 'editing') {
      showEditModal.value = true
    } else if (state.history?.value === 'editing') {
      showEditModal.value = false
    }
  }
})
</script>
<style></style>
