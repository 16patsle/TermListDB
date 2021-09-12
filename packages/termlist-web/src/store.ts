import {
  CommitOptions,
  createStore,
  DispatchOptions,
  SubscribeOptions,
  useStore as baseUseStore,
} from 'vuex'
import type { InjectionKey } from 'vue'
import type { Store as VuexStore, StoreOptions } from 'vuex'

import {
  TermActions,
  TermGetters,
  TermMutations,
  termsModule,
} from './modules/termsModule'
import {
  ImportActions,
  ImportMutations,
  importModule,
} from './modules/importModule'
import { AuthMutations, authModule } from './modules/authModule'
import { globalService } from './machines/globalService'

import type { StateType } from './types/StateType'

export type Mutations = TermMutations & ImportMutations & AuthMutations
export type Actions = TermActions & ImportActions
type Getters = TermGetters & {
  loading(state: StateType): boolean
  authenticated(): boolean
}

export type Store = Omit<
  VuexStore<StateType>,
  'getters' | 'commit' | 'dispatch' | 'subscribe'
> & {
  commit<K extends keyof Mutations, P extends Parameters<Mutations[K]>[1]>(
    key: K,
    payload?: P,
    options?: CommitOptions
  ): ReturnType<Mutations[K]>
  dispatch<K extends keyof Actions>(
    key: K,
    payload?: Parameters<Actions[K]>[1],
    options?: DispatchOptions
  ): ReturnType<Actions[K]>
  getters: {
    [K in keyof Getters]: ReturnType<Getters[K]>
  }
  subscribe<K extends keyof Mutations, P extends Parameters<Mutations[K]>[1]>(
    fn: (mutation: { type: K; payload: P }, state: StateType) => void,
    options?: SubscribeOptions
  ): () => void
}

const storeOptions: StoreOptions<StateType> = {
  modules: {
    terms: termsModule,
    import: importModule,
    auth: authModule,
  },
  getters: {
    loading(): boolean {
      return globalService.state.value === 'loading'
    },
    authenticated(): boolean {
      return globalService.state.value !== 'authenticating'
    },
  },
}

export const key: InjectionKey<Store> = Symbol()

export const store: Store = createStore<StateType>(storeOptions)

export default store

export const useStore = (): Store => {
  return baseUseStore(key)
}
