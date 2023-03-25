<template>
  <AppModal is-active :title="ui.duplicates" @close="close">
    <template #modal-body>
      <div>
        <ul>
          <li
            v-for="[term, count] in Object.entries(
              dedupeStore.$state.duplicatedTerms ?? {}
            )"
            :key="term"
          >
            {{ term }} ({{ count }})
            <AppButton @click="search(term)">
              {{ ui.search }}
            </AppButton>
          </li>
        </ul>
      </div>
    </template>
    <template #modal-footer>
      <AppButton @click="close">
        {{ ui.close }}
      </AppButton>
    </template>
  </AppModal>
</template>

<script lang="ts" setup>
import AppModal from '../Generic/AppModal.vue'
import AppButton from '../Generic/AppButton.vue'
import { globalService } from '@/machines/globalService'
import { useDedupeStore } from '@/stores/dedupe'
import { useTermsStore } from '@/stores/terms'

import ui from '@/assets/ui'

const dedupeStore = useDedupeStore()
const termsStore = useTermsStore()

const close = () => globalService.send('CANCEL')
const search = (term: string) => {
  if (term) {
    globalService.send('SEARCH')
    termsStore.setSearch(term)
  }
}
</script>

<style lang="scss">
@import '@/assets/includes';
@import 'bulma/sass/elements/progress';
@import 'bulma/sass/form/shared';
@import 'bulma/sass/form/tools';
</style>
