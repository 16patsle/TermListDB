import '@babel/polyfill'
import Vue from 'vue'
import Vuex from 'vuex'
import type { Store, StoreOptions } from 'vuex'
import './assets/main.scss'
import 'font-awesome/css/font-awesome.css'
import firebase from 'firebase/app'
import 'termlist-auth-ui/dist/firebaseui.css'
import App from './App.vue'

import StoreModule from './storemodule'
import database from './utils/firebase'

import type { StateType } from './types/StateType'

Vue.use(Vuex)

const storeOptions: StoreOptions<StateType> = {
  modules: {
    storeModule: StoreModule,
  },
}

const store: Store<StateType> = new Vuex.Store(storeOptions)

const start = async () => {
  await database.start()

  new Vue({
    el: '#app',
    created() {
      firebase.auth().onAuthStateChanged(user => {
        store.commit('setAuthenticated', user)
        database.userInfoReference.onSnapshot(doc => {
          this.$store.commit('setTotal', doc.data().termlists_total)
        })
      })
    },
    store,
    render: h => h(App),
  })
}
start()
