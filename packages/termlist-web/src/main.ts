import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/main.scss'
import 'font-awesome/css/font-awesome.css'
import { onSnapshot } from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import './auth-ui/firebaseui.css'
import App from './App.vue'

import database, { firebaseApp } from './utils/firebase'
import { useAuthStore } from './stores/auth'
import { useTermsStore } from './stores/terms'

const start = async () => {
  await database.start()

  const app = createApp(App)

  app.use(createPinia())

  const authStore = useAuthStore()
  const termsStore = useTermsStore()

  app.mount('#app')

  onAuthStateChanged(getAuth(firebaseApp), user => {
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
void start()
