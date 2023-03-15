<template>
  <div class="text-container">
    <div>
      <div>
        <span class="icon is-medium">
          <fa-icon :icon="['fas', 'spinner']" pulse size="2x" />
        </span>
      </div>
      {{ text }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import ui from '../../assets/ui'

withDefaults(defineProps<{ text?: string }>(), { text: ui.loading })
</script>

<style lang="scss">
@import '@/assets/includes';
@import 'bulma/sass/elements/icon';
</style>

<style scoped>
.text-container {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
