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
        <AppNavbarItem v-if="authenticated">
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
        <AppNavbarItem v-if="authenticated && authStore.$state.user">
          {{ authStore.$state.user.displayName }}
        </AppNavbarItem>
        <AppNavbarItem v-if="authenticated">
          <AppButton @click="logOut">
            {{ ui.logOut }}
          </AppButton>
        </AppNavbarItem>
      </template>
    </AppNavbar>
    <ModalContainer />
    <div class="container app-content-container">
      <TermSortToolbar @search="debouncedSearch" @sort="sort" />
      <TermList v-if="authenticated" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent } from 'vue'
import debounce from 'just-debounce-it'
import { getAuth, signOut } from 'firebase/auth'
import { useTermsStore } from './stores/terms'
import { useAuthStore } from './stores/auth'
import AppButton from './components/Generic/AppButton.vue'
import AppNavbar from './components/Generic/AppNavbar.vue'
import AppNavbarItem from './components/Generic/AppNavbarItem.vue'
import TermSortToolbar from './components/TermList/TermSortToolbar.vue'
import ui from './assets/ui'
import { currentState, globalService } from './machines/globalService'
import { firebaseApp } from './utils/initializeFirebase'

import type { FieldNameType } from './types/FieldNameType'

const auth = getAuth(firebaseApp)

const ModalContainer = defineAsyncComponent(
  () =>
    import(/* webpackPrefetch: true */ './components/Modal/ModalContainer.vue')
)
const TermList = defineAsyncComponent(
  () => import(/* webpackPreload: true */ './components/TermList.vue')
)

const termsStore = useTermsStore()
const authStore = useAuthStore()
const sortedBy = computed(() => termsStore.$state.sortedBy)
const authenticated = computed(() => currentState.value !== 'authenticated')

globalService.onTransition(async state => {
  if (state.value === 'idle' && state.history?.value === 'importing') {
    await termsStore.fetchTotal()
    await termsStore.getTerms({
      field: sortedBy.value,
    })
  } else if (
    state.value === 'idle' &&
    state.history?.value === 'authenticating'
  ) {
    await termsStore.fetchTotal()
    await termsStore.getTerms({
      field: sortedBy.value,
    })
    globalService.send('LOAD_COMPLETE')
  }
})

globalService.send('LOG_IN')

const addTerm = () => globalService.send('EDIT')

const debouncedSearch = debounce(
  (search: string) => termsStore.search(search),
  400
)

const sort = (field?: FieldNameType) => termsStore.sort(field)

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

const logOut = async () => {
  await signOut(auth)
  globalService.send('LOG_OUT')
}

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
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}
</style>
