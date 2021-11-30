import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/main.scss'
import 'font-awesome/css/font-awesome.css'
import { onSnapshot } from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import App from './App.vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faPencilAlt,
  faTrashAlt,
  faSearch,
  faUpload,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import database, { firebaseApp } from './utils/firebase'
import { useAuthStore } from './stores/auth'
import { useTermsStore } from './stores/terms'

library.add(faPencilAlt, faTrashAlt, faSearch, faUpload, faSpinner)

if (document.getElementById('app') === null) {
  const el = document.createElement('div')
  el.id = 'app'
  document.body.appendChild(el)
}

const start = async () => {
  await database.start()

  const app = createApp(App).component('fa-icon', FontAwesomeIcon)

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
