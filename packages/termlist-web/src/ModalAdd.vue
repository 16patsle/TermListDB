<template>
<div class="modal" ref="modal">
  <div class="modal-background" @click="toggleModal"></div>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">{{ui.addterm}}</p>
    </header>
    <section class="modal-card-body">
      <div class="field">
        <label class="label">{{ui.term}}</label>
        <div class="control">
          <input class="input" type="text" ref="termfield">
        </div>
      </div>
      <div class="field">
        <label class="label">{{ui.description}}</label>
        <div class="control">
          <textarea class="textarea" ref="descfield"></textarea>
        </div>
      </div>
      <div class="field">
        <div class="control">
          <button class="button is-primary addbutton" @click="addTerm">{{ui.add}}</button>
        </div>
      </div>
    </section>
  </div>
  <button class="modal-close is-large" aria-label="close" @click="toggleModal"></button>
</div>
</template>
<script>
export default {
  data() {
    return {
      ui: {
        addterm: 'Legg til ord',
        term: 'Ord',
        description: 'Forklaring',
        add: 'Legg til'
      }
    }
  },
  props: ['current'],
  methods: {
    toggleModal() {
      this.$refs.modal.classList.toggle("is-active");
    },
    addTerm() {
      this.$emit('save', this.current, {
        term: this.$refs.termfield.value,
        desc: this.$refs.descfield.value
      });
      this.$refs.termfield.value = '';
      this.$refs.descfield.value = '';
      this.toggleModal();
    }
  }
}
</script>
<style>

</style>
