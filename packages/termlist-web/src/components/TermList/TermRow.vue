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
<script lang="ts">
import {Options, Vue} from 'vue-class-component'
import TermRowButton from './TermRowButton.vue'

import type { FieldType } from '../../types/FieldType'
import type { TermType } from '../../types/TermType'

import ui from '../../assets/ui'
import fields from '../../assets/fields'
import md from '../../utils/markdown'

@Options({ components: { TermRowButton },props: {
    term: {
      type: Object,
      required: true,
    },
  }, })
export default class TermRow extends Vue {
  term!: TermType

  ui = ui
  fields = fields

  edit(): void {
    this.$emit('edit', this.term)
  }

  remove(): void {
    this.$emit('remove', this.term)
  }

  getFieldValue(field: FieldType): string | undefined {
    if (!this.term[field.name]) {
      return ''
    } else if (field.name === 'desc') {
      return md.render(String(this.term[field.name]))
    } else if (field.name === 'type') {
      return this.term.type ? this.ui.wordClasses[this.term.type] : ''
    } else if (field.name === 'date') {
      let date = new Date(this.term.date)
      return new Intl.DateTimeFormat(undefined, {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date)
    } else {
      return this.term[field.name]
    }
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
