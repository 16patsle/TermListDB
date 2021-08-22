import database from '../utils/firebase'

import type { ActionTree, GetterTree, Module, MutationTree } from 'vuex'
import type { TermQueryType } from '../types/TermQueryType'
import type { TermType } from '../types/TermType'
import type { StateType } from '../types/StateType'
import type { AugmentedActionContext } from '../types/AugmentedActionContext'
import type { Namespaced } from '../types/Namespaced'

export type State = {
  terms: {
    [key: string]: TermType
  }

  totalRows: number
}

export type Mutations = {
  remove(state: State, term: TermType): void
  add(state: State, term: TermType): boolean
  save(state: State, term: TermType): void
  getTerms(
    state: State,
    data: TermQueryType & {
      terms: TermType[]
    }
  ): void
  setTotal(state: State, size: number): void
}

export const mutations: MutationTree<State> & Mutations = {
  remove(state: State, term: TermType): void {
    state.terms[term._id]
    state.totalRows++
  },

  add(state: State, term: TermType): boolean {
    if (!state.terms[term._id]) {
      state.terms[term._id] = term
      state.totalRows++
      return true
    } else {
      console.error('Already exists!', term)
      return false
    }
  },

  save(state: State, term: TermType): void {
    if (state.terms[term._id]) {
      if (term._deleted) {
        // TODO: Is this still used?
        delete state.terms[term._id]
      } else {
        state.terms[term._id] = term
      }
    } else {
      console.error('Could not save! Term might not exist!', term)
    }
  },

  getTerms(
    state: State,
    data: TermQueryType & {
      terms: TermType[]
    }
  ): void {
    const termsObject: {
      [key: string]: TermType
    } = {}

    let terms = data.terms

    if (data.showLimit) {
      // Return last x elements
      terms = terms.slice(Math.max(terms.length - data.showLimit, 0))
    }

    terms.forEach(term => (termsObject[term._id] = term))

    state.terms = termsObject
  },

  setTotal(state: State, size: number): void {
    state.totalRows = size
  },
}

type Context = AugmentedActionContext<Mutations, Actions, State>

export type Actions = {
  remove({ commit }: Context, term: TermType): Promise<void>
  add({ commit }: Context, term: TermType): Promise<boolean>
  save({ state, commit }: Context, term: TermType): Promise<void>
  getTerms({ commit }: Context, data: TermQueryType): Promise<void>
  fetchTotal({ commit }: Context): Promise<void>
}

export const actions: ActionTree<State, StateType> & Actions = {
  async remove({ commit }, term: TermType): Promise<void> {
    try {
      await database.remove(term._id)
      commit('remove', term)
    } catch (e) {
      console.error('Error:', e, term)
    }
  },
  async add({ commit }, term: TermType): Promise<boolean> {
    try {
      term._charSlices = term.term
        ? [term.term.substr(0, 1), term.term.substr(0, 3)]
        : []

      await database.add(term)
      return commit('add', term)
    } catch (e) {
      console.error('Error:', e, term)
      return false
    }
  },
  async save({ state, commit }, term: TermType): Promise<void> {
    try {
      if (state.terms[term._id] !== term) {
        term._charSlices = term.term
          ? [term.term.substr(0, 1), term.term.substr(0, 3)]
          : []

        await database.save(term)
        commit('save', term)
      } else {
        throw 'Term not changed!'
      }
    } catch (e) {
      console.error('Error:', e, term)
    }
  },
  async getTerms({ commit }, data: TermQueryType): Promise<void> {
    try {
      commit('getTerms', {
        terms: await database.getTerms(data),
        ...data,
      })
    } catch (e) {
      console.error('Error:', e, data)
    }
  },
  async fetchTotal({ commit }): Promise<void> {
    try {
      commit('setTotal', await database.getTotalTerms())
    } catch (e) {
      console.error('Error:', e)
    }
  },
}

export type Getters = {}

export const getters: GetterTree<State, StateType> & Getters = {}

export type TermMutations = Namespaced<Mutations, 'terms'>
export type TermActions = Namespaced<Actions, 'terms'>
export type TermGetters = Namespaced<Getters, 'terms'>

export const termsModule: Module<State, StateType> = {
  namespaced: true,
  state: (): State => ({
    terms: {
      0: { _id: '', date: '' },
    },

    totalRows: 0,
  }),
  mutations,
  actions,
  getters,
}
