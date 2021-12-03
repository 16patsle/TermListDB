<template>
  <div class="field is-horizontal">
    <div class="field-body">
      <TermSearchBar @search="emit('search', $event)" />
      <TermSortSelect class="term-sort-select" @sort="emit('sort', $event)" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import TermSearchBar from './TermSearchBar.vue'
import TermSortSelect from './TermSortSelect.vue'

import type { FieldNameType } from '../../types/FieldNameType'

const emit = defineEmits<{
  (e: 'search', search: string): void
  (e: 'sort', value?: FieldNameType): void
}>()
</script>

<style>
.field-body > .field.term-sort-select {
  flex-grow: 0;
}
</style>
