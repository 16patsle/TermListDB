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
  askingForConfirmation: boolean
}

export type Mutations = {
  prepare(state: State, imports: number): void
  import(state: State): void
  cancel(state: State): void
  askingForConfirmation(state: State): void
}

export const mutations: MutationTree<State> & Mutations = {
  prepare(state: State, imports: number): void {
    state.total = imports
    state.imported = 0
    state.finished = false
    state.cancel = false
    state.askingForConfirmation = false
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
    state.askingForConfirmation = false
  },

  askingForConfirmation(state: State): void {
    state.askingForConfirmation = true
  },
}

type Context = AugmentedActionContext<Mutations, Actions, State>

export type Actions = {
  import({ state, commit }: Context, terms: TermType[]): Promise<void>
  export(): Promise<TermType[]>
}

export const actions: ActionTree<State, StateType> & Actions = {
  async import({ state, commit, dispatch }, terms: TermType[]): Promise<void> {
    try {
      commit('prepare', terms.length)

      const imports = []

      for (const term of terms) {
        if (state.cancel === false) {
          imports.push(
            (async () => {
              const added = await dispatch(
                'terms/add',
                Object.assign(
                  {
                    _id: term.date,
                  },
                  term
                ),
                { root: true }
              )
              if (added) {
                commit('import')
              }
            })()
          )
        }
      }

      await Promise.all(imports)
    } catch (e) {
      console.error('Error:', e, terms)
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
    askingForConfirmation: false,
  }),
  mutations,
  actions,
}
