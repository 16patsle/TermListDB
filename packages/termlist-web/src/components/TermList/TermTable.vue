<template>
  <AppTable fullwidth hoverable>
    <template #table-header>
      <TermHeader />
    </template>
    <template #table-body>
      <TermRow
        v-for="term of terms"
        :key="term._id"
        :term="term"
        @edit="$emit('edit', $event)"
        @remove="$emit('remove', $event)"
      />
    </template>
  </AppTable>
</template>

<script lang="ts" setup>
import AppTable from '../Generic/AppTable.vue'
import TermHeader from './TermHeader.vue'
import TermRow from './TermRow.vue'

import type { TermType } from '../../types/TermType'

defineProps<{ terms: TermType[] }>()

defineEmits<{
  (e: 'edit', term: TermType): void
  (e: 'remove', term: TermType): void
}>()
</script>
