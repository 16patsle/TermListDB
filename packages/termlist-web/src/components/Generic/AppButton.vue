<template>
<button class="button" :class="{'is-primary':primary,'is-danger':danger}" @click="click"><slot>OK</slot></button>
</template>
<script>
export default {
  props: {
    primary: Boolean,
    danger: Boolean
  },
  methods: {
    click(e) {
      this.$emit('click', e);
    }
  }
}
</script>
