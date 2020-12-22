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
    <div class="control">
      <AppSelect
        ref="columnSelect"
        :defaultoption="{ name: 'all', ui: ui.allColumns }"
        :options="reduce()"
        @change="search"
      />
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import AppSelect from '../Generic/AppSelect.vue'

import type { SelectOptionType } from '../../types/SelectOptionType'

import ui from '../../assets/ui'
import fields from '../../assets/fields'

@Component({ components: { AppSelect } })
export default class TermSearchBar extends Vue {
  $refs!: {
    searchBar: HTMLInputElement
    columnSelect: AppSelect
  }

  ui = ui
  fields = fields

  search(): void {
    // Search
    this.$emit('search', {
      search: this.$refs.searchBar.value,
      selected: this.$refs.columnSelect.value,
      fields: this.fields,
    })
  }

  reduce(): SelectOptionType[] {
    return this.fields.reduce((allFields: SelectOptionType[], field) => {
      if (!field.immutable && field.type !== 'filler') {
        allFields.push({
          name: field.name,
          ui: this.ui[field.name],
        })
      }
      return allFields
    }, [])
  }
}
</script>
