import VuePouchDB from 'vue-pouch-db';
import PouchDBFind from 'pouchdb-find';

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
    getTerms(data) {
      data = data || {};
      data.index = data.field || null;
      data.field = data.field || '_id';
      data.lastTerm = data.lastTerm || {};
      data.lastTerm[data.field] = data.lastTerm[data.field] || null;

      return this.db('termlist')
        .find({
          selector: {
            [data.field]: {
              $gte: data.lastTerm[data.field]
            }
          },
          sort: [data.field],
          limit: 20,
          skip: 20 * data.pageNumberOffset + Number(!data.isBefore),
          use_index: data.index
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
          })
        ];
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
    createIndex(indexes, data) {
      if (data && data.field) {
        if (indexes.indexes.indexOf(data.field) === -1) {
          return this.db('termlist')
            .createIndex({
              index: {
                fields: [data.field],
                name: data.field,
                ddoc: data.field
              }
            });
        }
      }
    },
    getTotal() {
      return this.db('termlist').allDocs({limit:1});
    }
  },

  // Databases
  // You can also define custom "options"
  // for the database Instance (on: new PouchDB(options))
  termlist: {
    // Is remote only ?
    remoteOnly: false
  }
});

export default bucket;
