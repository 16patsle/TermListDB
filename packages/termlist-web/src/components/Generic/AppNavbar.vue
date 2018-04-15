<template>
  <nav
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
    /*primary: Boolean,
    danger: Boolean*/
  },
  methods: {}
}
</script>
