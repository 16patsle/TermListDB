import database from '../utils/firebase'

import type { ActionTree, GetterTree, Module, MutationTree } from 'vuex'
import type { TermQueryType } from '../types/TermQueryType'
import type { TermType } from '../types/TermType'
import type { StateType } from '../types/StateType'
import type { AugmentedActionContext } from '../types/AugmentedActionContext'
import type { Namespaced } from '../types/Namespaced'
import type { FieldNameType } from '../types/FieldNameType'

export type State = {
  terms: {
    [key: string]: TermType
  }

  totalRows: number
  askingForRemoveConfirmation: boolean
  currentRemove?: TermType
  currentlyEditing: boolean
  currentTerm?: TermType
  termsAdded: number
  loading: boolean
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
  askingForRemoveConfirmation(state: State, term: TermType): void
  cancelRemove(state: State): void
  startEditing(state: State, term?: TermType): void
  cancelEditing(state: State): void
  setLoading(state: State, loading: boolean): void
}

export const mutations: MutationTree<State> & Mutations = {
  remove(state: State, term: TermType): void {
    delete state.terms[term._id]
    state.totalRows--
    state.askingForRemoveConfirmation = false
    state.currentRemove = undefined
  },

  add(state: State, term: TermType): boolean {
    if (!state.terms[term._id]) {
      state.terms[term._id] = term
      state.totalRows++
      state.termsAdded++
      state.currentlyEditing = false
      state.currentTerm = undefined
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
      state.currentlyEditing = false
      state.currentTerm = undefined
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

  askingForRemoveConfirmation(state: State, term: TermType): void {
    state.askingForRemoveConfirmation = true
    state.currentRemove = term
  },

  cancelRemove(state: State): void {
    state.askingForRemoveConfirmation = false
    state.currentRemove = undefined
  },

  startEditing(state: State, term?: TermType): void {
    state.currentlyEditing = true
    state.currentTerm = term
  },

  cancelEditing(state: State): void {
    state.currentlyEditing = false
    state.currentTerm = undefined
  },

  setLoading(state: State, loading: boolean): void {
    state.loading = loading
  },
}

type Context = AugmentedActionContext<Mutations, Actions, State>

export type Actions = {
  remove({ commit }: Context, term: TermType): Promise<void>
  add({ commit }: Context, term: TermType): Promise<boolean>
  save({ state, commit }: Context, term: TermType): Promise<void>
  getTerms({ commit }: Context, data: TermQueryType): Promise<void>
  fetchTotal({ commit }: Context): Promise<void>
  gotoPage(
    { state, commit, dispatch }: Context,
    data: { pageNumber: number; currentPage: number; sortedBy: FieldNameType }
  ): Promise<void>
  search({ commit }: Context, data: TermQueryType): Promise<void>
  sort({ commit }: Context, field: FieldNameType): Promise<void>
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
  async gotoPage(
    { state, commit, dispatch },
    { pageNumber, currentPage, sortedBy }
  ): Promise<void> {
    const terms = state.terms
    const pageNumberOffset = pageNumber - currentPage
    const isBefore = pageNumber < currentPage

    commit('setLoading', true)

    if (Math.abs(pageNumberOffset) === 1) {
      if (isBefore) {
        await dispatch('getTerms', {
          field: sortedBy,
          endBefore: Object.entries(terms)[0][1][sortedBy],
        })

        commit('setLoading', false)
      } else {
        await dispatch('getTerms', {
          field: sortedBy,
          startAfter:
            Object.entries(terms)[Object.keys(terms).length - 1][1][sortedBy],
        })

        commit('setLoading', false)
      }
    } else {
      if (isBefore) {
        const limit = pageNumber * 20

        await dispatch('getTerms', {
          field: sortedBy,
          limit,
          showLimit: 20,
        })

        commit('setLoading', false)
      } else {
        const termsLeft = state.totalRows - 20 * currentPage
        // Amount of terms on x pages
        const limit = termsLeft
        let showLimit = 20

        // If the amount of terms won't fill the last page completely,
        // find out how many are on the last page and add them instead
        if (termsLeft % 20 !== 0) {
          showLimit = termsLeft % 20
        }

        await dispatch('getTerms', {
          field: sortedBy,
          startAfter:
            Object.entries(terms)[Object.keys(terms).length - 1][1][sortedBy],
          limit,
          showLimit,
        })

        commit('setLoading', false)
      }
    }
  },
  async search({ commit, dispatch }, data): Promise<void> {
    commit('setLoading', true)

    await dispatch('getTerms', data)

    commit('setLoading', false)
  },
  async sort(
    { commit, dispatch }: Context,
    field: FieldNameType
  ): Promise<void> {
    commit('setLoading', true)
    await dispatch('getTerms', {
      field,
    })
    commit('setLoading', false)
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
    askingForRemoveConfirmation: false,
    currentRemove: undefined,
    currentlyEditing: false,
    currentTerm: undefined,
    termsAdded: 0,
    loading: true,
  }),
  mutations,
  actions,
  getters,
}
