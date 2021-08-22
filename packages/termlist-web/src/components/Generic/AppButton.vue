<template>
  <button
    :class="{ 'is-primary': primary, 'is-danger': danger }"
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
  }>(),
  { primary: false, danger: false }
)

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const click = (e: MouseEvent) => {
  emit('click', e)
}
</script>
