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
import { onMounted } from 'vue'

const props = defineProps<{
  fixed: 'top' | 'bottom'
  bodyPadding?: boolean
}>()

onMounted(() => {
  if (props.bodyPadding && props.fixed) {
    //this.$root.$el.classList.add(`has-navbar-fixed-${this.fixed}`)
  }
})
</script>
