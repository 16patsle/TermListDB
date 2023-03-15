<template>
  <div :class="{ 'is-fullwidth': fullwidth }" class="select">
    <select v-model="value">
      <option v-if="defaultOption" value="" disabled>
        {{ defaultOptionName }}
      </option>
      <option v-for="option in options" :key="option.name" :value="option.name">
        {{ option.ui }}
      </option>
    </select>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import type { SelectOptionType } from '../../types/SelectOptionType'

const props = withDefaults(
  defineProps<{
    defaultOption?: boolean
    defaultOptionName?: string
    options: SelectOptionType[]
    fullwidth?: boolean
    modelValue?: string
  }>(),
  {
    defaultOption: true,
    defaultOptionName: '',
    fullwidth: false,
    modelValue: '',
  }
)

const emit =
  defineEmits<{
    (e: 'update:modelValue', value: string): void
  }>()

const value = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
})
</script>

<style lang="scss">
@import 'bulma/sass/utilities/controls';
@import 'bulma/sass/utilities/extends';
@import 'bulma/sass/form/shared';
@import 'bulma/sass/form/select';
</style>
