<template>
  <a href="#" @click.prevent="click">
    <span class="icon is-small">
      <i :class="'fa fa-' + icon + ''" />
    </span>
  </a>
</template>
<script>
export default {
  props: {
    icon: {
      type: String,
      required: true
    }
  },
  methods: {
    click(e) {
      this.$emit('click', e)
    }
  }
}
</script>
