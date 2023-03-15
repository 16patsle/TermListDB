<template>
  <button
    :class="{
      'is-primary': primary,
      'is-danger': danger,
      'is-loading': loading,
    }"
    type="button"
    class="button"
    @click="click"
  >
    <slot>OK</slot>
  </button>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    primary?: boolean
    danger?: boolean
    loading?: boolean
  }>(),
  { primary: false, danger: false, loading: false }
)

const emit =
  defineEmits<{
    (e: 'click', event: MouseEvent): void
  }>()

const click = (e: MouseEvent) => {
  emit('click', e)
}
</script>

<style lang="scss">
@import '@/assets/includes';
@import 'bulma/sass/elements/button';
</style>
