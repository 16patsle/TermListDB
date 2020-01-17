<template>
  <div id="app">
    <AppNavbar fixed="top">
      <template v-slot:brand>
        <AppNavbarItem>
          <h1 class="title">
            {{ ui.termlist }}
          </h1>
        </AppNavbarItem>
      </template>
      <template v-slot:start>
        <AppNavbarItem v-if="$store.state.auth.authenticated">
          <div class="field is-grouped">
            <div class="control">
              <AppButton :primary="true" @click="addTerm">
                {{ ui.add }}
              </AppButton>
            </div>
            <div class="control">
              <AppButton @click="confirmImportTerms">
                {{ ui.importTerms }}
              </AppButton>
            </div>
            <div class="control">
              <AppButton @click="confirmExportTerms">
                {{ ui.exportTerms }}
              </AppButton>
            </div>
          </div>
        </AppNavbarItem>
      </template>
      <template v-slot:end>
        <AppNavbarItem v-if="$store.state.auth.authenticated">
          {{ $store.state.auth.user.displayName }}
        </AppNavbarItem>
        <AppNavbarItem v-if="$store.state.auth.authenticated">
          <AppButton @click="$refs.auth.logOut">
            {{ ui.logOut }}
          </AppButton>
        </AppNavbarItem>
      </template>
    </AppNavbar>
    <ModalAdd
      ref="addModal"
      :current="currentTerm"
      :ui="ui"
      :fields="fields"
      @save="saveTerm"
    />
    <ModalEdit
      ref="editModal"
      :current="currentTerm"
      :ui="ui"
      :fields="fields"
      @save="saveTerm"
    />
    <ModalRemove
      ref="removeModal"
      :current="currentTerm"
      :ui="ui"
      @remove="removeTerm"
    />
    <ModalImport ref="importModal" :ui="ui" @import="importTerms" />
    <ModalImporting ref="importingModal" :ui="ui" />
    <ModalExport
      ref="exportModal"
      :ui="ui"
      :export-uri="exportURI"
      @export="exportTerms"
      @close="exportURI = ''"
    />
    <Authenticate
      v-show="!$store.state.auth.authenticated"
      ref="auth"
      :ui="ui"
    />
    <div class="container">
      <TermList
        v-if="$store.state.auth.authenticated"
        ref="list"
        :utils="utils"
        :ui="ui"
        :terms="terms"
        :fields="fields"
        :loading="loading"
        @edit="editTerm"
        @remove="confirmRemoveTerm"
        @gotopage="gotoPage"
        @search="search"
        @sort="sort"
      />
    </div>
  </div>
</template>

<script>
import ModalAdd from './components/Modal/ModalAdd.vue'
import ModalEdit from './components/Modal/ModalEdit.vue'
import ModalRemove from './components/Modal/ModalRemove.vue'
import ModalImport from './components/Modal/ModalImport.vue'
import ModalImporting from './components/Modal/ModalImporting.vue'
import ModalExport from './components/Modal/ModalExport.vue'
import AppButton from './components/Generic/AppButton.vue'
import AppNavbar from './components/Generic/AppNavbar.vue'
import AppNavbarItem from './components/Generic/AppNavbarItem.vue'
import Authenticate from './components/Authenticate.vue'
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
    AppNavbar,
    AppNavbarItem,
    Authenticate,
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
      sortedBy: 'term',
      loading: false
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

    this.loading = true

    this.$store.dispatch('fetchTotal')
    this.$store
      .dispatch('getTerms', {
        field: this.sortedBy
      })
      .then(() => (this.loading = false))

    this.$store.subscribe(mutation => {
      if (mutation.type === 'setAuthenticated') {
        this.$store.dispatch('fetchTotal')
        this.$store
          .dispatch('getTerms', {
            field: this.sortedBy
          })
          .then(() => (this.loading = false))
      }
    })

    document.addEventListener('keyup', this.shortcutUp, false)
  },
  methods: {
    addTerm() {
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
    async gotoPage(pageNumber, currentPage) {
      const terms = this.$store.state.terms
      const pageNumberOffset = pageNumber - currentPage
      const isBefore = pageNumber < currentPage

      this.loading = true

      if (Math.abs(pageNumberOffset) === 1) {
        if (isBefore) {
          await this.$store.dispatch('getTerms', {
            field: this.sortedBy,
            endBefore: Object.entries(terms)[0][1][this.sortedBy]
          })

          this.loading = false
        } else {
          await this.$store.dispatch('getTerms', {
            field: this.sortedBy,
            startAfter: Object.entries(terms)[Object.keys(terms).length - 1][1][
              this.sortedBy
            ]
          })

          this.loading = false
        }
      } else {
        if (isBefore) {
          const limit = pageNumber * 20

          await this.$store.dispatch('getTerms', {
            field: this.sortedBy,
            limit,
            showLimit: 20
          })

          this.loading = false
        } else {
          const termsLeft = this.$store.state.totalRows - 20 * currentPage
          // Amount of terms on x pages
          const limit = termsLeft
          let showLimit = 20

          // If the amount of terms won't fill the last page completely,
          // find out how many are on the last page and add them instead
          if (termsLeft % 20 !== 0) {
            showLimit = termsLeft % 20
          }

          await this.$store.dispatch('getTerms', {
            field: this.sortedBy,
            startAfter: Object.entries(terms)[Object.keys(terms).length - 1][1][
              this.sortedBy
            ],
            limit,
            showLimit
          })

          this.loading = false
        }
      }
    },
    search(search) {
      this.$store.dispatch('find', { field: this.sortedBy, ...search })
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

      await this.$store.dispatch('fetchTotal')
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
        term = term.data()

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
