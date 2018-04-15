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
  data() {
    return {
      value: this.defaultoption ? this.defaultoption.name : this.options[0].name
    }
  },
  methods: {
    change(e) {
      this.value = e.target.value
      this.$emit('change', e.target.value)
    }
  }
}
</script>
