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
            :value="importStore.$state.imported"
            :max="importStore.$state.total"
            class="progress is-primary"
          >
            {{
              Math.round(
                (importStore.$state.imported / importStore.$state.total) * 100
              )
            }}%
          </progress>
          <p class="has-text-centered">
            {{ importStore.$state.imported }} /
            {{ importStore.$state.total }}
          </p>
          <p class="has-text-centered">
            {{
              Math.round(
                (importStore.$state.imported / importStore.$state.total) * 100
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
import { globalService } from '../../machines/globalService'

import ui from '../../assets/ui'
import { useImportStore } from '../../stores/import'

const importStore = useImportStore()

const modal = ref<InstanceType<typeof AppModal> & AppModalMethods>()

globalService.onTransition(state => {
  modal.value?.toggleModal(state.value === 'importing')
})

const close = () => globalService.send('CANCEL')
</script>
<style></style>
