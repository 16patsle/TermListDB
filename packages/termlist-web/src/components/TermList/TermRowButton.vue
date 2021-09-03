<template>
  <a href="#" @click.prevent="click">
    <span class="icon is-small">
      <i :class="'fa fa-' + icon + ''" />
    </span>
  </a>
</template>
<script lang="ts" setup>
defineProps<{ icon: string }>()

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const click = (e: MouseEvent) => emit('click', e)
</script>
