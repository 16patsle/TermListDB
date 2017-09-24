<template>
<section id="app" class="section">
  <ModalAdd ref="addModal" :current="currentTerm" @save="saveTerm"></ModalAdd>
  <ModalEdit ref="editModal" :current="currentTerm" @save="saveTerm"></ModalEdit>
  <ModalRemove ref="removeModal" :current="currentTerm" @remove="removeTerm"></ModalRemove>
  <div class="container">
    <h1 class="title">{{ui.termlist}}</h1>
    <div class="field">
      <div class="control">
        <button class="button is-primary" @click="addTerm">{{ui.add}}</button>
      </div>
    </div>
    <TermList ref="list" @edit="editTerm" @remove="confirmRemoveTerm"></TermList>
  </div>
</section>
</template>

<script>
import ModalAdd from './ModalAdd.vue'
import ModalEdit from './ModalEdit.vue'
import ModalRemove from './ModalRemove.vue'
import TermList from './TermList.vue'

export default {
  name: 'app',
  data() {
    return {
      ui: {
        termlist: 'Ordliste',
        add: 'Legg til'
      },
      currentTerm: null
    }
  },
  components: {
    ModalAdd,
    ModalEdit,
    ModalRemove,
    TermList
  },
  methods: {
    addTerm() {
      this.$refs.addModal.toggleModal();
    },
    editTerm(e) {
      this.currentTerm = e
      this.$refs.editModal.toggleModal();
    },
    confirmRemoveTerm(e) {
      this.currentTerm = e
      this.$refs.removeModal.toggleModal();
    },
    saveTerm(term, data) {
      this.$refs.list.save(term, data);
    },
    removeTerm(term) {
      console.log(term);
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
}
</style>
