<template>
  <div id="app-container" class="has-navbar-fixed-top">
    <Navbar />
    <Modals />
    <div class="container app-content-container">
      <TermSortToolbar />
      <TermList v-if="authenticated" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent } from 'vue'
import { useTermsStore } from './stores/terms'
import Modals from './components/Modals.vue'
import Navbar from './components/Navbar.vue'
import TermSortToolbar from './components/TermList/TermSortToolbar.vue'
import { currentState, globalService } from './machines/globalService'

const TermList = defineAsyncComponent(
  () => import(/* webpackPreload: true */ './components/TermList.vue')
)

const termsStore = useTermsStore()
const authenticated = computed(() => currentState.value !== 'authenticated')

globalService.onTransition(async state => {
  if (state.value === 'idle' && state.history?.value === 'importing') {
    await termsStore.fetchTotal()
    await termsStore.getTerms({
      field: termsStore.$state.sortedBy,
    })
  } else if (
    state.value === 'idle' &&
    state.history?.value === 'authenticating'
  ) {
    await termsStore.fetchTotal()
    await termsStore.getTerms({
      field: termsStore.$state.sortedBy,
    })
    globalService.send('LOAD_COMPLETE')
  }
})

globalService.send('LOG_IN')

const shortcutUp = (e: KeyboardEvent): void => {
  if (
    e.target &&
    ['input', 'textarea'].indexOf(
      (e.target as Element).tagName.toLowerCase()
    ) === -1 &&
    e.key.toLowerCase() === 'n'
  ) {
    globalService.send('EDIT')
  }
}

document.addEventListener('keyup', shortcutUp, false)
</script>

<style>
#app-container {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  height: 100vh;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}
</style>
