<template>
  <div class="field is-horizontal">
    <div class="field-body">
      <TermSearchBar v-model="searchValue" />
      <TermSortSelect
        class="term-sort-select"
        @sort="termsStore.sort($event)"
      />
      <TermFilterSelect @change="termsStore.filter($event)" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import debounce from 'just-debounce-it'
import { useTermsStore } from '@/stores/terms'
import TermSearchBar from './TermSearchBar.vue'
import TermSortSelect from './TermSortSelect.vue'
import TermFilterSelect from './TermFilterSelect.vue'

const termsStore = useTermsStore()

const searchValue = ref(termsStore.$state.search ?? '')

watch(
  () => searchValue.value,
  debounce(() => termsStore.search(searchValue.value), 400)
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
