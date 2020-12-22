<template>
  <div class="field is-expanded">
    <div class="control">
      <AppSelect :options="options" :fullwidth="true" @change="sort" />
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
export default class TermSortSelect extends Vue {
  ui = ui
  fields = fields

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

  sort(value: string): void {
    // Sort
    this.$emit('sort', value)
  }
}
</script>
