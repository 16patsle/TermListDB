<template>
  <AppModal :is-active="true" :title="ui.importTerms" @close="close">
    <template #modal-body>
      <p class="subtitle">Checking for duplicates</p>
      <div class="field">
        <div class="control">
          <progress
            :value="dedupeStore.$state.processed"
            :max="termsStore.$state.totalRows"
            class="progress is-primary"
          >
            {{
              Math.round(
                (dedupeStore.$state.processed / termsStore.$state.totalRows) *
                  100
              )
            }}%
          </progress>
          <p class="has-text-centered">
            {{ dedupeStore.$state.processed }} /
            {{ termsStore.$state.totalRows }}
          </p>
          <p class="has-text-centered">
            {{
              Math.round(
                (dedupeStore.$state.processed / termsStore.$state.totalRows) *
                  100
              )
            }}%
          </p>
        </div>
      </div>
      <p>
        {{ dedupeStore.$state.duplicatedTerms.map(t => t.term).join(', ') }}
      </p>
    </template>
    <template #modal-footer>
      <AppButton @click="close">
        {{ ui.cancel }}
      </AppButton>
    </template>
  </AppModal>
</template>

<script lang="ts" setup>
import AppModal from '../Generic/AppModal.vue'
import AppButton from '../Generic/AppButton.vue'
import { globalService } from '../../machines/globalService'

import ui from '../../assets/ui'
import { useDedupeStore } from '../../stores/dedupe'
import { useTermsStore } from '../../stores/terms'

const dedupeStore = useDedupeStore()
const termsStore = useTermsStore()

dedupeStore.checkForDuplicates()

const close = () => globalService.send('CANCEL')
</script>
<style></style>
