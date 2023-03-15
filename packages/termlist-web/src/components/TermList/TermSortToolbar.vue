<template>
  <div class="field is-horizontal">
    <div class="field-body">
      <TermSearchBar v-model="termsStore.$state.search" />
      <TermSortSelect
        class="term-sort-select"
        @sort="termsStore.sort($event)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { watch } from 'vue'
import debounce from 'just-debounce-it'
import { useTermsStore } from '../../stores/terms'
import TermSearchBar from './TermSearchBar.vue'
import TermSortSelect from './TermSortSelect.vue'

const termsStore = useTermsStore()

watch(
  () => termsStore.$state.search,
  debounce(() => termsStore.search(), 400)
)
</script>

<style lang="scss">
@import '@/assets/includes';
@import 'bulma/sass/form/shared';
@import 'bulma/sass/form/tools';
</style>

<style>
.field > .field-body > .field.term-sort-select {
  flex-grow: 0;
}
</style>
