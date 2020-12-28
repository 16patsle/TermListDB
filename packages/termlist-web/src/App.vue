<template>
  <div id="app">
    <AppNavbar fixed="top">
      <template #brand>
        <AppNavbarItem>
          <h1 class="title">
            {{ ui.termlist }}
          </h1>
        </AppNavbarItem>
      </template>
      <template #start>
        <AppNavbarItem v-if="storeModule.auth.authenticated">
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
      <template #end>
        <AppNavbarItem
          v-if="storeModule.auth.authenticated && storeModule.auth.user"
        >
          {{ storeModule.auth.user.displayName }}
        </AppNavbarItem>
        <AppNavbarItem v-if="storeModule.auth.authenticated">
          <AppButton @click="logOut">
            {{ ui.logOut }}
          </AppButton>
        </AppNavbarItem>
      </template>
    </AppNavbar>
    <ModalAdd ref="addModal" :current="currentTerm" @save="saveTerm" />
    <ModalEdit ref="editModal" :current="currentTerm" @save="saveTerm" />
    <ModalRemove
      ref="removeModal"
      :current="currentTerm"
      @remove="removeTerm"
    />
    <ModalImport ref="importModal" @import="importTerms" />
    <ModalImporting ref="importingModal" />
    <ModalExport
      ref="exportModal"
      :export-uri="exportURI"
      @export="exportTerms"
      @close="exportURI = ''"
    />
    <Authenticate ref="auth" />
    <div class="container">
      <TermList
        v-if="storeModule.auth.authenticated"
        ref="list"
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

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
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

import ui from './assets/ui'
import storeModule from './utils/storeModule'

import type { TermType } from './types/TermType'
import type { StateType } from './types/StateType'
import type { Store } from 'vuex'
import type { FieldNameType } from './types/FieldNameType'
import type { TermQueryType } from './types/TermQueryType'

@Component({
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
    TermList,
  },
})
export default class App extends Vue {
  $refs!: {
    addModal: ModalAdd
    editModal: ModalEdit
    removeModal: ModalRemove
    importModal: ModalImport
    exportModal: ModalExport
    auth: Authenticate
  }
  $store!: Store<StateType>
  storeModule = storeModule

  ui = ui
  currentTerm: TermType | null = null
  exportURI = ''
  sortedBy: FieldNameType = 'term'
  loading = false

  created(): void {
    this.loading = true

    this.storeModule.fetchTotal()
    this.storeModule
      .getTerms({
        field: this.sortedBy,
      })
      .then(() => (this.loading = false))

    this.$store.subscribe(mutation => {
      if (mutation.type === 'setAuthenticated') {
        this.storeModule.fetchTotal()
        this.storeModule
          .getTerms({
            field: this.sortedBy,
          })
          .then(() => (this.loading = false))
      }
    })

    document.addEventListener('keyup', this.shortcutUp, false)
  }

  addTerm(): void {
    this.$refs.addModal.addTerm()
  }

  editTerm(term: TermType): void {
    this.$refs.editModal.editTerm(term)
  }

  confirmRemoveTerm(term: TermType): void {
    this.$refs.removeModal.confirmRemoveTerm(term)
  }

  saveTerm(term: TermType): void {
    if (term.term) {
      // Update existing term
      this.storeModule.save(term)
    } else {
      // Add new term
      this.storeModule.add(term)
    }
  }

  removeTerm(term: TermType): void {
    this.storeModule.remove(term)
  }

  async gotoPage(pageNumber: number, currentPage: number): Promise<void> {
    const terms = this.storeModule.terms
    const pageNumberOffset = pageNumber - currentPage
    const isBefore = pageNumber < currentPage

    this.loading = true

    if (Math.abs(pageNumberOffset) === 1) {
      if (isBefore) {
        await this.storeModule.getTerms({
          field: this.sortedBy,
          endBefore: Object.entries(terms)[0][1][this.sortedBy],
        })

        this.loading = false
      } else {
        await this.storeModule.getTerms({
          field: this.sortedBy,
          startAfter: Object.entries(terms)[Object.keys(terms).length - 1][1][
            this.sortedBy
          ],
        })

        this.loading = false
      }
    } else {
      if (isBefore) {
        const limit = pageNumber * 20

        await this.storeModule.getTerms({
          field: this.sortedBy,
          limit,
          showLimit: 20,
        })

        this.loading = false
      } else {
        const termsLeft = this.storeModule.totalRows - 20 * currentPage
        // Amount of terms on x pages
        const limit = termsLeft
        let showLimit = 20

        // If the amount of terms won't fill the last page completely,
        // find out how many are on the last page and add them instead
        if (termsLeft % 20 !== 0) {
          showLimit = termsLeft % 20
        }

        await this.storeModule.getTerms({
          field: this.sortedBy,
          startAfter: Object.entries(terms)[Object.keys(terms).length - 1][1][
            this.sortedBy
          ],
          limit,
          showLimit,
        })

        this.loading = false
      }
    }
  }

  async search(search: TermQueryType): Promise<void> {
    this.loading = true

    await this.storeModule.getTerms({
      field: this.sortedBy,
      search: search.search,
    })

    this.loading = false
  }

  async sort(field: FieldNameType): Promise<void> {
    this.loading = true
    await this.storeModule.getTerms({
      field: field,
    })
    this.loading = false

    this.sortedBy = field
  }

  shortcutUp(e: KeyboardEvent): void {
    if (
      e.target &&
      ['input', 'textarea'].indexOf(
        (e.target as Element).tagName.toLowerCase()
      ) === -1 &&
      e.key.toLowerCase() === 'n'
    ) {
      this.addTerm()
    }
  }

  confirmImportTerms(): void {
    this.$refs.importModal.confirmImportTerm()
  }

  async importTerms(terms: TermType[]): Promise<void> {
    this.storeModule.prepareImport(terms.length)

    let imports = []

    for (let term of terms) {
      if (this.storeModule.imports.cancel === false) {
        imports.push(
          this.$store.dispatch(
            'importTerms',
            Object.assign(
              {
                _id: term.date,
              },
              term
            )
          )
        )
      }
    }

    await Promise.all(imports)

    await this.storeModule.fetchTotal()
    await this.storeModule.getTerms({
      field: this.sortedBy,
    })
  }

  confirmExportTerms(): void {
    this.$refs.exportModal.confirmExportTerm()
  }

  async exportTerms(): Promise<void> {
    let exported = (await this.storeModule.exportTerms()).map(term => ({
      _id: term._id,
      term: term.term,
      desc: term.desc,
      date: term.date,
      type: term.type,
    }))

    this.exportURI =
      'data:application/json;charset=utf-8, ' +
      encodeURIComponent(JSON.stringify(exported))
  }

  logOut(): void {
    this.$refs.auth.logOut()
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
