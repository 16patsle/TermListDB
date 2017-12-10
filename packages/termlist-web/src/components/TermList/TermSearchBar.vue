<template>
<div class="field has-addons">
  <div class="control is-expanded has-icons-left">
    <input class="input searchfield" type="text" :placeholder="ui.search" @keyup="search">
    <span class="icon is-small is-left">
      <i class="fa fa-search"></i>
    </span>
  </div>
  <div class="control">
    <div class="select">
      <select ref="columnSelect" @change="search">
            <option value="all">Alle kolonner</option>
            <option v-for="field in fields" v-if="!field.immutable&&field.type!=='filler'" :value="field.name">{{ui[field.name]}}</option>
          </select>
    </div>
  </div>
</div>
</template>
<script>
export default {
  props: {
    ui: {
      type: Object,
      required: true
    },
    fields: {
      type: Array,
      required: true
    }
  },
  methods: {
    search(e) {
      // Search
      this.$emit('search', {
        search: e.target.value,
        selected: this.$refs.columnSelect.value,
        fields: this.fields
      });
    }
  }
}
</script>
