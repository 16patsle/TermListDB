<template>
  <nav
    :class="{
      'is-fixed-top': fixed === 'top',
      'is-fixed-bottom': fixed === 'bottom',
    }"
    class="navbar"
    role="navigation"
    aria-label="main navigation"
  >
    <div class="navbar-brand">
      <slot name="brand" />
    </div>
    <div class="navbar-menu">
      <div class="navbar-start">
        <slot name="start" />
      </div>
      <div class="navbar-end">
        <slot name="end" />
      </div>
    </div>
  </nav>
</template>
<script lang="ts" setup>
defineProps<{
  fixed: 'top' | 'bottom'
}>()
</script>
