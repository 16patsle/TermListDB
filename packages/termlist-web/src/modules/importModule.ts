import database from '../utils/firebase'

import type { ActionTree, Module, MutationTree } from 'vuex'
import type { TermType } from '../types/TermType'
import type { StateType } from '../types/StateType'
import type { AugmentedActionContext } from '../types/AugmentedActionContext'
import type { Namespaced } from '../types/Namespaced'

export type State = {
  imported: number
  total: number
  finished: boolean
  cancel: boolean
}

export type Mutations = {
  prepare(state: State, imports: number): void
  import(state: State): void
  cancel(state: State): void
}

export const mutations: MutationTree<State> & Mutations = {
  prepare(state: State, imports: number): void {
    state.total = imports
    state.imported = 0
    state.finished = false
    state.cancel = false
  },

  import(state: State): void {
    state.imported += 1
    if (state.imported === state.total) {
      state.finished = true
    }
  },

  cancel(state: State): void {
    state.finished = true
    state.cancel = true
  },
}

type Context = AugmentedActionContext<Mutations, Actions, State>

export type Actions = {
  import({ state, commit }: Context, term: TermType): Promise<void>
  export(): Promise<TermType[]>
}

export const actions: ActionTree<State, StateType> & Actions = {
  async import({ state, commit, dispatch }, term: TermType): Promise<void> {
    try {
      if (state.cancel === false) {
        const added = await dispatch('terms/add', term, { root: true })
        if (added) {
          commit('import')
        }
      }
    } catch (e) {
      console.error('Error:', e, term)
    }
  },
  async export(): Promise<TermType[]> {
    try {
      return database.getTerms({ limit: undefined })
    } catch (e) {
      console.error('Error:', e)
    }
    return []
  },
}

export type ImportMutations = Namespaced<Mutations, 'import'>
export type ImportActions = Namespaced<Actions, 'import'>

export const importModule: Module<State, StateType> = {
  namespaced: true,
  state: (): State => ({
    imported: 0,
    total: 0,
    finished: true,
    cancel: false,
  }),
  mutations,
  actions,
}
