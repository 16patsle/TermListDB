<template>
  <AppModal
    ref="modal"
    :title="ui.importTerms"
    :close-callback="close"
    :cancel-text="ui.cancel"
  >
    <template #modal-body>
      <p class="subtitle">
        {{ ui.processingImport }}
      </p>
      <div class="field">
        <div class="control">
          <progress
            :value="store.state.import.imported"
            :max="store.state.import.total"
            class="progress is-primary"
          >
            {{
              Math.round(
                (store.state.import.imported / store.state.import.total) * 100
              )
            }}%
          </progress>
          <p class="has-text-centered">
            {{ store.state.import.imported }} /
            {{ store.state.import.total }}
          </p>
          <p class="has-text-centered">
            {{
              Math.round(
                (store.state.import.imported / store.state.import.total) * 100
              )
            }}%
          </p>
        </div>
      </div>
    </template>
  </AppModal>
</template>
<script lang="ts"></script>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import AppModal, { AppModalMethods } from '../Generic/AppModal.vue'
import { useStore } from '../../store'

import ui from '../../assets/ui'

const store = useStore()

const modal = ref<InstanceType<typeof AppModal> & AppModalMethods>()

const toggleModal = (bool: boolean): void => {
  modal.value?.toggleModal(bool)
}

watch(
  () => store.state.import.finished,
  value => {
    if (!value) {
      toggleModal(true)
    } else {
      toggleModal(false)
    }
  },
  {
    immediate: true,
  }
)

const close = (): void => {
  toggleModal(false)

  store.commit('import/cancel')
}
</script>
<style></style>
