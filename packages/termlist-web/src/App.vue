<template>
<section id="app" class="section">
  <ModalAdd ref="addModal" :current="currentTerm" :ui="ui" :fields="fields" @save="saveTerm"></ModalAdd>
  <ModalEdit ref="editModal" :current="currentTerm" :ui="ui" :fields="fields" @save="saveTerm"></ModalEdit>
  <ModalRemove ref="removeModal" :current="currentTerm" :ui="ui" @remove="removeTerm"></ModalRemove>
  <ModalImport ref="importModal" :ui="ui" @import="importTerms"></ModalImport>
  <ModalImporting ref="importingModal" :ui="ui"></ModalImporting>
  <div class="container">
    <h1 class="title">{{ui.termlist}}</h1>
    <div class="field is-grouped">
      <div class="control">
        <AppButton :primary="true" @click="addTerm">{{ui.add}}</AppButton>
      </div>
      <div class="control">
        <AppButton @click="confirmImportTerms">{{ui.importTerms}}</AppButton>
      </div>
    </div>
    <TermList ref="list" :utils="utils" :ui="ui" :terms="terms" :fields="fields" @edit="editTerm" @remove="confirmRemoveTerm" @gotopage="gotoPage" @sort="sort"></TermList>
  </div>
</section>
</template>

<script>
import ModalAdd from './components/Modal/ModalAdd.vue'
import ModalEdit from './components/Modal/ModalEdit.vue'
import ModalRemove from './components/Modal/ModalRemove.vue'
import ModalImport from './components/Modal/ModalImport.vue'
import ModalImporting from './components/Modal/ModalImporting.vue'
import AppButton from './components/Generic/AppButton.vue'
import TermList from './components/TermList.vue'

import MarkdownIt from 'markdown-it';

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
        next: 'Neste',
        sortBy: 'Sorter etter ',
        defaultSort: 'Standard sortering (etter dato)',
        importTerms: 'Importer',
        wordClasses: {
          verb: 'Verb',
          noun: 'Substantiv',
          adjective: 'Adjektiv',
          adverb: 'Adverb',
          preposition: 'Preposisjon',
          conjunction: 'Konjunksjon',
          pronounciation: 'Uttale'
        }
      },
      fields: [{
        name: 'term',
        type: 'short'
      }, {
        name: 'desc',
        type: 'long'
      }, {
        name: 'type',
        type: 'select',
        options: ['verb', 'noun', 'adjective', 'adverb', 'preposition', 'conjunction', 'pronounciation']
      }, {
        name: 'date',
        type: 'date',
        immutable: true
      }, {
        name: '',
        type: 'filler',
        immutable: true
      }],
      currentTerm: null,
      utils: {
        md: null
      },
      sortedBy: 'term'
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
    ModalImport,
    ModalImporting,
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
        this.$store.dispatch('getTerms', {
          field: this.sortedBy
        }).then(() => {
          this.$store.dispatch('getTerms', {
            field: this.sortedBy,
            lastTerm: this.$store.state.terms[Object.keys(this.$store.state.terms)[0]],
            pageNumberOffset: Number(pageNumberOffset),
            isBefore: true
          });
        });
      } else {
        this.$store.dispatch('getTerms', {
          field: this.sortedBy,
          lastTerm: this.$store.state.terms[Object.keys(this.$store.state.terms)[Object.keys(this.$store.state.terms).length - 1]],
          pageNumberOffset: pageNumberOffset - 1
        });
      }
    },
    sort(field) {
      this.$store.dispatch('getTerms', {
        field: field
      })

      this.sortedBy = field;
    },
    confirmImportTerms() {
      this.$refs.importModal.confirmImportTerm();
    },
    async importTerms(terms) {
      this.$store.commit('prepareImport', terms.length)

      for (let term of terms) {
        if (this.$store.state.imports.cancel === false) {
          await this.$store.dispatch('importTerms', Object.assign({
            _id: term.date
          }, term))
        }
      }

      await this.$store.dispatch('getTotal');
      await this.$store.dispatch('getTerms', {
        field: this.sortedBy
      });
    }
  },
  created() {
    this.utils.md = MarkdownIt('zero');
    this.utils.md.enable(['emphasis', 'entity', 'escape', 'link', 'strikethrough', 'text_collapse', 'balance_pairs']);

    this.$store.dispatch('getTotal');
    this.$store.dispatch('getTerms', {
      field: this.sortedBy
    });
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
