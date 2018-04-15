<template>
  <a v-if="href || link" class="navbar-item" :href="href || '#'" @click="click">
    <slot></slot>
  </a>
  <div v-else class="navbar-item">
    <slot></slot>
  </div>
</template>
<script>
export default {
  props: {
    href: {
      type: String
    },
    link: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    click(e) {
      this.$emit('click', e)
    }
  }
}
</script>
