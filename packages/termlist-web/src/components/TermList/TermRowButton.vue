<template>
  <a href="#" @click.prevent="click">
    <span class="icon is-small">
      <fa-icon :icon="icon" />
    </span>
  </a>
</template>

<script lang="ts" setup>
defineProps<{ icon: [string, string] }>()

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const click = (e: MouseEvent) => emit('click', e)
</script>

<style scoped lang="scss">
@import 'bulma/sass/utilities/controls';
@import 'bulma/sass/utilities/extends';
@import 'bulma/sass/elements/icon';

.icon {
  margin: 0 1px;
}
</style>
