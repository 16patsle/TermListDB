import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/main.scss'
import 'font-awesome/css/font-awesome.css'
import { onSnapshot } from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import './auth-ui/firebaseui.css'
import App from './App.vue'

import database, { firebaseApp } from './utils/firebase'
import store, { key } from './stores'

const start = async () => {
  await database.start()

  const app = createApp(App)

  app.use(store, key)
  app.use(createPinia())

  app.mount('#app')

  onAuthStateChanged(getAuth(firebaseApp), user => {
    store.commit('auth/setAuthenticated', user)
    if (database.userInfoReference) {
      onSnapshot(database.userInfoReference, doc => {
        const data = doc.data()
        if (data) {
          store.commit('terms/setTotal', data.termlists_total)
        }
      })
    }
  })
}
void start()
