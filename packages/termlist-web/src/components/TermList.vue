<template>
  <span>
    <TermSearchBar @search="search" />
    <TermSortSelect @sort="sort" />
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
            v-for="term in terms"
            :key="term._id"
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
import { computed, ref } from 'vue'
import { useStore } from '../store'
import TermSearchBar from './TermList/TermSearchBar.vue'
import TermSortSelect from './TermList/TermSortSelect.vue'
import TermRow from './TermList/TermRow.vue'
import AppPagination from './Generic/AppPagination.vue'
import AppLoading from './Generic/AppLoading.vue'
import type { TermType } from '../types/TermType'
import type { TermQueryType } from '../types/TermQueryType'
import ui from '../assets/ui'
import fields from '../assets/fields'

const props = withDefaults(
  defineProps<{
    loading?: boolean
  }>(),
  { loading: false }
)

const emit = defineEmits<{
  (e: 'search', search: string): void
  (e: 'edit', term: TermType): void
  (e: 'remove', term: TermType): void
  (e: 'gotopage', pageNumber: number, currentPage: number): void
  (e: 'sort', field: string): void
}>()

const store = useStore()
const currentPage = ref(1)

const terms = computed(
  (): {
    [key: string]: TermType
  } => {
    return store.state.terms.terms
  }
)

const termCount = computed((): number => {
  return Object.keys(terms.value).length
})

const lastPage = computed((): number => {
  if (termCount.value < 20) {
    return currentPage.value
  } else {
    return Math.ceil(store.state.terms.totalRows / 20)
  }
})

const search = (search: string): void => {
  emit('search', search)
}

const edit = (term: TermType): void => {
  emit('edit', term)
}

const remove = (term: TermType): void => {
  emit('remove', term)
}

const gotoPage = (pageNumber: number): void => {
  emit('gotopage', pageNumber, currentPage.value)
  currentPage.value = pageNumber
}

const sort = (field: string): void => {
  emit('sort', field)
  currentPage.value = 1
}
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
