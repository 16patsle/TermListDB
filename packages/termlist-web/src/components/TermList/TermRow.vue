<template>
<tr class="term-row">
  <td v-for="field in fields">{{term[field.name]}}</td>
  <td class="buttons">
    <RowButton icon="pencil" @click="edit"></RowButton>
    <RowButton icon="trash" @click="remove"></RowButton>
  </td>
</tr>
</template>
<script>
import RowButton from './RowButton.vue'

export default {
  props: ['term', 'fields'],
  components: {
    RowButton
  },
  methods: {
    edit(e) {
      this.$emit('edit', this.term);
    },
    remove(e) {
      this.$emit('remove', this.term);
    }
  }
}
</script>

<style>
tr.term-row td {
  white-space: pre-line;
}
</style>
