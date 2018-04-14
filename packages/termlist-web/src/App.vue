<template>
  <section 
    id="app" 
    class="section">
    <ModalAdd 
      ref="addModal" 
      :current="currentTerm" 
      :ui="ui" 
      :fields="fields" 
      @save="saveTerm"/>
    <ModalEdit 
      ref="editModal" 
      :current="currentTerm" 
      :ui="ui" 
      :fields="fields" 
      @save="saveTerm"/>
    <ModalRemove 
      ref="removeModal" 
      :current="currentTerm" 
      :ui="ui" 
      @remove="removeTerm"/>
    <ModalImport 
      ref="importModal" 
      :ui="ui" 
      @import="importTerms"/>
    <ModalImporting 
      ref="importingModal" 
      :ui="ui"/>
    <ModalExport 
      ref="exportModal" 
      :ui="ui" 
      :export-uri="exportURI" 
      @export="exportTerms" 
      @close="exportURI = ''"/>
    <div class="container">
      <h1 class="title">{{ ui.termlist }}</h1>
      <div class="field is-grouped">
        <div class="control">
          <AppButton 
            :primary="true" 
            @click="addTerm">{{ ui.add }}</AppButton>
        </div>
        <div class="control">
          <AppButton @click="confirmImportTerms">{{ ui.importTerms }}</AppButton>
        </div>
        <div class="control">
          <AppButton @click="confirmExportTerms">{{ ui.exportTerms }}</AppButton>
        </div>
      </div>
      <TermList 
        ref="list" 
        :utils="utils" 
        :ui="ui" 
        :terms="terms" 
        :fields="fields" 
        @edit="editTerm" 
        @remove="confirmRemoveTerm" 
        @gotopage="gotoPage" 
        @sort="sort"/>
    </div>
  </section>
</template>

<script>
import ModalAdd from './components/Modal/ModalAdd.vue'
import ModalEdit from './components/Modal/ModalEdit.vue'
import ModalRemove from './components/Modal/ModalRemove.vue'
import ModalImport from './components/Modal/ModalImport.vue'
import ModalImporting from './components/Modal/ModalImporting.vue'
import ModalExport from './components/Modal/ModalExport.vue'
import AppButton from './components/Generic/AppButton.vue'
import TermList from './components/TermList.vue'

import MarkdownIt from 'markdown-it'

import ui from './assets/ui.js'
import fields from './assets/fields.js'

export default {
  name: 'App',
  components: {
    ModalAdd,
    ModalEdit,
    ModalRemove,
    ModalImport,
    ModalImporting,
    ModalExport,
    AppButton,
    TermList
  },
  data() {
    return {
      ui: ui,
      fields: fields,
      currentTerm: null,
      exportURI: '',
      utils: {
        md: null
      },
      sortedBy: 'term'
    }
  },
  computed: {
    terms() {
      return this.$store.state.terms
    }
  },
  created() {
    this.utils.md = MarkdownIt('zero')
    this.utils.md.enable([
      'emphasis',
      'entity',
      'escape',
      'link',
      'strikethrough',
      'text_collapse',
      'balance_pairs'
    ])

    this.$store.dispatch('getTotal')
    this.$store.dispatch('getTerms', {
      field: this.sortedBy
    })

    document.addEventListener('keyup', this.shortcutUp, false)
  },
  methods: {
    addTerm(e) {
      this.$refs.addModal.addTerm()
    },
    editTerm(term) {
      this.$refs.editModal.editTerm(term)
    },
    confirmRemoveTerm(term) {
      this.$refs.removeModal.confirmRemoveTerm(term)
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
      this.$store.dispatch('remove', term)
    },
    gotoPage(pageNumberOffset, isBefore) {
      if (isBefore) {
        this.$store
          .dispatch('getTerms', {
            field: this.sortedBy
          })
          .then(() => {
            this.$store.dispatch('getTerms', {
              field: this.sortedBy,
              lastTerm: this.$store.state.terms[
                Object.keys(this.$store.state.terms)[0]
              ],
              pageNumberOffset: Number(pageNumberOffset),
              isBefore: true
            })
          })
      } else {
        this.$store.dispatch('getTerms', {
          field: this.sortedBy,
          lastTerm: this.$store.state.terms[
            Object.keys(this.$store.state.terms)[
              Object.keys(this.$store.state.terms).length - 1
            ]
          ],
          pageNumberOffset: pageNumberOffset - 1
        })
      }
    },
    sort(field) {
      this.$store.dispatch('getTerms', {
        field: field
      })

      this.sortedBy = field
    },
    shortcutUp(e) {
      if (
        ['input', 'textarea'].indexOf(e.target.tagName.toLowerCase()) === -1 &&
        e.key.toLowerCase() === 'n'
      ) {
        this.addTerm()
      }
    },
    confirmImportTerms() {
      this.$refs.importModal.confirmImportTerm()
    },
    async importTerms(terms) {
      this.$store.commit('prepareImport', terms.length)

      let imports = []

      for (let term of terms) {
        if (this.$store.state.imports.cancel === false) {
          imports.push(
            this.$store.dispatch(
              'importTerms',
              Object.assign(
                {
                  _id: term.date
                },
                term
              )
            )
          )
        }
      }

      await Promise.all(imports)

      await this.$store.dispatch('getTotal')
      await this.$store.dispatch('getTerms', {
        field: this.sortedBy
      })
    },
    confirmExportTerms() {
      this.$refs.exportModal.confirmExportTerm()
    },
    async exportTerms() {
      const terms = await this.$store.dispatch('exportTerms')

      let exported = []

      for (let term of terms.docs) {
        exported.push({
          _id: term._id,
          term: term.term,
          desc: term.desc,
          date: term.date,
          type: term.type
        })
      }

      this.exportURI =
        'data:application/json;charset=utf-8, ' +
        encodeURIComponent(JSON.stringify(exported))
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
