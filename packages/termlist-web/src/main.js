import 'babel-polyfill';
import deepmerge from 'deepmerge';
import Vue from 'vue';
import PouchDB from 'pouchdb';
import VuePouchDB from 'vue-pouch-db';
import Vuex from 'vuex';
import Bulma from 'bulma';
import FontAwesome from 'font-awesome/css/font-awesome.css';
import App from './App.vue';

import bucket from './bucket';

Vue.use(VuePouchDB);
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    terms: {
      '0': {}
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
    },
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
    async getTerms({
      commit
    }, data) {
      try {
        await bucket.createIndex(await bucket.db('termlist')
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

new Vue({
  el: '#app',
  bucket,
  store,
  render: h => h(App)
})
/*
window.onload = function(){
  bucket.db('termlist').bulkDocs(Trello).then((response)=>console.log(response))
};
*/
