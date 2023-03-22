<template>
  <td :class="props.class">
    <div v-if="html" class="content" v-html="html" />
    <div v-else><slot /></div>
  </td>
</template>
<script lang="ts" setup>
const props = defineProps<{ class: string; html?: string }>()
</script>
