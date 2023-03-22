<template>
  <tr class="term-row">
    <TermField
      v-for="field in fields"
      :key="field.name"
      :class="field.name || field.type"
      :is-html="field.name === 'desc'"
      :value="getFieldValue(field)"
    />
    <td class="row-buttons">
      <TermRowButton :icon="['fas', 'pencil-alt']" @click="edit" />
      <TermRowButton :icon="['fas', 'trash-alt']" @click="remove" />
    </td>
  </tr>
</template>
<script lang="ts" setup>
import TermField from './TermField.vue'
import TermRowButton from './TermRowButton.vue'

import type { FieldType } from '@/types/FieldType'
import type { TermType } from '@/types/TermType'

import ui from '@/assets/ui'
import fields from '@/assets/fields'

const props = defineProps<{ term: TermType }>()

const emit = defineEmits<{
  (e: 'edit', term: TermType): void
  (e: 'remove', term: TermType): void
}>()

const edit = () => emit('edit', props.term)
const remove = () => emit('remove', props.term)

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

const getFieldValue = async (field: FieldType): Promise<string | undefined> => {
  const { term } = props

  if (field.type === 'filler' || !term[field.name]) {
    return ''
  } else if (field.name === 'desc') {
    const md = (await import('@/utils/markdown')).default
    return md(String(term[field.name]))
  } else if (field.name === 'type') {
    return term.type ? ui.wordClasses[term.type] : ''
  } else if (field.name === 'date') {
    let date = new Date(term.date)
    return dateFormatter.format(date)
  } else {
    return term[field.name]
  }
}
</script>

<style lang="scss">
@import '@/assets/includes';
@import 'bulma/sass/elements/content';
</style>

<style>
tr.term-row td {
  white-space: pre-line;
}

tr.term-row td.desc p {
  display: inline-block;
}
</style>
