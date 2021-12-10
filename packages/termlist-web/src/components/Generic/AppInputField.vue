<template>
  <div class="field" :class="{ 'is-grouped': grouped }">
    <label v-if="label" class="label">{{ label }}</label>
    <div
      class="control"
      :class="{
        'has-icons-left': hasIcons === 'left' || hasIcons === 'both',
        'has-icons-right': hasIcons === 'right' || hasIcons === 'both',
      }"
    >
      <slot />
    </div>
    <slot name="controls" />
    <div v-if="$slots.help" class="help" :class="{ 'is-danger': helpDanger }">
      <slot name="help" />
    </div>
  </div>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    label?: string
    hasIcons?: 'left' | 'right' | 'both' | 'none'
    helpDanger?: boolean
    grouped?: boolean
  }>(),
  {
    label: '',
    hasIcons: 'none',
    helpDanger: false,
    grouped: false,
  }
)
</script>

<style lang="scss">
@import 'bulma/sass/utilities/controls';
@import 'bulma/sass/utilities/extends';
@import 'bulma/sass/form/shared';
@import 'bulma/sass/form/tools';
</style>
