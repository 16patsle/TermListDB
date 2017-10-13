import Vue from 'vue'
//import PouchDB from 'pouchdb'
import VuePouchDB from 'vue-pouch-db';
//import List from 'list.js'
import Bulma from 'bulma'
import FontAwesome from 'font-awesome/css/font-awesome.css'
import App from './App.vue'

Vue.use(VuePouchDB);

const bucket = new VuePouchDB.Bucket({
  // Main config Object. This is the top level
  // config object. Where global config
  // are shared with each database.
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
    // for each database.
    // The functions here are passed to each DB
    // db.changes().on(() => {})
    onChanges(change) {
      console.log("Change: ", change);
    },
    onPaused(error) {
      console.log("Paused", error);
    },
    onActive() {
      console.log("Active");
    },
    onDenied(error) {
      console.log("Denied", error);
    },
    onComplete() {
      console.log("Completed");
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
    //require('pouchdb-plugin')
  ],

  // Actions are shared across the
  // bucket instance.
  // Think of them as helper methods to bundle
  // several sets of commands into a single method.
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
          /*doc.term = termObject.term;
          doc.desc = termObject.desc;
          doc.date = termObject.date;*/
          termObject._rev = doc._rev;

          return this.db('termlist')
            .put(termObject);
        });
    },
    allDocs() {
      return this.db('termlist')
        .allDocs({
          include_docs: true
        });
    },
    addDoc(arg) {
      // this is $bucket instance
      /*this.db('projects').({
          _id: 'document_id'
          data: {}
        }, function() {});*/
    }
  },

  // Databases
  // You can define / instanciate
  // a per database config file.
  // this will put the database into the internal
  // state and also, you can define custom "options"
  // for the database Instance (on: new PouchDB(options))
  termlist: {
    // Is remote only ?
    remoteOnly: false
  }
});

new Vue({
  el: '#app',
  bucket,
  render: h => h(App)
})
