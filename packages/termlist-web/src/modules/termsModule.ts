import database from '../utils/firebase'
import { globalService } from '../machines/globalService'

import type { ActionTree, GetterTree, Module, MutationTree } from 'vuex'
import type { TermQueryType } from '../types/TermQueryType'
import type { TermType } from '../types/TermType'
import type { StateType } from '../types/StateType'
import type { AugmentedActionContext } from '../types/AugmentedActionContext'
import type { Namespaced } from '../types/Namespaced'
import type { FieldNameType } from '../types/FieldNameType'

export type State = {
  terms: Map<string, TermType>
  totalRows: number
  sortedBy: FieldNameType
  currentPage: number
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
  setSortedBy(state: State, sortedBy: FieldNameType): void
  setCurrentPage(state: State, page: number): void
}

export const mutations: MutationTree<State> & Mutations = {
  remove(state, term) {
    state.terms.delete(term._id)
    state.totalRows--
  },

  add(state, term) {
    if (!state.terms.has(term._id)) {
      state.terms.set(term._id, term)
      state.totalRows++
      return true
    } else {
      console.error('Already exists!', term)
      return false
    }
  },

  save(state, term) {
    if (state.terms.has(term._id)) {
      if (term._deleted) {
        // TODO: Is this still used?
        state.terms.delete(term._id)
      } else {
        state.terms.set(term._id, term)
      }
    } else {
      console.error('Could not save! Term might not exist!', term)
    }
  },

  getTerms(state, data) {
    const termsObject = new Map<string, TermType>()
    let terms = data.terms

    if (data.showLimit) {
      // Return last x elements
      terms = terms.slice(Math.max(terms.length - data.showLimit, 0))
    }

    terms.forEach(term => termsObject.set(term._id, term))
    state.terms = termsObject
  },

  setTotal(state, size) {
    state.totalRows = size
  },

  setSortedBy(state, sortedBy) {
    state.sortedBy = sortedBy
  },

  setCurrentPage(state, page) {
    state.currentPage = page
  },
}

type Context = AugmentedActionContext<Mutations, Actions, State>

export type Actions = {
  remove(c: Context, term: TermType): Promise<void>
  add(c: Context, term: TermType): Promise<boolean>
  save(c: Context, term: TermType): Promise<void>
  getTerms(c: Context, data: TermQueryType): Promise<void>
  fetchTotal(c: Context): Promise<void>
  gotoPage(
    c: Context,
    data: { pageNumber: number; currentPage: number }
  ): Promise<void>
  search(c: Context, search: string): Promise<void>
  sort(c: Context, field?: FieldNameType): Promise<void>
}

export const actions: ActionTree<State, StateType> & Actions = {
  async remove({ commit }, term) {
    try {
      await database.remove(term._id)
      commit('remove', term)
      globalService.send('REMOVE')
    } catch (e) {
      console.error('Error:', e, term)
    }
  },
  async add({ state, commit, dispatch }, term) {
    try {
      term._charSlices = term.term
        ? [term.term.substr(0, 1), term.term.substr(0, 3)]
        : []

      await database.add(term)
      const success = commit('add', term)
      if (success) {
        // Reload from first page
        await dispatch('getTerms', {
          field: state.sortedBy,
        })
      }
      globalService.send('SAVE')
      return success
    } catch (e) {
      console.error('Error:', e, term)
      return false
    }
  },
  async save({ state, commit }, term) {
    try {
      if (state.terms.get(term._id) !== term) {
        term._charSlices = term.term
          ? [term.term.substr(0, 1), term.term.substr(0, 3)]
          : []

        await database.save(term)
        commit('save', term)
        globalService.send('SAVE')
      } else {
        throw 'Term not changed!'
      }
    } catch (e) {
      console.error('Error:', e, term)
    }
  },
  async getTerms({ commit }, data) {
    try {
      commit('getTerms', {
        terms: await database.getTerms(data),
        ...data,
      })
    } catch (e) {
      console.error('Error:', e, data)
    }
  },
  async fetchTotal({ commit }) {
    try {
      commit('setTotal', await database.getTotalTerms())
    } catch (e) {
      console.error('Error:', e)
    }
  },
  async gotoPage({ state, commit, dispatch }, { pageNumber, currentPage }) {
    const terms = state.terms
    const pageNumberOffset = pageNumber - currentPage
    const isBefore = pageNumber < currentPage
    const sortedBy = state.sortedBy

    globalService.send('LOAD_START')

    if (Math.abs(pageNumberOffset) === 1) {
      if (isBefore) {
        await dispatch('getTerms', {
          field: sortedBy,
          endBefore: Array.from(terms.entries())[0][1][sortedBy],
        })
      } else {
        await dispatch('getTerms', {
          field: sortedBy,
          startAfter: Array.from(terms.entries())[terms.size - 1][1][sortedBy],
        })
      }
    } else {
      if (isBefore) {
        const limit = pageNumber * 20

        await dispatch('getTerms', {
          field: sortedBy,
          limit,
          showLimit: 20,
        })
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
          startAfter: Array.from(terms.entries())[terms.size - 1][1][sortedBy],
          limit,
          showLimit,
        })
      }
    }

    globalService.send('LOAD_COMPLETE')
    commit('setCurrentPage', pageNumber)
  },
  async search({ state, dispatch }, search) {
    globalService.send('LOAD_START')

    await dispatch('getTerms', {
      field: state.sortedBy,
      search,
    })

    globalService.send('LOAD_COMPLETE')
  },
  async sort({ commit, dispatch }, field) {
    globalService.send('LOAD_START')
    await dispatch('getTerms', { field })
    globalService.send('LOAD_COMPLETE')
    commit('setSortedBy', field)
    commit('setCurrentPage', 1)
  },
}

export type Getters = {
  loading(state: State, getters: unknown, rootState: StateType): boolean
}

export const getters: GetterTree<State, StateType> & Getters = {
  loading(): boolean {
    return globalService.state.value === 'loading'
  },
}

export type TermMutations = Namespaced<Mutations, 'terms'>
export type TermActions = Namespaced<Actions, 'terms'>
export type TermGetters = Namespaced<Getters, 'terms'>

export const termsModule: Module<State, StateType> = {
  namespaced: true,
  state: (): State => ({
    terms: new Map(),
    totalRows: 0,
    sortedBy: 'term',
    currentPage: 1,
  }),
  mutations,
  actions,
  getters,
}
