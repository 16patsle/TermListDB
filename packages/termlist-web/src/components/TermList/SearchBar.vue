<template>
<div class="field has-addons">
  <div class="control is-expanded has-icons-left">
    <input class="input searchfield" type="text" placeholder="Søk" @keyup="search">
    <span class="icon is-small is-left">
      <i class="fa fa-search"></i>
    </span>
  </div>
  <div class="control">
    <div class="select">
      <select ref="columnSelect" @change="search">
            <option value="all">Alle kolonner</option>
            <option value="term">Ord</option>
            <option value="desc">Forklaring</option>
          </select>
    </div>
  </div>
</div>
</template>
<script>
export default {
  methods: {
    search(e) {
      // Search
      this.$emit('search', e.target.value, this.$refs.columnSelect.value);
    }
  }
}
</script>
