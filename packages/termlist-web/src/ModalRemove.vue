<template>
<div class="modal" ref="modal">
  <div class="modal-background" @click="toggleModal"></div>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">{{ui.removeterm}}</p>
    </header>
    <section class="modal-card-body">
      {{ui.wanttoremove}}
    </section>
    <footer class="modal-card-foot">
      <button class="button is-danger" @click="removeTerm">{{ui.removeterm}}!</button>
      <button class="button" @click="toggleModal">{{ui.cancel}}</button>
    </footer>
  </div>
  <button class="modal-close is-large" aria-label="close" @click="toggleModal"></button>
</div>
</template>
<script>
export default {
  data() {
    return {
      ui: {
        removeterm: 'Fjern ord',
        wanttoremove: 'Vil du fjerne dette ordet?',
        cancel: 'Avbryt'
      }
    }
  },
  props: ['current'],
  methods: {
    toggleModal() {
      this.$refs.modal.classList.toggle("is-active");
    },
    removeTerm() {
      this.$emit('remove', this.current);
      this.toggleModal();
    }
  }
}
</script>
<style>

</style>
