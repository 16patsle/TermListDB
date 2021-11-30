<template>
  <a v-if="href || link" :href="href || '#'" class="navbar-item" @click="click">
    <slot />
  </a>
  <div v-else class="navbar-item">
    <slot />
  </div>
</template>
<script lang="ts" setup>
withDefaults(
  defineProps<{
    href?: string
    link?: boolean
  }>(),
  {
    href: undefined,
    link: false,
  }
)

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const click = (e: MouseEvent) => {
  emit('click', e)
}
</script>
