import '@babel/polyfill'
import deepmerge from 'deepmerge'
import Vue from 'vue'
import Vuex from 'vuex'
import type { Store, StoreOptions } from 'vuex'
import './assets/main.scss'
import 'font-awesome/css/font-awesome.css'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'termlist-auth-ui/dist/firebaseui.css'
import App from './App.vue'

import TermDatabase from './database'
import type { StateType } from './types/StateType'
import type { TermQueryType } from './types/TermQueryType'
import type { TermType } from './types/TermType'
import type { SearchType } from './types/SearchType'

Vue.use(Vuex)

const storeOptions: StoreOptions<StateType> = {
  state: {
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
  },
  mutations: {
    remove(state, term: TermType) {
      Vue.delete(state.terms, term._id)
      state.totalRows++
    },
    add(state, term: TermType) {
      if (!state.terms[term._id]) {
        Vue.set(state.terms, term._id, term)
        state.totalRows++
      } else {
        console.error('Already exists!', term)
      }
    },
    save(state, term: TermType) {
      if (state.terms[term._id]) {
        Vue.set(state.terms, term._id, term)
      } else if (term._deleted && state.terms[term._id]) {
        Vue.delete(state.terms, term._id)
      } else {
        console.error('Could not save! Term might not exist!', term)
      }
    },
    prepareImport(state, imports: number) {
      state.imports.total = imports
      state.imports.imported = 0
      state.imports.finished = false
      state.imports.cancel = false
    },
    importTerms(state, term: TermType) {
      if (!state.terms[term._id]) {
        Vue.set(state.terms, term._id, term)
        state.imports.imported += 1
        if (state.imports.imported === state.imports.total) {
          state.imports.finished = true
        }
      } else {
        console.error('Already exists!', term)
      }
    },
    cancelImport(state) {
      state.imports.finished = true
      state.imports.cancel = true
    },
    getTerms(
      state,
      data: TermQueryType & {
        terms: TermType[]
      }
    ) {
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
    find(state, terms: TermType[]) {
      const termsObject: {
        [key: string]: TermType
      } = {}

      terms.forEach(term => {
        termsObject[term._id] = term
      })
      state.terms = termsObject
    },
    setTotal(state, size: number) {
      state.totalRows = size
    },
    setAuthenticated(state, user: firebase.User | null) {
      console.log('Auth update')
      if (user) {
        state.auth.authenticated = true
        database.connect(user)
      } else {
        state.auth.authenticated = false
      }
      state.auth.user = user
    },
  },
  actions: {
    async remove({ commit }, term: TermType) {
      try {
        await database.remove(term._id)
        commit('remove', term)
      } catch (e) {
        console.error('Error:', e, term)
      }
    },
    async add({ commit }, term: TermType) {
      try {
        await database.add(term)
        commit('add', term)
      } catch (e) {
        console.error('Error:', e, term)
      }
    },
    async save({ commit, state }, term: TermType) {
      try {
        if (state.terms[term._id] !== term) {
          await database.save(term)
          commit('save', term)
        } else {
          throw 'Term not changed!'
        }
      } catch (e) {
        console.error('Error:', e, term)
      }
    },
    async importTerms({ commit, state }, term: TermType) {
      try {
        if (state.imports.cancel === false) {
          await database.add(term)
          commit('importTerms', term)
        }
      } catch (e) {
        console.error('Error:', e, term)
      }
    },
    async exportTerms() {
      try {
        return await database.getTerms({ limit: undefined })
      } catch (e) {
        console.error('Error:', e)
      }
    },
    async getTerms({ commit }, data: TermQueryType) {
      try {
        commit('getTerms', { terms: await database.getTerms(data), ...data })
      } catch (e) {
        console.error('Error:', e, data)
      }
    },
    async find({ commit }, search: SearchType) {
      try {
        commit('find', await database.find(search))
      } catch (e) {
        console.error('Error:', e, search)
      }
    },
    async fetchTotal({ commit }) {
      try {
        commit('setTotal', await database.getTotalTerms())
      } catch (e) {
        console.error('Error:', e)
      }
    },
  },
}

const store: Store<StateType> = new Vuex.Store(storeOptions)

/* global process */
firebase.initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
})

const database = new TermDatabase(firebase.firestore())

const start = async () => {
  await database.start()

  new Vue({
    el: '#app',
    created() {
      firebase.auth().onAuthStateChanged(user => {
        store.commit('setAuthenticated', user)
        database.userInfoReference.onSnapshot(doc => {
          this.$store.commit('setTotal', doc.data().termlists_total)
        })
      })
    },
    //database,
    store,
    render: h => h(App),
  })
}
start()
