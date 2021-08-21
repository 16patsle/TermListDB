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

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import AppButton from './AppButton.vue'

@Options({
  components: {
    AppButton,
  },
  props: {
    okText: {
      type: String,
      default: 'OK',
    },
    cancelText: {
      type: String,
      default: 'Cancel',
    },
    title: {
      type: String,
      default: '',
    },
    callback: {
      type: Function,
      default: null,
    },
    closeCallback: {
      type: Function,
      default: null,
    },
  },
})
export default class AppModal extends Vue {
  show = false

  $refs!: {
    modal: Element
  }

  close(): void {
    if (this.closeCallback) {
      this.closeCallback()
    } else {
      this.toggleModal(false)
    }
  }
  toggleModal(bool: boolean): void {
    this.show = bool
    if (bool) {
      this.$refs.modal.classList.add('is-active')
    } else {
      this.$refs.modal.classList.remove('is-active')
    }
    //this.$emit('toggle', bool);
  }
  isShown(): boolean {
    return this.show
  }
}
</script>
<style></style>
