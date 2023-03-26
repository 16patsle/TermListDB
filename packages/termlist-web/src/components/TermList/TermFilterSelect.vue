<template>
  <AppInputField>
    <AppSelect
      v-model="value"
      :default-option="false"
      :options="options"
      fullwidth
    />
  </AppInputField>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue'
import AppInputField from '../Generic/AppInputField.vue'
import AppSelect from '../Generic/AppSelect.vue'

import { type FilterType, useTermsStore } from '@/stores/terms'

import ui from '@/assets/ui'

const emit = defineEmits<{
  (e: 'change', value?: FilterType): void
}>()

const termsStore = useTermsStore()

const _value = ref<NonNullable<FilterType> | 'all'>(
  termsStore.$state.filter ?? 'all'
)
const value = computed({
  get: () => _value.value,
  set: value => {
    _value.value = value
    emit('change', value === 'all' ? undefined : value)
  },
})

const options = [
  { name: 'all', ui: ui.showAll },
  {
    name: 'missingDescription',
    ui: ui.showOnly + ui.missingDescription,
  },
  {
    name: 'missingType',
    ui: ui.showOnly + ui.missingType,
  },
]
</script>

<style lang="scss">
@import '@/assets/includes';
@import 'bulma/sass/form/shared';
@import 'bulma/sass/form/tools';
</style>
