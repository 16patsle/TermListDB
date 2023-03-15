<template>
  <div
    class="file has-name is-boxed"
    :class="{
      'is-centered': centered,
      'is-primary': primary,
      'is-success': success,
      'is-warning': warning,
      'is-danger': danger,
    }"
  >
    <label class="file-label">
      <input
        ref="importFile"
        class="file-input"
        type="file"
        :accept="accept"
        @change="handleFiles"
      />
      <span class="file-cta">
        <span class="file-icon">
          <fa-icon :icon="['fas', 'upload']" />
        </span>
        <span class="file-label">{{ label }}</span>
      </span>
      <span v-if="fileInfo" class="file-name">{{ fileInfo }}</span>
    </label>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

withDefaults(
  defineProps<{
    label?: string
    accept?: string
    centered?: boolean
    primary?: boolean
    success?: boolean
    warning?: boolean
    danger?: boolean
  }>(),
  {
    label: '',
    accept: undefined,
    centered: false,
    primary: false,
    success: false,
    warning: false,
    danger: false,
  }
)

const emit =
  defineEmits<{
    (e: 'change', value?: File): void
  }>()

const selectedFile = ref<File | undefined>()
const importFile = ref<InstanceType<typeof HTMLInputElement>>()

const fileInfo = computed(() => selectedFile.value?.name)

const handleFiles = (e: Event) => {
  selectedFile.value = (e.target as HTMLInputElement).files?.[0]
  emit('change', selectedFile.value)
}
</script>

<style lang="scss">
@import '@/assets/includes';
@import 'bulma/sass/form/shared';
@import 'bulma/sass/form/file';
@import 'bulma/sass/form/tools';
</style>
