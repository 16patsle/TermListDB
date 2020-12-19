<template>
  <tr class="term-row">
    <td
      v-for="field in fields"
      :key="field.name"
      v-html="getFieldValue(field)"
    />
    <td>
      <TermRowButton icon="pencil" @click="edit" />
      <TermRowButton icon="trash" @click="remove" />
    </td>
  </tr>
</template>
<script>
import TermRowButton from './TermRowButton.vue'

export default {
  components: {
    TermRowButton,
  },
  props: {
    md: {
      type: Object,
      required: true,
    },
    ui: {
      type: Object,
      required: true,
    },
    term: {
      type: Object,
      required: true,
    },
    fields: {
      type: Array,
      required: true,
    },
  },
  methods: {
    edit() {
      this.$emit('edit', this.term)
    },
    remove() {
      this.$emit('remove', this.term)
    },
    getFieldValue(field) {
      if (!this.term[field.name]) {
        return ''
      } else if (field.name === 'desc') {
        return this.md.render(String(this.term[field.name]))
      } else if (field.name === 'type') {
        return this.ui.wordClasses[this.term.type]
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
    },
  },
}
</script>

<style>
tr.term-row td {
  white-space: pre-line;
}
</style>
