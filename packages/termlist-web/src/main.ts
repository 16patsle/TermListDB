import { createApp, configureCompat } from 'vue'
import './assets/main.scss'
import 'font-awesome/css/font-awesome.css'
import firebase from 'firebase/app'
import './auth-ui/firebaseui.css'
import App from './App.vue'

import database from './utils/firebase'
import store, { key } from './store'

const start = async () => {
  await database.start()

  configureCompat({ MODE: 3, RENDER_FUNCTION: false, ATTR_FALSE_VALUE: true })

  const app = createApp(App)

  app.use(store, key)

  app.mount('#app')

  firebase.auth().onAuthStateChanged(user => {
    store.commit('auth/setAuthenticated', user)
    if (database.userInfoReference) {
      database.userInfoReference.onSnapshot(doc => {
        const data = doc.data()
        if (data) {
          store.commit('terms/setTotal', data.termlists_total)
        }
      })
    }
  })
}
start()
