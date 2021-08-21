<template>
  <div :class="{ 'is-fullwidth': fullwidth }" class="select">
    <select @change="change">
      <option v-if="defaultOption" value="" disabled :selected="value === ''">
        {{ defaultOptionName }}
      </option>
      <option
        v-for="option in options"
        :key="option.name"
        :value="option.name"
        :selected="value === option.name"
      >
        {{ option.ui }}
      </option>
    </select>
  </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import type { SelectOptionType } from '../../types/SelectOptionType'

@Options({
  props: {
    defaultOption: { type: Boolean, default: true },
    defaultOptionName: { type: String, default: '' },
    options: {
      type: Array,
      required: true,
    },
    fullwidth: { type: Boolean, default: false },
    value: { type: String, default: '' },
  },
})
export default class AppSelect extends Vue {
  options!: SelectOptionType[]
  value!: string

  setValue(value: string): void {
    this.$emit('input', value)
  }

  change(e: Event): void {
    this.setValue((e.target as HTMLInputElement).value)
    this.$emit('change', this.value, e.target)
  }
}
</script>
