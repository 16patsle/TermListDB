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
  exportURI: string
  askingForImportConfirmation: boolean
  askingForExportConfirmation: boolean
}

export type Mutations = {
  askingForImportConfirmation(state: State): void
  prepare(state: State, imports: number): void
  import(state: State): void
  cancel(state: State): void
  askingForExportConfirmation(state: State): void
  export(state: State, uri: string): void
  cancelExport(state: State): void
}

export const mutations: MutationTree<State> & Mutations = {
  askingForImportConfirmation(state) {
    state.askingForImportConfirmation = true
  },

  prepare(state, imports) {
    state.total = imports
    state.imported = 0
    state.finished = false
    state.cancel = false
    state.askingForImportConfirmation = false
  },

  import(state) {
    state.imported += 1
    if (state.imported === state.total) {
      state.finished = true
    }
  },

  cancel(state) {
    state.finished = true
    state.cancel = true
    state.askingForImportConfirmation = false
  },

  askingForExportConfirmation(state) {
    state.askingForExportConfirmation = true
  },

  export(state, uri) {
    state.exportURI = uri
  },

  cancelExport(state) {
    state.askingForExportConfirmation = false
    state.exportURI = ''
  },
}

type Context = AugmentedActionContext<Mutations, Actions, State>

export type Actions = {
  import(c: Context, terms: TermType[]): Promise<void>
  export(c: Context): Promise<void>
}

export const actions: ActionTree<State, StateType> & Actions = {
  async import({ state, commit, dispatch }, terms) {
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
  async export({ commit }) {
    try {
      const exported = (await database.getTerms({ limit: undefined })).map(
        term => ({
          _id: term._id,
          term: term.term,
          desc: term.desc,
          date: term.date,
          type: term.type,
        })
      )

      commit(
        'export',
        'data:application/json;charset=utf-8, ' +
          encodeURIComponent(JSON.stringify(exported))
      )
    } catch (e) {
      console.error('Error:', e)
    }
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
    exportURI: '',
    askingForImportConfirmation: false,
    askingForExportConfirmation: false,
  }),
  mutations,
  actions,
}
