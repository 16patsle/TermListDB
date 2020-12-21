<template>
  <div :class="{ 'is-fullwidth': fullwidth }" class="select">
    <select @change="change">
      <option
        v-if="defaultoption && defaultoption.name && defaultoption.ui"
        :value="defaultoption.name"
      >
        {{ defaultoption.ui }}
      </option>
      <option v-for="option in options" :key="option.name" :value="option.name">
        {{ option.ui }}
      </option>
    </select>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import type { SelectOptionType } from '../../types/SelectOptionType'

const AppSelectProps = Vue.extend({
  props: {
    defaultoption: { type: Object, default: null },
    options: {
      type: Array,
      required: true,
    },
    fullwidth: { type: Boolean, default: false },
  },
})

@Component
export default class AppSelect extends AppSelectProps {
  defaultoption!: SelectOptionType | null
  options!: SelectOptionType[]
  value!: string

  created(): void {
    if (this.defaultoption) {
      this.value = this.defaultoption.name
    } else {
      this.options[0].name
    }
  }

  change(e: Event): void {
    this.value = (e.target as HTMLInputElement).value
    this.$emit('change', this.value)
  }
}
</script>
