<template>
  <AppModal
    ref="modal"
    :title="ui.removeterm"
    :callback="removeTerm"
    :ok-text="ui.save"
    :cancel-text="ui.cancel"
  >
    <template #modal-body>
      <p class="subtitle">
        {{ ui.wanttoremove }}
      </p>
      <p>{{ currentTerm }}</p>
    </template>
    <template #modal-footer>
      <AppButton danger @click="removeTerm"> {{ ui.removeterm }}! </AppButton>
      <AppButton @click="close">
        {{ ui.cancel }}
      </AppButton>
    </template>
  </AppModal>
</template>

<script lang="ts">
export type ModalRemoveMethods = {
  confirmRemoveTerm(term: TermType): void
}
</script>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import AppModal, { AppModalMethods } from '../Generic/AppModal.vue'
import AppButton from '../Generic/AppButton.vue'
import type { TermType } from '../../types/TermType'

import ui from '../../assets/ui'

const emit = defineEmits<{
  (e: 'remove', current: TermType): void
}>()

const current = ref<TermType | null>(null)

const modal = ref<InstanceType<typeof AppModal> & AppModalMethods>()

const currentTerm = computed((): string => {
  return current.value && current.value.term ? current.value.term : ''
})

const toggleModal = (bool: boolean): void => {
  modal.value?.toggleModal(bool)
}

const confirmRemoveTerm = (term: TermType): void => {
  current.value = term
  toggleModal(true)
}

const removeTerm = (): void => {
  if (current.value) {
    emit('remove', current.value)
  }
  toggleModal(false)
}

const close = (): void => {
  toggleModal(false)
}

defineExpose({ confirmRemoveTerm })
</script>
<style></style>
