<template>
  <div ref="modal" class="modal">
    <div class="modal-background" @click="close" />
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
          <AppButton v-if="okText !== null" primary @click="callback">
            {{ okText }}
          </AppButton>
          <AppButton v-if="cancelText !== null" @click="close">
            {{ cancelText }}
          </AppButton>
        </slot>
      </footer>
    </div>
    <button class="modal-close is-large" aria-label="close" @click="close" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import AppButton from './AppButton.vue'

const props = withDefaults(
  defineProps<{
    okText?: string
    cancelText?: string
    title: string
    callback?: (event: MouseEvent) => void
    closeCallback?: (event: MouseEvent) => void
  }>(),
  {
    okText: 'OK',
    cancelText: 'Cancel',
    title: '',
    callback: undefined,
    closeCallback: undefined,
  }
)

const show = ref(false)
const modal = ref<InstanceType<typeof Element>>()

const close = (e: MouseEvent): void => {
  if (props.closeCallback) {
    props.closeCallback(e)
  } else {
    toggleModal(false)
  }
}

const toggleModal = (bool: boolean): void => {
  show.value = bool
  if (bool) {
    modal.value?.classList.add('is-active')
  } else {
    modal.value?.classList.remove('is-active')
  }
}

defineExpose({
  toggleModal,
})
</script>
<style></style>
