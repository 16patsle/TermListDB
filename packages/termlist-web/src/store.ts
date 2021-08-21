import { createStore } from 'vuex'
import type { Store, StoreOptions } from 'vuex'

import StoreModule from './storeModule'

import type { StateType } from './types/StateType'

const storeOptions: StoreOptions<StateType> = {
  modules: {
    storeModule: StoreModule,
  },
}

const store: Store<StateType> = createStore(storeOptions)

export default store
