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
      <a
        role="button"
        class="navbar-burger"
        aria-label="menu"
        aria-expanded="false"
        :class="{ 'is-active': isActive }"
        @click="toggleMenu"
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </a>
    </div>
    <div class="navbar-menu" :class="{ 'is-active': isActive }">
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
import { ref } from 'vue'

defineProps<{
  fixed: 'top' | 'bottom'
}>()

const isActive = ref(false)

const toggleMenu = () => {
  isActive.value = !isActive.value
}
</script>
