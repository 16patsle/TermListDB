<template>
  <div class="field is-expanded">
    <div class="control">
      <AppSelect
        :default-option="false"
        :options="options"
        fullwidth
        :value="sortValue"
        @input="sort"
      />
    </div>
  </div>
</template>
<script lang="ts">
//import Vue from 'vue'
import { Options, Vue } from 'vue-class-component'
import AppSelect from '../Generic/AppSelect.vue'

import type { SelectOptionType } from '../../types/SelectOptionType'
import type { FieldNameType } from '../../types/FieldNameType'

import ui from '../../assets/ui'
import fields from '../../assets/fields'

@Options({ components: { AppSelect } })
export default class TermSortSelect extends Vue {
  ui = ui
  fields = fields
  sortValue = fields[0].name

  get options(): SelectOptionType[] {
    let optionsArray: SelectOptionType[] = []

    this.fields.forEach(field => {
      if (field.type !== 'filler') {
        optionsArray.push({
          name: field.name,
          ui: this.ui.sortBy + this.ui[field.name].toLowerCase(),
        })
      }
    })

    return optionsArray
  }

  sort(value: FieldNameType): void {
    this.sortValue = value
    // Sort
    this.$emit('sort', value)
  }
}
</script>
