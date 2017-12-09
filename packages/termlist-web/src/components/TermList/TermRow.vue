<template>
<tr class="term-row">
  <td v-for="field in fields">{{getSelectValue(field)}}</td>
  <td class="buttons">
    <RowButton icon="pencil" @click="edit"></RowButton>
    <RowButton icon="trash" @click="remove"></RowButton>
  </td>
</tr>
</template>
<script>
import RowButton from './RowButton.vue'

export default {
  props: ['ui', 'term', 'fields'],
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
    getSelectValue(field) {
      if (field.type === 'select') {
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
