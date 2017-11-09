<template>
<div class="modal" ref="modal">
  <div class="modal-background" @click="close"></div>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">
        <slot name="title">
          {{title}}
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
        <button class="button is-primary" @click="callback">{{ okText }}</button>
        <button class="button" @click="close">{{ cancelText }}</button>
      </slot>
    </footer>
  </div>
  <button class="modal-close is-large" aria-label="close" @click="close"></button>
</div>
</template>

<script>
export default {
  props: {
    okText: {
      type: String,
      default: ''
    },
    cancelText: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    callback: {
      type: Function,
      default () {}
    }
  },
  data() {
    return {
      show: false
    }
  },
  methods: {
    close() {
      this.toggleModal(false);
    },
    toggleModal(bool) {
      this.show = bool;
      if (bool) {
        this.$refs.modal.classList.add("is-active");
      } else {
        this.$refs.modal.classList.remove("is-active");
      }
      //this.$emit('toggle', bool);
    },
    isShown() {
      return this.show;
    }
  }
}
</script>
<style>

</style>
