import { createApp, defineAsyncComponent } from 'vue'
import { createPinia } from 'pinia'
import { onSnapshot } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { database } from './database'
import { auth } from './utils/getAuth'
import { useAuthStore } from './stores/auth'
import { useTermsStore } from './stores/terms'
import App from './App.vue'

export async function initApp() {
  await database.start()

  const app = createApp(App).component(
    'fa-icon',
    defineAsyncComponent(
      async () =>
        (await import(/* webpackPrefetch: true */ './iconLibrary'))
          .FontAwesomeIcon
    )
  )

  app.use(createPinia())

  const authStore = useAuthStore()
  const termsStore = useTermsStore()

  app.mount('#app')

  onAuthStateChanged(auth, user => {
    authStore.setAuthenticated(user)
    if (database.userInfoReference) {
      onSnapshot(database.userInfoReference, doc => {
        const data = doc.data()
        if (data && typeof data.termlists_total === 'number') {
          termsStore.setTotal(data.termlists_total)
        }
      })
    }
  })
}
