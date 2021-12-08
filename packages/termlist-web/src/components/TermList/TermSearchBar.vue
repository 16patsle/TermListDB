<template>
  <div class="field has-addons">
    <div class="control is-expanded has-icons-left">
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
</script>
