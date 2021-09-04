<template>
  <span>
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
      <table v-if="termCount > 1" class="table is-fullwidth is-hoverable">
        <thead>
          <tr>
            <th
              v-for="field in fields"
              :key="field.name"
              :class="field.name || field.type"
            >
              {{ ui[field.name] }}
            </th>
            <th class="row-buttons" />
          </tr>
        </thead>
        <tbody ref="termlist" class="list">
          <TermRow
            v-for="[id, term] of terms"
            :key="id"
            :term="term"
            @edit="edit"
            @remove="remove"
          />
        </tbody>
      </table>
    </div>
    <AppPagination
      :firstpage="1"
      :currentpage="currentPage"
      :lastpage="lastPage"
      @gotopage="gotoPage"
    />
  </span>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent } from 'vue'
import { useStore } from '../store'
import AppPagination from './Generic/AppPagination.vue'
import AppLoading from './Generic/AppLoading.vue'
import type { TermType } from '../types/TermType'
import ui from '../assets/ui'
import fields from '../assets/fields'

const TermRow = defineAsyncComponent(() => import('./TermList/TermRow.vue'))

withDefaults(
  defineProps<{
    loading?: boolean
  }>(),
  { loading: false }
)

const emit = defineEmits<{
  (e: 'edit', term: TermType): void
  (e: 'remove', term: TermType): void
  (e: 'gotopage', pageNumber: number, currentPage: number): void
}>()

const store = useStore()
const currentPage = computed(() => store.state.terms.currentPage)
const terms = computed(() => store.state.terms.terms)

const termCount = computed((): number => {
  return terms.value.size
})

const lastPage = computed((): number => {
  if (termCount.value < 20) {
    return currentPage.value
  } else {
    return Math.ceil(store.state.terms.totalRows / 20)
  }
})

const edit = (term: TermType) => emit('edit', term)
const remove = (term: TermType) => emit('remove', term)
const gotoPage = (pageNumber: number) =>
  emit('gotopage', pageNumber, currentPage.value)
</script>

<style scoped>
.content-container {
  position: relative;
}

.loading-indicator {
  position: absolute;
  top: 0;
}

.no-terms-indicator {
  margin-bottom: 1.5em;
}

.table th.date {
  width: 9.6em;
}

.table th.row-buttons {
  width: 3.9em;
}
</style>
