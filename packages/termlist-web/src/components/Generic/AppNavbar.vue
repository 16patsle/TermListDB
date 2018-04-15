<template>
  <nav
    :class="{'is-fixed-top':fixed==='top','is-fixed-bottom':fixed==='bottom'}"
    class="navbar"
    role="navigation"
    aria-label="main navigation">
    <div class="navbar-brand">
      <slot name="brand"/>
    </div>
    <div class="navbar-menu">
      <div class="navbar-start">
        <slot name="start"/>
      </div>
      <div class="navbar-end">
        <slot name="end"/>
      </div>
    </div>
  </nav>
</template>
<script>
export default {
  props: {
    fixed: {
      type: String,
      default: null,
      validator: function(value) {
        // The value must match one of these strings
        return ['top', 'bottom'].indexOf(value) !== -1
      }
    },
    bodyPadding: {
      type: Boolean,
      default: true
    }
  },
  created() {
    if (this.bodyPadding && this.fixed) {
      document.body.classList.add(`has-navbar-fixed-${this.fixed}`)
    }
  },
  methods: {}
}
</script>
