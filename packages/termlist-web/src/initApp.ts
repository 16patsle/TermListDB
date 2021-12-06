import { createApp, defineAsyncComponent } from 'vue'
import { createPinia } from 'pinia'
import { onSnapshot } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { database } from './utils/firebase'
import { auth } from './utils/getAuth'
import { useAuthStore } from './stores/auth'
import { useTermsStore } from './stores/terms'

export async function initApp() {
  await database.start()

  const app = createApp(
    defineAsyncComponent(() => import(/* webpackPreload: true */ './App.vue'))
  ).component(
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
        if (data) {
          termsStore.setTotal(data.termlists_total)
        }
      })
    }
  })
}
