<template>
  <button
    :class="{ 'is-primary': primary, 'is-danger': danger }"
    class="button"
    @click="click"
  >
    <slot>OK</slot>
  </button>
</template>
<script>
export default {
  props: {
    primary: { type: Boolean, default: false },
    danger: { type: Boolean, default: false },
  },
  methods: {
    click(e) {
      this.$emit('click', e)
    },
  },
}
</script>
