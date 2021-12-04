<template>
  <AppModal :is-active="showModal" :title="ui.removeterm" @close="close">
    <template #modal-body>
      <p class="subtitle">
        {{ ui.wanttoremove }}
      </p>
      <p>{{ current?.term || '' }}</p>
    </template>
    <template #modal-footer>
      <AppButton danger @click="removeTerm"> {{ ui.removeterm }}! </AppButton>
      <AppButton @click="close">
        {{ ui.cancel }}
      </AppButton>
    </template>
  </AppModal>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import AppModal from '../Generic/AppModal.vue'
import AppButton from '../Generic/AppButton.vue'
import { useTermsStore } from '../../stores/terms'
import { globalService } from '../../machines/globalService'

import ui from '../../assets/ui'
import type { TermType } from '../../types/TermType'

const termsStore = useTermsStore()

const showModal = ref(false)
const current = ref<TermType | undefined>(undefined)

globalService.onTransition(state => {
  showModal.value = state.value === 'removing'
  current.value = state.context.currentTerm
})

const removeTerm = (): void => {
  if (current.value) {
    termsStore.remove(current.value)
  }
}

const close = () => globalService.send('CANCEL')
</script>
<style></style>
