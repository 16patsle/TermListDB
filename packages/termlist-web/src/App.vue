<template>
  <div id="app-container">
    <AppNavbar fixed="top">
      <template #brand>
        <AppNavbarItem>
          <h1 class="title">
            {{ ui.termlist }}
          </h1>
        </AppNavbarItem>
      </template>
      <template #start>
        <AppNavbarItem v-if="store.state.auth.authenticated">
          <div class="field is-grouped">
            <div class="control">
              <AppButton primary @click="addTerm">
                {{ ui.add }}
              </AppButton>
            </div>
            <div class="control">
              <AppButton
                @click="store.commit('import/askingForImportConfirmation')"
              >
                {{ ui.importTerms }}
              </AppButton>
            </div>
            <div class="control">
              <AppButton
                @click="store.commit('import/askingForExportConfirmation')"
              >
                {{ ui.exportTerms }}
              </AppButton>
            </div>
          </div>
        </AppNavbarItem>
      </template>
      <template #end>
        <AppNavbarItem
          v-if="store.state.auth.authenticated && store.state.auth.user"
        >
          {{ store.state.auth.user.displayName }}
        </AppNavbarItem>
        <AppNavbarItem v-if="store.state.auth.authenticated">
          <AppButton @click="logOut">
            {{ ui.logOut }}
          </AppButton>
        </AppNavbarItem>
      </template>
    </AppNavbar>
    <ModalEdit />
    <ModalRemove />
    <ModalImport />
    <ModalImporting />
    <ModalExport />
    <Authenticate ref="auth" />
    <div class="container">
      <TermList
        v-if="store.state.auth.authenticated"
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
import { computed, ref, watch } from 'vue'
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
import { currentState, globalService } from './machines/globalService'

import type { TermType } from './types/TermType'
import type { FieldNameType } from './types/FieldNameType'

const store = useStore()
const sortedBy = computed(() => store.state.terms.sortedBy)
const loading = computed(() => currentState.value === 'loading')

const auth = ref<InstanceType<typeof Authenticate>>()

store.dispatch('terms/fetchTotal')
store
  .dispatch('terms/getTerms', {
    field: sortedBy.value,
  })
  .then(() => globalService.send('LOAD_COMPLETE'))

store.subscribe(mutation => {
  if (mutation.type === 'auth/setAuthenticated') {
    store.dispatch('terms/fetchTotal')
    store
      .dispatch('terms/getTerms', {
        field: sortedBy.value,
      })
      .then(() => globalService.send('LOAD_COMPLETE'))
  }
})

watch(
  () => store.state.import.finished,
  async (finished: boolean) => {
    if (finished) {
      await store.dispatch('terms/fetchTotal')
      await store.dispatch('terms/getTerms', {
        field: sortedBy.value,
      })
    }
  }
)

const addTerm = () => globalService.send('EDIT')

const editTerm = (term: TermType) => globalService.send({ type: 'EDIT', term })

const confirmRemoveTerm = (term: TermType) =>
  globalService.send({ type: 'PROMPT_REMOVE', term })

const gotoPage = (pageNumber: number, currentPage: number) =>
  store.dispatch('terms/gotoPage', {
    pageNumber,
    currentPage,
  })

const debouncedSearch = debounce(
  (search: string) => store.dispatch('terms/search', search),
  400
)

const sort = (field?: FieldNameType) => store.dispatch('terms/sort', field)

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

const logOut = () => auth.value?.logOut()

document.addEventListener('keyup', shortcutUp, false)
</script>

<style>
#app-container {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
  margin-top: 4rem;
}
</style>
