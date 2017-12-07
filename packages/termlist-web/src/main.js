import 'babel-polyfill';
import deepmerge from 'deepmerge';
import Vue from 'vue';
import PouchDB from 'pouchdb';
//import List from 'list.js'
import VuePouchDB from 'vue-pouch-db';
import PouchDBFind from 'pouchdb-find';
import Vuex from 'vuex';
import Bulma from 'bulma';
import FontAwesome from 'font-awesome/css/font-awesome.css';
import App from './App.vue';

Vue.use(VuePouchDB);
Vue.use(Vuex);

RegExp.quote = function(str) {
  return (str + '')
    .replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
};

const bucket = new VuePouchDB.Bucket({
  config: {
    // Remote Server
    remote: "http://localhost:5984/",

    // Is DB Remote Only?, default: false
    remoteOnly: false,

    // db.allDocs({options})
    allDocs: {
      include_docs: true
    },

    // new Pouch({options})
    options: {
      ajax: {
        cache: false
      }
    },

    // Pouch.sync({option}) for every Instance
    sync: {
      since: 0,
      live: true,
      retry: true
    },

    // db.changes({option})
    changes: {
      since: 'now',
      live: true,
      include_docs: true
    },

    // Global onChange events
    onChanges(change) {
      console.log("Change: ", change);
      if (store.state.terms[change.doc._id]) {
        store.commit('save', change.doc)
      } else {
        store.commit('add', change.doc)
      }
    },
    onError(error) {
      console.log("Error", error);
    },
    cancel(cancel) {
      // 'cancel' var is a function to be called
      // when something bad happens. It will
      // Cancel the watch event on CouchDB
    }
  },

  // List of PouchDB plugins
  plugins: [
    PouchDBFind
  ],

  // Actions are shared across the bucket instance.
  // Can be accessed through this.$bucket.[method name]
  actions: {
    get(id) {
      return this.db('termlist')
        .get(id);
    },
    remove(id) {
      return this.db('termlist')
        .get(id)
        .then(doc => {
          return this.db('termlist')
            .remove(doc);
        });
    },
    add(termObject) {
      return this.db('termlist')
        .put(termObject);
    },
    save(termObject) {
      return this.db('termlist')
        .get(termObject._id)
        .then(doc => {
          termObject._rev = doc._rev;

          return this.db('termlist')
            .put(termObject);
        });
    },
    allDocs() {
      return this.db('termlist')
        .allDocs({
          include_docs: true,
          limit:20
        });
    },
    find(search) {
      search.search = new RegExp('.*' + RegExp.quote(search.search) + '.*', 'g');

      if (search.selected && search.selected !== "all") {
        return [this.db('termlist')
          .find({
            selector: {
              [search.selected]: {
                $regex: search.search
              }
            }
          })];
      } else {
        let returnArray = [];

        for (const field of search.fields) {
          if (!field.immutable) {
            returnArray.push(this.db('termlist')
              .find({
                selector: {
                  [field.name]: {
                    $regex: search.search
                  }
                }
              }))
          }
        }

        return returnArray;
      }

    },
    gotoPage(data) {
      return this.db('termlist')
        .allDocs({
          include_docs: true,
          startkey:data.lastTerm,
          limit:20,
          skip:20*data.pageNumberOffset+Number(!data.isBefore)
        });
    },
  },

  // Databases
  // You can also define custom "options"
  // for the database Instance (on: new PouchDB(options))
  termlist: {
    // Is remote only ?
    remoteOnly: false
  }
});

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
    allDocs(state, terms) {
      let termsObject = {};
      terms.rows.forEach(term => {
        termsObject[term.doc._id] = term.doc
      })
      state.terms = termsObject;
      state.totalRows = terms.total_rows;
    },
    find(state, terms) {
      let termsObject = {};
      terms.docs.forEach(term => {
        termsObject[term._id] = term
      })
      state.terms = termsObject;
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
        console.error('Error:', e);
      }
    },
    async add({
      commit
    }, term) {
      try {
        await bucket.add(term);
        commit('add', term);
      } catch (e) {
        console.error('Error:', e);
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
        console.error('Error:', e);
      }
    },
    async allDocs({
      commit
    }) {
      try {
        commit('allDocs', await bucket.allDocs());
      } catch (e) {
        console.error('Error:', e);
      }
    },
    async find({
      commit
    }, search) {
      try {
        let searchResults = []
        for(let result of bucket.find(search)){
          searchResults.push(await result)
        }

        let resultObject = deepmerge.all(searchResults)

        commit('find', resultObject);
      } catch (e) {
        console.error('Error:', e);
      }
    },
    async gotoPage({
      commit
    }, data) {
      try {
        commit('allDocs', await bucket.gotoPage(data));
      } catch (e) {
        console.error('Error:', e);
      }
    }
  }
})
/*
bucket.db('termlist')
  .createIndex({
    index: {
      fields: ['term', 'desc'],
      ddoc: "index-term-desc",
      name: "termindex"
    }
  })
  .then(function() {
    return bucket.db('termlist')
      .getIndexes()
  })
  .then(function(result) {
    // handle result
    console.log(result)
  })
*/
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
