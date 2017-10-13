<template>
<section id="app" class="section">
  <ModalAdd ref="addModal" :current="currentTerm" :ui="ui" @save="saveTerm"></ModalAdd>
  <ModalEdit ref="editModal" :current="currentTerm" :ui="ui" @save="saveTerm"></ModalEdit>
  <ModalRemove ref="removeModal" :current="currentTerm" :ui="ui" @remove="removeTerm"></ModalRemove>
  <div class="container">
    <h1 class="title">{{ui.termlist}}</h1>
    <div class="field">
      <div class="control">
        <button class="button is-primary" @click="addTerm">{{ui.add}}</button>
      </div>
    </div>
    <TermList ref="list" :ui="ui" @edit="editTerm" @remove="confirmRemoveTerm"></TermList>
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
        term: 'Ord',
        description: 'Forklaring',
        date: 'Dato',
        add: 'Legg til',
        addterm: 'Legg til ord',
        save: 'Lagre',
        editterm: 'Rediger ord',
        removeterm: 'Fjern ord',
        wanttoremove: 'Vil du fjerne dette ordet?',
        cancel: 'Avbryt'
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
    addTerm(e) {
      this.$refs.addModal.addTerm(e);
    },
    editTerm(e) {
      console.log(e.target.parentNode.parentNode.parentNode.parentNode.querySelector('.date').textContent);
      this.$refs.editModal.editTerm(e.target.parentNode.parentNode.parentNode.parentNode);
    },
    confirmRemoveTerm(e) {
      this.$refs.removeModal.confirmRemoveTerm(e);
    },
    saveTerm(term, data) {
      this.$refs.list.save(term, data);
    },
    removeTerm(term) {
      console.log('Remove: ', term);
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
