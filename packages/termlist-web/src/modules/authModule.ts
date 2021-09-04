import database from '../utils/firebase'
import { log } from '../utils/log'

import type { Module, MutationTree } from 'vuex'
import type firebase from 'firebase/app'
import type { StateType } from '../types/StateType'
import type { Namespaced } from '../types/Namespaced'

export type State = {
  authenticated: boolean
  user?: firebase.User
}

export type Mutations = {
  setAuthenticated(state: State, user: firebase.User | null): void
}

export const mutations: MutationTree<State> & Mutations = {
  setAuthenticated(state, user) {
    log('Auth update')
    if (user) {
      state.authenticated = true
      database.connect(user)
      state.user = user
    } else {
      state.authenticated = false
      state.user = undefined
    }
  },
}

export type AuthMutations = Namespaced<Mutations, 'auth'>

export const authModule: Module<State, StateType> = {
  namespaced: true,
  state: (): State => ({
    authenticated: false,
    user: undefined,
  }),
  mutations,
}
