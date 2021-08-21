import { createStore, useStore as baseUseStore } from 'vuex'
import type { InjectionKey } from 'vue'
import type { Store, StoreOptions } from 'vuex'

import StoreModule from './storeModule'

import type { StateType } from './types/StateType'

const storeOptions: StoreOptions<StateType> = {
  modules: {
    storeModule: StoreModule,
  },
}

export const key: InjectionKey<Store<StateType>> = Symbol()

export const store = createStore<StateType>(storeOptions)

export default store

export const useStore = (): Store<StateType> => {
  return baseUseStore(key)
}
