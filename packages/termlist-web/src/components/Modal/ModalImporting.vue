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
    <template #modal-footer>
      <AppButton @click="close">
        {{ ui.cancel }}
      </AppButton>
    </template>
  </AppModal>
</template>
<script lang="ts"></script>

<script lang="ts" setup>
import { ref } from 'vue'
import AppModal, { AppModalMethods } from '../Generic/AppModal.vue'
import AppButton from '../Generic/AppButton.vue'
import { useStore } from '../../stores'
import { globalService } from '../../machines/globalService'

import ui from '../../assets/ui'

const store = useStore()

const modal = ref<InstanceType<typeof AppModal> & AppModalMethods>()

globalService.onTransition(state => {
  modal.value?.toggleModal(state.value === 'importing')
})

const close = () => globalService.send('CANCEL')
</script>
<style></style>
