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
              <AppButton primary @click="addTerm">
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
    <ModalEdit ref="editModal" @save="saveTerm" />
    <ModalRemove ref="removeModal" @remove="removeTerm" />
    <ModalImport ref="importModal" @import="importTerms" />
    <ModalImporting />
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
        :loading="loading"
        @edit="editTerm"
        @remove="confirmRemoveTerm"
        @gotopage="gotoPage"
        @search="debouncedSearch"
        @sort="sort"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import debounce from 'lodash.debounce'
import { useStore } from './store'
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
import type { TermDefType, TermType } from './types/TermType'
import type { FieldNameType } from './types/FieldNameType'
import type { TermQueryType } from './types/TermQueryType'

const $store = useStore()
const exportURI = ref('')
const sortedBy = ref<FieldNameType>('term')
const loading = ref(true)

const editModal = ref<InstanceType<typeof ModalEdit>>()
const removeModal = ref<InstanceType<typeof ModalRemove>>()
const importModal = ref<InstanceType<typeof ModalImport>>()
const exportModal = ref<InstanceType<typeof ModalExport>>()
const auth = ref<InstanceType<typeof Authenticate>>()

storeModule.fetchTotal()
storeModule
  .getTerms({
    field: sortedBy.value,
  })
  .then(() => (loading.value = false))

$store.subscribe(mutation => {
  if (mutation.type === 'setAuthenticated') {
    storeModule.fetchTotal()
    storeModule
      .getTerms({
        field: sortedBy.value,
      })
      .then(() => (loading.value = false))
  }
})

const addTerm = (): void => {
  editModal.value?.addTerm()
}

const editTerm = (term: TermType): void => {
  editModal.value?.editTerm(term)
}

const confirmRemoveTerm = (term: TermType): void => {
  removeModal.value?.confirmRemoveTerm(term)
}

const saveTerm = (term: TermDefType): void => {
  if (term._id) {
    // Update existing term
    storeModule.save(term as TermType)
  } else {
    term._id = term.date
    // Add new term
    storeModule.add(term as TermType)

    // Reload from first page
    storeModule.getTerms({
      field: sortedBy.value,
    })
  }
}

const removeTerm = (term: TermType): void => {
  storeModule.remove(term)
}

const gotoPage = async (
  pageNumber: number,
  currentPage: number
): Promise<void> => {
  const terms = storeModule.terms
  const pageNumberOffset = pageNumber - currentPage
  const isBefore = pageNumber < currentPage

  loading.value = true

  if (Math.abs(pageNumberOffset) === 1) {
    if (isBefore) {
      await storeModule.getTerms({
        field: sortedBy.value,
        endBefore: Object.entries(terms)[0][1][sortedBy.value],
      })

      loading.value = false
    } else {
      await storeModule.getTerms({
        field: sortedBy.value,
        startAfter:
          Object.entries(terms)[Object.keys(terms).length - 1][1][
            sortedBy.value
          ],
      })

      loading.value = false
    }
  } else {
    if (isBefore) {
      const limit = pageNumber * 20

      await storeModule.getTerms({
        field: sortedBy.value,
        limit,
        showLimit: 20,
      })

      loading.value = false
    } else {
      const termsLeft = storeModule.totalRows - 20 * currentPage
      // Amount of terms on x pages
      const limit = termsLeft
      let showLimit = 20

      // If the amount of terms won't fill the last page completely,
      // find out how many are on the last page and add them instead
      if (termsLeft % 20 !== 0) {
        showLimit = termsLeft % 20
      }

      await storeModule.getTerms({
        field: sortedBy.value,
        startAfter:
          Object.entries(terms)[Object.keys(terms).length - 1][1][
            sortedBy.value
          ],
        limit,
        showLimit,
      })

      loading.value = false
    }
  }
}

const search = async (search: TermQueryType): Promise<void> => {
  loading.value = true

  await storeModule.getTerms({
    field: sortedBy.value,
    search: search,
  })

  loading.value = false
}

const debouncedSearch = debounce(search, 400)

const sort = async (field: FieldNameType): Promise<void> => {
  loading.value = true
  await storeModule.getTerms({
    field: field,
  })
  loading.value = false

  sortedBy.value = field
}

const shortcutUp = (e: KeyboardEvent): void => {
  if (
    e.target &&
    ['input', 'textarea'].indexOf(
      (e.target as Element).tagName.toLowerCase()
    ) === -1 &&
    e.key.toLowerCase() === 'n'
  ) {
    addTerm()
  }
}

const confirmImportTerms = (): void => {
  importModal.value?.confirmImportTerm()
}

const importTerms = async (terms: TermType[]): Promise<void> => {
  storeModule.prepareImport(terms.length)

  let imports = []

  for (let term of terms) {
    if (storeModule.imports.cancel === false) {
      imports.push(
        $store.dispatch(
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

  await storeModule.fetchTotal()
  await storeModule.getTerms({
    field: sortedBy.value,
  })
}

const confirmExportTerms = (): void => {
  exportModal.value?.confirmExportTerm()
}

const exportTerms = async (): Promise<void> => {
  let exported = (await storeModule.exportTerms()).map(term => ({
    _id: term._id,
    term: term.term,
    desc: term.desc,
    date: term.date,
    type: term.type,
  }))

  exportURI.value =
    'data:application/json;charset=utf-8, ' +
    encodeURIComponent(JSON.stringify(exported))
}

const logOut = (): void => {
  auth.value?.logOut()
}

document.addEventListener('keyup', shortcutUp, false)
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
