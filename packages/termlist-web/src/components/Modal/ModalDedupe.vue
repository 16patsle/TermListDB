<template>
  <AppModal is-active :title="ui.duplicates" @close="close">
    <template #modal-body>
      <p v-if="!complete" class="subtitle">
        {{ ui.processingDedupe }}
      </p>
      <AppInputField v-if="!complete">
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
      </AppInputField>
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
import AppInputField from '../Generic/AppInputField.vue'

const dedupeStore = useDedupeStore()
const termsStore = useTermsStore()

const processed = computed(() => dedupeStore.$state.processed)
const total = computed(() => termsStore.$state.totalRows)
const percent = computed(() =>
  Math.round((processed.value / total.value) * 100)
)
const complete = computed(() => dedupeStore.$state.complete)

void dedupeStore.checkForDuplicates()

const close = () => globalService.send('CANCEL')
const search = (term: TermType) => {
  if (term.term) {
    globalService.send('SEARCH')
    termsStore.setSearch(term.term)
  }
}
</script>

<style lang="scss">
@import 'bulma/sass/utilities/controls';
@import 'bulma/sass/utilities/extends';
@import 'bulma/sass/elements/progress';
@import 'bulma/sass/form/shared';
@import 'bulma/sass/form/tools';
</style>
