<template>
<section id="app" class="section">
  <ModalAdd ref="addModal" :current="currentTerm" :ui="ui" :fields="fields" @save="saveTerm"></ModalAdd>
  <ModalEdit ref="editModal" :current="currentTerm" :ui="ui" :fields="fields" @save="saveTerm"></ModalEdit>
  <ModalRemove ref="removeModal" :current="currentTerm" :ui="ui" @remove="removeTerm"></ModalRemove>
  <div class="container">
    <h1 class="title">{{ui.termlist}}</h1>
    <div class="field">
      <div class="control">
        <AppButton primary="true" @click="addTerm">{{ui.add}}</AppButton>
      </div>
    </div>
    <TermList ref="list" :ui="ui" :terms="terms" :fields="fields" @edit="editTerm" @remove="confirmRemoveTerm" @gotopage="gotoPage"></TermList>
  </div>
</section>
</template>

<script>
import ModalAdd from './components/Modal/ModalAdd.vue'
import ModalEdit from './components/Modal/ModalEdit.vue'
import ModalRemove from './components/Modal/ModalRemove.vue'
import AppButton from './components/Generic/AppButton.vue'
import TermList from './components/TermList.vue'

export default {
  name: 'app',
  data() {
    return {
      ui: {
        termlist: 'Ordliste',
        term: 'Ord',
        desc: 'Forklaring',
        type: 'Ordklasse',
        date: 'Dato',
        add: 'Legg til',
        addterm: 'Legg til ord',
        save: 'Lagre',
        editterm: 'Rediger ord',
        removeterm: 'Fjern ord',
        wanttoremove: 'Vil du fjerne dette ordet?',
        cancel: 'Avbryt',
        search: 'Søk',
        pagenumber: 'Side',
        gotopage: 'Gå til side',
        previous: 'Forrige',
        next: 'Neste'
      },
      fields: [{
        name: 'term',
        type: 'short'
      }, {
        name: 'desc',
        type: 'long'
      }, {
        name: 'type',
        type: 'short'
      }, {
        name: 'date',
        type: 'date',
        immutable: true
      }, {
        name: '',
        type: 'filler',
        immutable: true
      }],
      currentTerm: null
    }
  },
  computed: {
    terms() {
      return this.$store.state.terms;
    }
  },
  components: {
    ModalAdd,
    ModalEdit,
    ModalRemove,
    AppButton,
    TermList
  },
  methods: {
    addTerm(e) {
      this.$refs.addModal.addTerm();
    },
    editTerm(term) {
      this.$refs.editModal.editTerm(term);
    },
    confirmRemoveTerm(term) {
      this.$refs.removeModal.confirmRemoveTerm(term);
    },
    saveTerm(term, data) {
      if (term.term) {
        // Update existing term
        this.$store.dispatch('save', Object.assign({}, term, data))
      } else {
        // Add new term
        this.$store.dispatch('add', Object.assign({}, term, data))
      }
    },
    removeTerm(term) {
      this.$store.dispatch('remove', term);
    },
    gotoPage(pageNumberOffset, isBefore) {
      if (isBefore) {
        this.$store.dispatch('allDocs').then(() => {
          this.$store.dispatch('gotoPage', {
            lastTerm: this.$store.state.terms[Object.keys(this.$store.state.terms)[0]]['_id'],
            pageNumberOffset: Number(pageNumberOffset),
            isBefore: true
          });
        });
      } else {
        this.$store.dispatch('gotoPage', {
          lastTerm: this.$store.state.terms[Object.keys(this.$store.state.terms)[Object.keys(this.$store.state.terms).length - 1]]['_id'],
          pageNumberOffset: 0
        });
      }
    }
  },
  created() {
    this.$store.dispatch('allDocs');
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
