import 'babel-polyfill';
import deepmerge from 'deepmerge';
import Vue from 'vue';
import Vuex from 'vuex';
import Bulma from 'bulma';
import FontAwesome from 'font-awesome/css/font-awesome.css';
import App from './App.vue';

import TermDatabase from './bucket';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    terms: {
      '0': {}
    },
    imports: {
      imported:0,
      total:0,
      finished: true,
      cancel: false
    }
  },
  mutations: {
    remove(state, term) {
      Vue.delete(state.terms, term._id);
    },
    add(state, term) {
      if (!state.terms[term._id]) {
        Vue.set(state.terms, term._id, term);
      } else {
        console.error('Already exists!', term);
      }
    },
    save(state, term) {
      if (state.terms[term._id]) {
        Vue.set(state.terms, term._id, term);
      } else if (term._deleted && state.terms[term._id]) {
        Vue.delete(state.terms, term._id);
      } else {
        console.error('Could not save! Term might not exist!', term);
      }
    },
    prepareImport(state, imports) {
      state.imports.total = imports;
      state.imports.imported = 0;
      state.imports.finished = false;
      state.imports.cancel = false;
    },
    importTerms(state, term) {
      if (!state.terms[term._id]) {
        Vue.set(state.terms, term._id, term);
        state.imports.imported += 1;
        if(state.imports.imported === state.imports.total){
          state.imports.finished = true;
        }
      } else {
        console.error('Already exists!', term);
      }
    },
    cancelImport(state){
      state.imports.finished = true;
      state.imports.cancel = true;
    },
    getTerms(state, terms) {
      let termsObject = {};
      let designRegex = /^_design\//;

      terms.docs.forEach(term => {
        if (!designRegex.test(term._id)) {
          termsObject[term._id] = term
        }
      })

      state.terms = termsObject;
    },
    find(state, terms) {
      let termsObject = {};
      let designRegex = /^_design\//;
      terms.docs.forEach(term => {
        if (!designRegex.test(term._id)) {
          termsObject[term._id] = term
        }
      })
      state.terms = termsObject;
    },
    getTotal(state, total) {
      state.totalRows = total.total_rows;
    }
  },
  actions: {
    async remove({
      commit
    }, term) {
      try {
        await bucket.remove(term._id);
        commit('remove', term);
      } catch (e) {
        console.error('Error:', e, term);
      }
    },
    async add({
      commit
    }, term) {
      try {
        await bucket.add(term);
        commit('add', term);
      } catch (e) {
        console.error('Error:', e, term);
      }
    },
    async save({
      commit,
      state
    }, term) {
      try {
        if (state.terms[term._id] !== term) {
          await bucket.save(term);
          commit('save', term);
        } else {
          throw 'Term not changed!'
        }
      } catch (e) {
        console.error('Error:', e, term);
      }
    },
    async importTerms({
      commit,
      state
    }, term) {
      try {
        if(state.imports.cancel === false){
          await bucket.add(term);
          commit('importTerms', term);
        }
      } catch (e) {
        console.error('Error:', e, term);
      }
    },
    async exportTerms({
      commit
    }) {
      try {
        return await bucket.getTerms({limit:null});
      } catch (e) {
        console.error('Error:', e);
      }
    },
    async getTerms({
      commit
    }, data) {
      try {
        await bucket.createIndex(await bucket.db
          .getIndexes(), data);
        commit('getTerms', await bucket.getTerms(data));
      } catch (e) {
        console.error('Error:', e, data);
      }
    },
    async find({
      commit
    }, search) {
      try {
        let searchResults = []
        for (let result of bucket.find(search)) {
          searchResults.push(await result)
        }

        let resultObject = deepmerge.all(searchResults)

        commit('find', resultObject);
      } catch (e) {
        console.error('Error:', e, search);
      }
    },
    async getTotal({
      commit
    }) {
      try {
        commit('getTotal', await bucket.getTotal());
      } catch (e) {
        console.error('Error:', e);
      }
    },
  }
})

const bucket = new TermDatabase(store);

new Vue({
  el: '#app',
  bucket,
  store,
  render: h => h(App)
})
/*
window.onload = function(){
  bucket.db.bulkDocs(Trello).then((response)=>console.log(response))
};
*/
