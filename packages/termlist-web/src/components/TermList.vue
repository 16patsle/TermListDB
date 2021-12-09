<template>
  <div class="termlist-container">
    <AppPagination
      :firstpage="1"
      :currentpage="currentPage"
      :lastpage="lastPage"
      @gotopage="gotoPage"
    />
    <div class="content-container">
      <AppLoading v-if="loading" class="loading-indicator" />
      <div v-if="termCount < 1" class="no-terms-indicator">
        {{ ui.noTermsMatching }}
      </div>
      <TermTable v-else :terms="terms" @edit="edit" @remove="remove" />
    </div>
    <AppPagination
      class="is-hidden-mobile"
      :firstpage="1"
      :currentpage="currentPage"
      :lastpage="lastPage"
      @gotopage="gotoPage"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import AppPagination from './Generic/AppPagination.vue'
import AppLoading from './Generic/AppLoading.vue'
import TermTable from './TermList/TermTable.vue'
import { currentState, globalService } from '../machines/globalService'

import type { TermType } from '../types/TermType'

import ui from '../assets/ui'
import { useTermsStore } from '../stores/terms'

const termsStore = useTermsStore()
const loading = computed(() => currentState.value === 'loading')
const currentPage = computed(() => termsStore.$state.currentPage)
const terms = computed(() => Array.from(termsStore.$state.terms.values()))

const termCount = computed((): number => {
  return terms.value.length
})

const lastPage = computed((): number => {
  if (termCount.value < 20) {
    return currentPage.value
  } else {
    return Math.ceil(termsStore.$state.totalRows / 20)
  }
})

const edit = (term: TermType) => globalService.send({ type: 'EDIT', term })
const remove = (term: TermType) =>
  globalService.send({ type: 'PROMPT_REMOVE', term })
const gotoPage = (pageNumber: number) =>
  termsStore.gotoPage({
    pageNumber,
    currentPage: currentPage.value,
  })
</script>

<style lang="scss">
@import 'bulma/sass/helpers/visibility';
</style>

<style scoped>
.termlist-container {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content-container {
  position: relative;
  overflow-y: scroll;
}

.loading-indicator {
  position: absolute;
  top: 0;
}

.no-terms-indicator {
  margin-bottom: 1.5em;
}

.pagination:not(:last-child) {
  margin-bottom: 0.75rem;
}

.pagination:last-child {
  margin-bottom: 0.75rem;
  margin-top: 0.75rem;
}
</style>
