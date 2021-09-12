import database from '../utils/firebase'
import { log } from '../utils/log'

import type { Module, MutationTree } from 'vuex'
import type { User } from 'firebase/auth'
import type { StateType } from '../types/StateType'
import type { Namespaced } from '../types/Namespaced'
import { globalService } from '../machines/globalService'

export type State = {
  user?: User
}

export type Mutations = {
  setAuthenticated(state: State, user: User | null): void
}

export const mutations: MutationTree<State> & Mutations = {
  setAuthenticated(state, user) {
    log('Auth update')
    if (user) {
      database.connect(user)
      state.user = user
      globalService.send('LOG_IN')
    } else {
      state.user = undefined
      globalService.send('LOG_OUT')
    }
  },
}

export type AuthMutations = Namespaced<Mutations, 'auth'>

export const authModule: Module<State, StateType> = {
  namespaced: true,
  state: (): State => ({
    user: undefined,
  }),
  mutations,
}
