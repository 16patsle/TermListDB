<template>
  <div class="field has-addons">
    <div class="control is-expanded has-icons-left">
      <input
        v-model="value"
        :placeholder="ui.search"
        class="input searchfield"
        type="text"
      />
      <span class="icon is-small is-left">
        <i class="fa fa-search" />
      </span>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue'
import ui from '../../assets/ui'

const emit = defineEmits<{
  (e: 'search', search: string): void
}>()

const _value = ref('')

const value = computed({
  get: () => _value.value,
  set: val => {
    _value.value = val
    // Search
    if (typeof val === 'string') {
      emit('search', val)
    }
  },
})
</script>
