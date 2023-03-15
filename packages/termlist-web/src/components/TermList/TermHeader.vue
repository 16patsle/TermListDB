<template>
  <th
    v-for="field in fields"
    :key="field.name"
    :class="field.name || field.type"
  >
    {{ field.name ? ui[field.name] : '' }}
  </th>
  <th class="row-buttons" />
</template>
<script lang="ts" setup>
import ui from '@/assets/ui'
import fields from '@/assets/fields'
</script>

<style scoped>
.table th.date {
  width: 9.6em;
}

.table th.row-buttons {
  width: 3.9em;
}
</style>
