<template>
<tr>
  <td class="term">{{term.term}}</td>
  <td class="desc">{{term.desc}}</td>
  <td class="date">{{term.date}}</td>
  <td class="buttons">
    <RowButton icon="pencil" @click="edit"></RowButton>
    <RowButton icon="trash" @click="remove"></RowButton>
  </td>
</tr>
</template>
<script>
import RowButton from './RowButton.vue'

export default {
  props: ['term'],
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
