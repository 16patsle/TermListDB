<template>
  <a v-if="href || link" :href="href || '#'" class="navbar-item" @click="click">
    <slot />
  </a>
  <div v-else class="navbar-item">
    <slot />
  </div>
</template>
<script>
export default {
  props: {
    href: {
      type: String,
      default: null,
    },
    link: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    click(e) {
      this.$emit('click', e)
    },
  },
}
</script>
