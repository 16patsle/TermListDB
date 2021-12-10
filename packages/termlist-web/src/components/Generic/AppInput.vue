<template>
  <input
    ref="input"
    v-model="value"
    class="input"
    :class="{
      'is-primary': primary,
      'is-success': success,
      'is-warning': warning,
      'is-danger': danger,
      'is-loading': loading,
    }"
    :type="type"
    :disabled="disabled"
    :placeholder="placeholder"
  />
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    type?:
      | 'text'
      | 'email'
      | 'password'
      | 'number'
      | 'tel'
      | 'url'
      | 'search'
      | 'date'
      | 'time'
      | 'datetime'
      | 'datetime-local'
      | 'month'
      | 'week'
    placeholder?: string
    primary?: boolean
    success?: boolean
    warning?: boolean
    danger?: boolean
    loading?: boolean
    disabled?: boolean
    autofocus?: boolean
    modelValue?: string
  }>(),
  {
    type: 'text',
    placeholder: '',
    primary: false,
    success: false,
    warning: false,
    danger: false,
    loading: false,
    disabled: false,
    autofocus: false,
    modelValue: '',
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const value = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
})

const input = ref<HTMLInputElement>()

onMounted(() => {
  if (props.autofocus && input.value) {
    input.value.focus()
  }
})
</script>

<style lang="scss">
@import 'bulma/sass/utilities/controls';
@import 'bulma/sass/utilities/extends';
@import 'bulma/sass/form/shared';
@import 'bulma/sass/form/tools';
@import 'bulma/sass/form/input-textarea';
</style>
