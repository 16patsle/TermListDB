<template>
  <div class="field has-addons">
    <div
      class="control is-expanded has-icons-left"
      :class="{
        'has-icons-right': modelValue.length,
      }"
    >
      <input
        :value="modelValue"
        class="input searchfield"
        :placeholder="ui.search"
        type="text"
        @input="onInput"
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
    </div>
  </div>
</template>
<script lang="ts" setup>
import ui from '../../assets/ui'

defineProps<{ modelValue: string }>()

const emit = defineEmits<{
  (e: 'update:modelValue', search: string): void
}>()

const onInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const onClear = () => {
  emit('update:modelValue', '')
}
</script>

<style lang="scss" scoped>
@import 'bulma/sass/utilities/controls';
@import 'bulma/sass/utilities/extends';
@import 'bulma/sass/elements/button';
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
