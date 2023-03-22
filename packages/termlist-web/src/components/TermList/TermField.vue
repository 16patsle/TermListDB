<template>
  <td :class="props.class">
    <div v-if="isHtml" class="content" v-html="value" />
    <div v-else>{{ value }}</div>
  </td>
</template>
<script lang="ts" setup>
import { useAsyncState } from '@vueuse/core'

const props = defineProps<{
  class: string
  isHtml?: boolean
  value: Promise<string | undefined>
}>()

const { state: value } = useAsyncState(props.value, '')
</script>
