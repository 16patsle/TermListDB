<template>
<a href="#" @click.prevent="click">
  <span class="icon is-small">
    <i :class="'fa fa-'+icon+''"></i>
  </span>
</a>
</template>
<script>
export default {
  props: ['icon'],
  methods: {
    click(e) {
      this.$emit('click', e);
    }
  }
}
</script>
