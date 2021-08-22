<template>
  <div :class="{ 'is-fullwidth': fullwidth }" class="select">
    <select @change="change">
      <option v-if="defaultOption" value disabled :selected="value === ''">{{ defaultOptionName }}</option>
      <option
        v-for="option in options"
        :key="option.name"
        :value="option.name"
        :selected="value === option.name"
      >{{ option.ui }}</option>
    </select>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import type { SelectOptionType } from '../../types/SelectOptionType'

withDefaults(defineProps<{
  defaultOption?: boolean
  defaultOptionName?: string
  options: SelectOptionType[],
  fullwidth?: boolean
  value?: string
}>(), {
  defaultOption: true,
  defaultOptionName: '',
  fullwidth: false,
  value: ''
})

const emit = defineEmits<{
  (e: 'input', value: string): void
  (e: 'change', value: string, event: HTMLInputElement): void
}>()

const value = ref('')

const setValue = (value: string): void => {
  emit('input', value)
}

const change = (e: Event): void => {
  const target = (e.target as HTMLInputElement)
  setValue(target.value)
  emit('change', value.value, target)
}
</script>
