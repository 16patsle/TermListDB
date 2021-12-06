<template>
  <AppModal :is-active="true" :title="ui.removeterm" @close="close">
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
import { onMounted, ref } from 'vue'
import AppModal from '../Generic/AppModal.vue'
import AppButton from '../Generic/AppButton.vue'
import { useTermsStore } from '../../stores/terms'
import { globalService } from '../../machines/globalService'
import type { TermType } from '../../types/TermType'

import ui from '../../assets/ui'

const termsStore = useTermsStore()

const current = ref<TermType | undefined>(undefined)

onMounted(() => (current.value = globalService.state.context.currentTerm))

const removeTerm = (): void => {
  if (current.value) {
    termsStore.remove(current.value)
  }
}

const close = () => globalService.send('CANCEL')
</script>
<style></style>
