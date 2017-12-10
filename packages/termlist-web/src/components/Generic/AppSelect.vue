<template>
<div class="select" :class="{'is-fullwidth':fullwidth}">
  <select @change="change">
        <option v-if="defaultoption && defaultoption.name && defaultoption.ui" :value="defaultoption.name">{{defaultoption.ui}}</option>
        <option v-for="option in options" :value="option.name">{{option.ui}}</option>
      </select>
</div>
</template>
<script>
export default {
  props: ['defaultoption', 'options', 'fullwidth'],
  methods: {
    change(e) {
      this.$emit('change', e.target.value);
    }
  }
}
</script>
