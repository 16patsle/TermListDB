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
import { computed, ref, watch } from 'vue'
import AppModal, { AppModalMethods } from '../Generic/AppModal.vue'
import AppButton from '../Generic/AppButton.vue'
import { useStore } from '../../store'

import ui from '../../assets/ui'

const store = useStore()
const modal = ref<InstanceType<typeof AppModal> & AppModalMethods>()
const current = computed(() => store.state.terms.currentRemove)

watch(
  () => store.state.terms.askingForRemoveConfirmation,
  (bool: boolean): void => {
    modal.value?.toggleModal(bool)
  }
)

const removeTerm = (): void => {
  if (current.value) {
    store.dispatch('terms/remove', current.value)
  }
}

const close = (): void => {
  store.commit('terms/cancelRemove')
}
</script>
<style></style>
