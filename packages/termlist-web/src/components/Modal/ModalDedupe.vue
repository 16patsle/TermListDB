<template>
  <AppModal :is-active="true" :title="ui.duplicates" @close="close">
    <template #modal-body>
      <p v-if="!complete" class="subtitle">
        {{ ui.processingDedupe }}
      </p>
      <div v-if="!complete" class="field">
        <div class="control">
          <progress :value="processed" :max="total" class="progress is-primary">
            {{ percent }}%
          </progress>
          <p class="has-text-centered">
            {{ processed }} /
            {{ total }}
          </p>
          <p class="has-text-centered">{{ percent }}%</p>
          <p class="has-text-centered">
            {{ ui.numberOfDuplicates }}:
            {{ dedupeStore.$state.duplicatedTerms.length }}
          </p>
        </div>
      </div>
      <div v-if="complete">
        <ul>
          <li
            v-for="term in dedupeStore.$state.duplicatedTerms"
            :key="term._id"
          >
            {{ term.term }}
            <AppButton @click="search(term)">
              {{ ui.search }}
            </AppButton>
          </li>
        </ul>
      </div>
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
import { useDedupeStore } from '../../stores/dedupe'
import { useTermsStore } from '../../stores/terms'
import type { TermType } from '../../types/TermType'

import ui from '../../assets/ui'

const dedupeStore = useDedupeStore()
const termsStore = useTermsStore()

const processed = computed(() => dedupeStore.$state.processed)
const total = computed(() => termsStore.$state.totalRows)
const percent = computed(() =>
  Math.round((processed.value / total.value) * 100)
)
const complete = computed(() => dedupeStore.$state.complete)

dedupeStore.checkForDuplicates()

const close = () => globalService.send('CANCEL')
const search = (term: TermType) => {
  if (term.term) {
    globalService.send('SEARCH')
    termsStore.search(term.term)
  }
}
</script>
<style></style>
