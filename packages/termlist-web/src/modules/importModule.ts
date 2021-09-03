import database from '../utils/firebase'
import { globalService } from '../machines/globalService'

import type { ActionTree, Module, MutationTree } from 'vuex'
import type { TermType } from '../types/TermType'
import type { StateType } from '../types/StateType'
import type { AugmentedActionContext } from '../types/AugmentedActionContext'
import type { Namespaced } from '../types/Namespaced'

export type State = {
  imported: number
  total: number
}

export type Mutations = {
  prepare(state: State, imports: number): void
  import(state: State): void
}

export const mutations: MutationTree<State> & Mutations = {
  prepare(state, imports) {
    state.total = imports
    state.imported = 0
  },

  import(state) {
    state.imported += 1
    if (state.imported === state.total) {
      globalService.send('COMPLETE')
    }
  },
}

type Context = AugmentedActionContext<Mutations, Actions, State>

export type Actions = {
  import(c: Context, terms: TermType[]): Promise<void>
  export(c: Context): Promise<string | undefined>
}

export const actions: ActionTree<State, StateType> & Actions = {
  async import({ commit, dispatch }, terms) {
    try {
      commit('prepare', terms.length)

      const imports = []

      for (const term of terms) {
        if (globalService.state.value === 'importing') {
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
  async export() {
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

      return (
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
  }),
  mutations,
  actions,
}
