<template>
  <div class="field is-horizontal">
    <div class="field-body">
      <TermSearchBar @search="debouncedSearch" />
      <TermSortSelect
        class="term-sort-select"
        @sort="termsStore.sort($event)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import debounce from 'just-debounce-it'
import { useTermsStore } from '../../stores/terms'
import TermSearchBar from './TermSearchBar.vue'
import TermSortSelect from './TermSortSelect.vue'

const termsStore = useTermsStore()

const debouncedSearch = debounce(
  (search: string) => termsStore.search(search),
  400
)
</script>

<style>
.field-body > .field.term-sort-select {
  flex-grow: 0;
}
</style>
