<template>
  <div class="field is-expanded">
    <div class="control">
      <AppSelect
        v-model="sortValue"
        :default-option="false"
        :options="options"
        fullwidth
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue'
import AppSelect from '../Generic/AppSelect.vue'

import type { SelectOptionType } from '../../types/SelectOptionType'
import type { FieldNameType } from '../../types/FieldNameType'

import ui from '../../assets/ui'
import fields from '../../assets/fields'

const emit = defineEmits<{
  (e: 'sort', value?: FieldNameType): void
}>()

const _sortValue = ref(fields[0].name)
const sortValue = computed({
  get: () => _sortValue.value,
  set: value => {
    _sortValue.value = value
    // Sort
    emit('sort', value ? value : undefined)
  },
})

const options = fields.reduce((optionsArray: SelectOptionType[], field) => {
  if (field.type !== 'filler') {
    optionsArray.push({
      name: field.name,
      ui: ui.sortBy + ui[field.name].toLowerCase(),
    })
  }
  return optionsArray
}, [])
</script>

<style lang="scss">
@import 'bulma/sass/utilities/controls';
@import 'bulma/sass/utilities/extends';
@import 'bulma/sass/form/shared';
@import 'bulma/sass/form/tools';
</style>
