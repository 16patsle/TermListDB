<template>
  <div class="field has-addons">
    <div class="control is-expanded has-icons-left">
      <input
        ref="searchBar"
        :placeholder="ui.search"
        class="input searchfield"
        type="text"
        @keyup="search"
      />
      <span class="icon is-small is-left">
        <i class="fa fa-search" />
      </span>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

import ui from '../../assets/ui'

@Component
export default class TermSearchBar extends Vue {
  $refs!: {
    searchBar: HTMLInputElement
  }

  ui = ui

  search(): void {
    // Search
    this.$emit('search', {
      search: this.$refs.searchBar.value,
    })
  }
}
</script>
