<template>
  <td :class="props.class">
    <component :is="val" v-if="typeof val === 'object'" />
    <template v-else>{{ val }}</template>
  </td>
</template>
<script lang="ts" setup>
import { useAsyncState } from '@vueuse/core'
import type { VNode } from 'vue'

const props = defineProps<{
  class: string
  value: Promise<string | VNode | undefined>
}>()

const { state: val } = useAsyncState(props.value, '')
</script>
