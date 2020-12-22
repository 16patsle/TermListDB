import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import Vue from 'vue'

import database from './utils/firebase'

import type firebase from 'firebase/app'
import type { TermQueryType } from './types/TermQueryType'
import type { TermType } from './types/TermType'
import type { SearchType } from './types/SearchType'

@Module({ name: 'storeModule' })
export default class StoreModule extends VuexModule {
  terms: {
    [key: string]: TermType
  } = {
    0: { _id: '', date: '' },
  }

  imports: {
    imported: number
    total: number
    finished: boolean
    cancel: boolean
  } = {
    imported: 0,
    total: 0,
    finished: true,
    cancel: false,
  }

  auth: {
    authenticated: boolean
    user?: firebase.User
  } = {
    authenticated: false,
    user: undefined,
  }

  totalRows = 0

  @Mutation
  removeMutation(term: TermType): void {
    Vue.delete(this.terms, term._id)
    this.totalRows++
  }

  @Action
  async remove(term: TermType): Promise<void> {
    try {
      await database.remove(term._id)
      this.context.commit('removeMutation', term)
    } catch (e) {
      console.error('Error:', e, term)
    }
  }

  @Mutation
  addMutation(term: TermType): void {
    if (!this.terms[term._id]) {
      Vue.set(this.terms, term._id, term)
      this.totalRows++
    } else {
      console.error('Already exists!', term)
    }
  }

  @Action
  async add(term: TermType): Promise<void> {
    try {
      await database.add(term)
      this.context.commit('addMutation', term)
    } catch (e) {
      console.error('Error:', e, term)
    }
  }

  @Mutation
  saveMutation(term: TermType): void {
    if (this.terms[term._id]) {
      if (term._deleted) {
        // TODO: Is this still used?
        Vue.delete(this.terms, term._id)
      } else {
        Vue.set(this.terms, term._id, term)
      }
    } else {
      console.error('Could not save! Term might not exist!', term)
    }
  }

  @Action
  async save(term: TermType): Promise<void> {
    try {
      if (this.terms[term._id] !== term) {
        await database.save(term)
        this.context.commit('saveMutation', term)
      } else {
        throw 'Term not changed!'
      }
    } catch (e) {
      console.error('Error:', e, term)
    }
  }

  @Mutation
  prepareImport(imports: number): void {
    this.imports.total = imports
    this.imports.imported = 0
    this.imports.finished = false
    this.imports.cancel = false
  }

  @Mutation
  importTermsMutation(term: TermType): void {
    if (!this.terms[term._id]) {
      Vue.set(this.terms, term._id, term)
      this.imports.imported += 1
      if (this.imports.imported === this.imports.total) {
        this.imports.finished = true
      }
    } else {
      console.error('Already exists!', term)
    }
  }

  @Action
  async importTerms(term: TermType): Promise<void> {
    try {
      if (this.imports.cancel === false) {
        await database.add(term)
        this.context.commit('importTermsMutation', term)
      }
    } catch (e) {
      console.error('Error:', e, term)
    }
  }

  @Mutation
  cancelImport(): void {
    this.imports.finished = true
    this.imports.cancel = true
  }

  @Action
  async exportTerms(): Promise<TermType[]> {
    try {
      return database.getTerms({ limit: undefined })
    } catch (e) {
      console.error('Error:', e)
    }
    return []
  }

  @Mutation
  getTermsMutation(
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

    this.terms = termsObject
  }

  @Action
  async getTerms(data: TermQueryType): Promise<void> {
    try {
      this.context.commit('getTermsMutation', {
        terms: await database.getTerms(data),
        ...data,
      })
    } catch (e) {
      console.error('Error:', e, data)
    }
  }

  @Mutation
  findMutation(terms: TermType[]): void {
    const termsObject: {
      [key: string]: TermType
    } = {}

    terms.forEach(term => {
      termsObject[term._id] = term
    })
    this.terms = termsObject
  }

  @Action
  async find(search: SearchType): Promise<void> {
    try {
      this.context.commit('findMutation', await database.find(search))
    } catch (e) {
      console.error('Error:', e, search)
    }
  }

  @Mutation
  setTotal(size: number): void {
    this.totalRows = size
  }

  @Action
  async fetchTotal(): Promise<void> {
    try {
      this.context.commit('setTotal', await database.getTotalTerms())
    } catch (e) {
      console.error('Error:', e)
    }
  }

  @Mutation
  setAuthenticated(user: firebase.User | null): void {
    console.log('Auth update')
    if (user) {
      this.auth.authenticated = true
      database.connect(user)
      this.auth.user
    } else {
      this.auth.authenticated = false
      this.auth.user = undefined
    }
  }
}
