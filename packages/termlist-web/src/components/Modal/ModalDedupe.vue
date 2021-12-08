<template>
  <AppModal :is-active="true" :title="ui.duplicates" @close="close">
    <template #modal-body>
      <p class="subtitle">{{ ui.processingDedupe }}</p>
      <div class="field">
        <div class="control">
          <progress :value="processed" :max="total" class="progress is-primary">
            {{ percent }}%
          </progress>
          <p class="has-text-centered">
            {{ processed }} /
            {{ total }}
          </p>
          <p class="has-text-centered">{{ percent }}%</p>
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
import { computed } from 'vue'
import AppModal from '../Generic/AppModal.vue'
import AppButton from '../Generic/AppButton.vue'
import { globalService } from '../../machines/globalService'

import ui from '../../assets/ui'
import { useDedupeStore } from '../../stores/dedupe'
import { useTermsStore } from '../../stores/terms'

const dedupeStore = useDedupeStore()
const termsStore = useTermsStore()

const processed = computed(() => dedupeStore.$state.processed)
const total = computed(() => termsStore.$state.totalRows)
const percent = computed(() =>
  Math.round((processed.value / total.value) * 100)
)

dedupeStore.checkForDuplicates()

const close = () => globalService.send('CANCEL')
</script>
<style></style>
