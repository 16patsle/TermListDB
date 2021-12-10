<template>
  <div class="field">
    <label class="label">{{ label }}</label>
    <div class="control">
      <slot name="control" />
    </div>
  </div>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    label?: string
  }>(),
  {
    label: '',
  }
)
</script>

<style lang="scss">
@import 'bulma/sass/utilities/controls';
@import 'bulma/sass/utilities/extends';
@import 'bulma/sass/form/shared';
@import 'bulma/sass/form/tools';
</style>
