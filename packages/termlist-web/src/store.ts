import {
  CommitOptions,
  createStore,
  DispatchOptions,
  useStore as baseUseStore,
} from 'vuex'
import type { InjectionKey } from 'vue'
import type { Store as VuexStore, StoreOptions } from 'vuex'

import {
  Actions as ModuleActions,
  Getters as ModuleGetters,
  Mutations as ModuleMutations,
  storeModule,
} from './storeModule'

import type { StateType } from './types/StateType'
import type { Namespaced } from './types/Namespaced'

type Mutations = Namespaced<ModuleMutations, 'storeModule'>
type Actions = Namespaced<ModuleActions, 'storeModule'>
type Getters = Namespaced<ModuleGetters, 'storeModule'>

export type Store = Omit<
  VuexStore<StateType>,
  'getters' | 'commit' | 'dispatch'
> & {
  commit<K extends keyof Mutations, P extends Parameters<Mutations[K]>[1]>(
    key: K,
    payload: P,
    options?: CommitOptions
  ): ReturnType<Mutations[K]>
} & {
  dispatch<K extends keyof Actions>(
    key: K,
    payload: Parameters<Actions[K]>[1],
    options?: DispatchOptions
  ): ReturnType<Actions[K]>
} & {
  getters: {
    [K in keyof Getters]: ReturnType<Getters[K]>
  }
}

const storeOptions: StoreOptions<StateType> = {
  modules: {
    storeModule,
  },
}

export const key: InjectionKey<Store> = Symbol()

export const store: Store = createStore<StateType>(storeOptions)

export default store

export const useStore = (): Store => {
  return baseUseStore(key)
}
