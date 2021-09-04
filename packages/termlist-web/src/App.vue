<template>
  <div id="app-container" class="has-navbar-fixed-top">
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
              <AppButton @click="globalService.send('IMPORT')">
                {{ ui.importTerms }}
              </AppButton>
            </div>
            <div class="control">
              <AppButton @click="globalService.send('EXPORT')">
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
    <ModalContainer />
    <Authenticate ref="auth" />
    <div class="container">
      <TermSearchBar @search="debouncedSearch" />
      <TermSortSelect @sort="sort" />
      <TermList v-if="store.state.auth.authenticated" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, ref } from 'vue'
import debounce from 'lodash.debounce'
import { useStore } from './store'
import AppButton from './components/Generic/AppButton.vue'
import AppNavbar from './components/Generic/AppNavbar.vue'
import AppNavbarItem from './components/Generic/AppNavbarItem.vue'
import Authenticate, {
  AuthenticateMethods,
} from './components/Authenticate.vue'
import TermSearchBar from './components/TermList/TermSearchBar.vue'
import TermSortSelect from './components/TermList/TermSortSelect.vue'
import TermList from './components/TermList.vue'
import ui from './assets/ui'
import { globalService } from './machines/globalService'

import type { FieldNameType } from './types/FieldNameType'

const ModalContainer = defineAsyncComponent(
  () => import('./components/Modal/ModalContainer.vue')
)

const store = useStore()
const sortedBy = computed(() => store.state.terms.sortedBy)

const auth = ref<InstanceType<typeof Authenticate> & AuthenticateMethods>()

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

globalService.onTransition(async state => {
  if (state.value === 'idle' && state.history?.value === 'importing') {
    await store.dispatch('terms/fetchTotal')
    await store.dispatch('terms/getTerms', {
      field: sortedBy.value,
    })
  }
})

const addTerm = () => globalService.send('EDIT')

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
  margin-top: 0.25rem;
}
</style>
