<template>
  <div class="text-container">
    <div>
      <div>
        <span class="icon is-medium">
          <i class="fa fa-spinner fa-pulse fa-2x" />
        </span>
      </div>
      {{ text }}
    </div>
  </div>
</template>
<script>
export default {
  props: {
    text: { type: String, default: 'Loading...' },
  },
}
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
