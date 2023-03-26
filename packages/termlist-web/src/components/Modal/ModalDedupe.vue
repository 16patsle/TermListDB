<template>
  <AppModal is-active :title="ui.duplicates" @close="close">
    <template #modal-body>
      <p class="subtitle">
        {{ !complete ? ui.processingDedupe : ui.checkingDone }}
      </p>
      <AppInputField>
        <progress
          :value="processed"
          :max="total"
          class="progress is-primary is-large my-4"
        >
          {{ percent }}%
        </progress>
        <p class="has-text-centered">
          {{ processed }} /
          {{ total }}
        </p>
        <p class="has-text-centered">{{ percent }}%</p>
        <p class="has-text-centered">
          {{ ui.numberOfDuplicates }}:
          {{ dedupeStore.$state.duplicatesFound }}
        </p>
      </AppInputField>
    </template>
    <template #modal-footer>
      <AppButton @click="close">
        {{ ui.cancel }}
      </AppButton>
      <AppButton primary :disabled="!complete" @click="showDuplicates"
        >Show duplicates</AppButton
      >
    </template>
  </AppModal>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import AppModal from '../Generic/AppModal.vue'
import AppButton from '../Generic/AppButton.vue'
import { globalService } from '@/machines/globalService'
import { useDedupeStore } from '@/stores/dedupe'
import { useTermsStore } from '@/stores/terms'

import ui from '@/assets/ui'
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
const showDuplicates = () => {
  globalService.send('SHOW_DUPLICATES')
}
</script>

<style lang="scss">
@import '@/assets/includes';
@import 'bulma/sass/elements/progress';
@import 'bulma/sass/form/shared';
@import 'bulma/sass/form/tools';
@import 'bulma/sass/helpers/spacing';
</style>
