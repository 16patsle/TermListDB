<template>
  <AppInputField :has-icons="modelValue.length ? 'both' : 'left'">
    <AppInput
      v-model="value"
      class="searchfield"
      :placeholder="ui.search"
      type="search"
    />
    <span class="icon is-small is-left">
      <fa-icon :icon="['fas', 'search']" />
    </span>
    <span v-if="modelValue.length" class="icon is-small is-right">
      <button
        class="button is-small clear-button"
        :title="ui.clearSearch"
        @click="onClear"
      >
        <fa-icon :icon="['fas', 'times']" />
        <span class="sr-only">{{ ui.clearSearch }}</span>
      </button>
    </span>
  </AppInputField>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import AppInputField from '../Generic/AppInputField.vue'
import AppInput from '../Generic/AppInput.vue'
import ui from '../../assets/ui'

const props = defineProps<{ modelValue: string }>()

const emit = defineEmits<{
  (e: 'update:modelValue', search: string): void
}>()

const value = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
})

const onClear = () => {
  emit('update:modelValue', '')
}
</script>

<style lang="scss">
@import 'bulma/sass/utilities/controls';
@import 'bulma/sass/utilities/extends';
@import 'bulma/sass/elements/button';
@import 'bulma/sass/elements/icon';
@import 'bulma/sass/form/shared';

.button.clear-button {
  pointer-events: all;
  background-color: none;
  border: none;
  color: $input-icon-color;

  &:hover {
    color: $button-text-color;
  }
}
</style>
