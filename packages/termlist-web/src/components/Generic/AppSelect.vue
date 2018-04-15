<template>
  <div
    :class="{'is-fullwidth':fullwidth}"
    class="select">
    <select @change="change">
      <option
        v-if="defaultoption && defaultoption.name && defaultoption.ui"
        :value="defaultoption.name">{{ defaultoption.ui }}</option>
      <option
        v-for="option in options"
        :key="option.name"
        :value="option.name">{{ option.ui }}</option>
    </select>
  </div>
</template>
<script>
export default {
  props: {
    defaultoption: { type: Object, default: null },
    options: {
      type: Array,
      required: true
    },
    fullwidth: { type: Boolean, default: false }
  },
  methods: {
    change(e) {
      this.$emit('change', e.target.value)
    }
  }
}
</script>
