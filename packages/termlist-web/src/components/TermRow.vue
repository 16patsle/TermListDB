<template>
<tr>
  <td class="term">{{term.term}}</td>
  <td class="desc">{{term.desc}}</td>
  <td class="date">{{term.date}}</td>
  <td class="buttons">
    <a href="#" class="edit" @click.prevent="edit">
          <span class="icon is-small">
            <i class="fa fa-pencil"></i>
          </span>
</a>
    <a href="#" class="remove" @click.prevent="remove">
  <span class="icon is-small">
    <i class="fa fa-trash"></i>
  </span>
</a>
  </td>
</tr>
</template>
<script>
export default {
  props: ['term'],
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
