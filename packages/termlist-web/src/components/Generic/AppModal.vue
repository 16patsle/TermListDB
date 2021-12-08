<template>
  <div class="modal" :class="{ 'is-active': isActive }">
    <div class="modal-background" @click="closeAllowed && close($event)" />
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">
          <slot name="title">
            {{ title }}
          </slot>
        </p>
      </header>
      <section class="modal-card-body">
        <slot name="modal-body">
          <!--Modal body-->
        </slot>
      </section>
      <footer class="modal-card-foot">
        <slot name="modal-footer">
          <AppButton
            v-if="okText !== null"
            primary
            @click="emit('okClick', $event)"
          >
            {{ okText }}
          </AppButton>
          <AppButton v-if="cancelText !== null" @click="close">
            {{ cancelText }}
          </AppButton>
        </slot>
      </footer>
    </div>
    <button
      v-if="closeAllowed"
      class="modal-close is-large"
      aria-label="close"
      @click="close"
    />
  </div>
</template>

<script lang="ts" setup>
import AppButton from './AppButton.vue'

withDefaults(
  defineProps<{
    isActive: boolean
    okText?: string
    cancelText?: string
    title: string
    closeAllowed?: boolean
  }>(),
  {
    okText: 'OK',
    cancelText: 'Cancel',
    title: '',
    closeAllowed: true,
  }
)

const emit = defineEmits<{
  (e: 'okClick', event: MouseEvent): void
  (e: 'close', event: MouseEvent): void
}>()

const close = (e: MouseEvent): void => emit('close', e)
</script>

<style lang="scss">
@import 'bulma/sass/utilities/controls';
@import 'bulma/sass/utilities/extends';
@import 'bulma/sass/components/modal';
</style>

<style>
.modal {
  text-align: center;
}
</style>
