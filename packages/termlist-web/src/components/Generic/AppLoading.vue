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
withDefaults(defineProps<{ text?: string }>(), { text: 'Loading...' })
</script>
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
