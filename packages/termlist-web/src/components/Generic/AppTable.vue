<template>
  <table
    class="table"
    :class="{ 'is-fullwidth': fullwidth, 'is-hoverable': hoverable }"
  >
    <thead>
      <tr>
        <slot name="table-header" />
      </tr>
    </thead>
    <tbody>
      <slot name="table-body" />
    </tbody>
  </table>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    fullwidth?: boolean
    hoverable?: boolean
  }>(),
  {
    fullwidth: false,
    hoverable: false,
  }
)
</script>

<style lang="scss">
@import 'bulma/sass/utilities/controls';
@import 'bulma/sass/utilities/extends';
@import 'bulma/sass/elements/table';
@import 'bulma/sass/helpers/visibility';
</style>
