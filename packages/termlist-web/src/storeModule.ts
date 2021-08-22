import database from './utils/firebase'

import type {
  ActionContext,
  ActionTree,
  GetterTree,
  Module,
  MutationTree,
} from 'vuex'
import type firebase from 'firebase/app'
import type { TermQueryType } from './types/TermQueryType'
import type { TermType } from './types/TermType'
import { StateType } from './types/StateType'

export type State = {
  terms: {
    [key: string]: TermType
  }

  imports: {
    imported: number
    total: number
    finished: boolean
    cancel: boolean
  }

  auth: {
    authenticated: boolean
    user?: firebase.User
  }

  totalRows: number
}

export type Mutations = {
  removeMutation(state: State, term: TermType): void
  addMutation(state: State, term: TermType): void
  saveMutation(state: State, term: TermType): void
  prepareImport(state: State, imports: number): void
  importTermsMutation(state: State, term: TermType): void
  cancelImport(state: State): void
  getTermsMutation(
    state: State,
    data: TermQueryType & {
      terms: TermType[]
    }
  ): void
  setTotal(state: State, size: number): void
  setAuthenticated(state: State, user: firebase.User | null): void
}

export const mutations: MutationTree<State> & Mutations = {
  removeMutation(state: State, term: TermType): void {
    state.terms[term._id]
    state.totalRows++
  },

  addMutation(state: State, term: TermType): void {
    if (!state.terms[term._id]) {
      state.terms[term._id] = term
      state.totalRows++
    } else {
      console.error('Already exists!', term)
    }
  },

  saveMutation(state: State, term: TermType): void {
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

  prepareImport(state: State, imports: number): void {
    state.imports.total = imports
    state.imports.imported = 0
    state.imports.finished = false
    state.imports.cancel = false
  },

  importTermsMutation(state: State, term: TermType): void {
    if (!state.terms[term._id]) {
      state.terms[term._id] = term
      state.imports.imported += 1
      if (state.imports.imported === state.imports.total) {
        state.imports.finished = true
      }
    } else {
      console.error('Already exists!', term)
    }
  },

  cancelImport(state: State): void {
    state.imports.finished = true
    state.imports.cancel = true
  },

  getTermsMutation(
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

  setAuthenticated(state: State, user: firebase.User | null): void {
    console.log('Auth update')
    if (user) {
      state.auth.authenticated = true
      database.connect(user)
      state.auth.user = user
    } else {
      state.auth.authenticated = false
      state.auth.user = undefined
    }
  },
}

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>
} & Omit<ActionContext<State, StateType>, 'commit'>

export type Actions = {
  remove({ commit }: AugmentedActionContext, term: TermType): Promise<void>
  add({ commit }: AugmentedActionContext, term: TermType): Promise<void>
  save({ state, commit }: AugmentedActionContext, term: TermType): Promise<void>
  importTerms(
    { state, commit }: AugmentedActionContext,
    term: TermType
  ): Promise<void>
  exportTerms(): Promise<TermType[]>
  getTerms(
    { commit }: AugmentedActionContext,
    data: TermQueryType
  ): Promise<void>
  fetchTotal({ commit }: AugmentedActionContext): Promise<void>
}

export const actions: ActionTree<State, StateType> & Actions = {
  async remove({ commit }, term: TermType): Promise<void> {
    try {
      await database.remove(term._id)
      commit('removeMutation', term)
    } catch (e) {
      console.error('Error:', e, term)
    }
  },
  async add({ commit }, term: TermType): Promise<void> {
    try {
      term._charSlices = term.term
        ? [term.term.substr(0, 1), term.term.substr(0, 3)]
        : []

      await database.add(term)
      commit('addMutation', term)
    } catch (e) {
      console.error('Error:', e, term)
    }
  },
  async save({ state, commit }, term: TermType): Promise<void> {
    try {
      if (state.terms[term._id] !== term) {
        term._charSlices = term.term
          ? [term.term.substr(0, 1), term.term.substr(0, 3)]
          : []

        await database.save(term)
        commit('saveMutation', term)
      } else {
        throw 'Term not changed!'
      }
    } catch (e) {
      console.error('Error:', e, term)
    }
  },
  async importTerms({ state, commit }, term: TermType): Promise<void> {
    try {
      if (state.imports.cancel === false) {
        await database.add(term)
        commit('importTermsMutation', term)
      }
    } catch (e) {
      console.error('Error:', e, term)
    }
  },
  async exportTerms(): Promise<TermType[]> {
    try {
      return database.getTerms({ limit: undefined })
    } catch (e) {
      console.error('Error:', e)
    }
    return []
  },
  async getTerms({ commit }, data: TermQueryType): Promise<void> {
    try {
      commit('getTermsMutation', {
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

export const storeModule: Module<State, StateType> = {
  namespaced: true,
  state: (): State => ({
    terms: {
      0: { _id: '', date: '' },
    },

    imports: {
      imported: 0,
      total: 0,
      finished: true,
      cancel: false,
    },

    auth: {
      authenticated: false,
      user: undefined,
    },

    totalRows: 0,
  }),
  mutations,
  actions,
  getters,
}
