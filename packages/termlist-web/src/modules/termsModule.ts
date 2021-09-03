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
  terms: {
    [key: string]: TermType
  }

  totalRows: number
  askingForRemoveConfirmation: boolean
  currentRemove?: TermType
  currentlyEditing: boolean
  currentTerm?: TermType
  sortedBy: FieldNameType
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
  setSortedBy(state: State, sortedBy: FieldNameType): void
}

export const mutations: MutationTree<State> & Mutations = {
  remove(state, term) {
    delete state.terms[term._id]
    state.totalRows--
    state.askingForRemoveConfirmation = false
    state.currentRemove = undefined
  },

  add(state, term) {
    if (!state.terms[term._id]) {
      state.terms[term._id] = term
      state.totalRows++
      state.currentlyEditing = false
      state.currentTerm = undefined
      return true
    } else {
      console.error('Already exists!', term)
      return false
    }
  },

  save(state, term) {
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

  getTerms(state, data) {
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

  setTotal(state, size) {
    state.totalRows = size
  },

  askingForRemoveConfirmation(state, term) {
    state.askingForRemoveConfirmation = true
    state.currentRemove = term
  },

  cancelRemove(state) {
    state.askingForRemoveConfirmation = false
    state.currentRemove = undefined
  },

  startEditing(state, term) {
    state.currentlyEditing = true
    state.currentTerm = term
  },

  cancelEditing(state) {
    state.currentlyEditing = false
    state.currentTerm = undefined
  },

  setSortedBy(state, sortedBy) {
    state.sortedBy = sortedBy
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
      return success
    } catch (e) {
      console.error('Error:', e, term)
      return false
    }
  },
  async save({ state, commit }, term) {
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
  async gotoPage({ state, dispatch }, { pageNumber, currentPage }) {
    const terms = state.terms
    const pageNumberOffset = pageNumber - currentPage
    const isBefore = pageNumber < currentPage
    const sortedBy = state.sortedBy

    globalService.send('LOAD_START')

    if (Math.abs(pageNumberOffset) === 1) {
      if (isBefore) {
        await dispatch('getTerms', {
          field: sortedBy,
          endBefore: Object.entries(terms)[0][1][sortedBy],
        })

        globalService.send('LOAD_COMPLETE')
      } else {
        await dispatch('getTerms', {
          field: sortedBy,
          startAfter:
            Object.entries(terms)[Object.keys(terms).length - 1][1][sortedBy],
        })

        globalService.send('LOAD_COMPLETE')
      }
    } else {
      if (isBefore) {
        const limit = pageNumber * 20

        await dispatch('getTerms', {
          field: sortedBy,
          limit,
          showLimit: 20,
        })

        globalService.send('LOAD_COMPLETE')
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

        globalService.send('LOAD_COMPLETE')
      }
    }
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
    terms: {
      0: { _id: '', date: '' },
    },

    totalRows: 0,
    askingForRemoveConfirmation: false,
    currentRemove: undefined,
    currentlyEditing: false,
    currentTerm: undefined,
    sortedBy: 'term',
  }),
  mutations,
  actions,
  getters,
}
