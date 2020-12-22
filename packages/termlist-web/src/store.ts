import Vue from 'vue'
import Vuex from 'vuex'
import type { Store, StoreOptions } from 'vuex'
import 'termlist-auth-ui/dist/firebaseui.css'

import StoreModule from './storeModule'

import type { StateType } from './types/StateType'

Vue.use(Vuex)

const storeOptions: StoreOptions<StateType> = {
  modules: {
    storeModule: StoreModule,
  },
}

const store: Store<StateType> = new Vuex.Store(storeOptions)

export default store
