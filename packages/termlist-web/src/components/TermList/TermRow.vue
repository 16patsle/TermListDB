<template>
  <tr class="term-row">
    <td
      v-for="field in fields"
      :key="field.name"
      :class="field.name || field.type"
      v-html="getFieldValue(field)"
    />
    <td class="row-buttons">
      <TermRowButton icon="pencil" @click="edit" />
      <TermRowButton icon="trash" @click="remove" />
    </td>
  </tr>
</template>
<script lang="ts" setup>
import TermRowButton from './TermRowButton.vue'

import type { FieldType } from '../../types/FieldType'
import type { TermType } from '../../types/TermType'

import ui from '../../assets/ui'
import fields from '../../assets/fields'
import md from '../../utils/markdown'

const { term } = defineProps<{ term: TermType }>()

const emit = defineEmits<{
  (e: 'edit', term: TermType): void
  (e: 'remove', term: TermType): void
}>()

const edit = () => emit('edit', term)
const remove = () => emit('remove', term)

const getFieldValue = (field: FieldType): string | undefined => {
  if (field.type === 'filler' || !term[field.name]) {
    return ''
  } else if (field.name === 'desc') {
    return md.render(String(term[field.name]))
  } else if (field.name === 'type') {
    return term.type ? ui.wordClasses[term.type] : ''
  } else if (field.name === 'date') {
    let date = new Date(term.date)
    return new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  } else {
    return term[field.name]
  }
}
</script>

<style>
tr.term-row td {
  white-space: pre-line;
}

tr.term-row td.desc p {
  display: inline-block;
}
</style>
