<template>
<button class="button" :class="{'is-primary':primary}" @click="click"><slot>OK</slot></button>
</template>
<script>
export default {
  props: ['primary'],
  methods: {
    click(e) {
      this.$emit('click', e);
    }
  }
}
</script>
