<template>
<tr class="term-row">
  <td v-for="field in fields" v-html="getFieldValue(field)"></td>
  <td class="buttons">
    <RowButton icon="pencil" @click="edit"></RowButton>
    <RowButton icon="trash" @click="remove"></RowButton>
  </td>
</tr>
</template>
<script>
import RowButton from './RowButton.vue'

export default {
  props: ['md', 'ui', 'term', 'fields'],
  components: {
    RowButton
  },
  methods: {
    edit(e) {
      this.$emit('edit', this.term);
    },
    remove(e) {
      this.$emit('remove', this.term);
    },
    getFieldValue(field) {
      if (field.name === 'desc') {
        return this.md.render(String(this.term[field.name]))
      } else if (field.type === 'select') {
        return this.ui.wordClasses[this.term['type']]
      } else {
        return this.term[field.name]
      }
    }
  }
}
</script>

<style>
tr.term-row td {
  white-space: pre-line;
}
</style>
