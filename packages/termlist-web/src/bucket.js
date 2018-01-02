import PouchDB from 'pouchdb-browser';
import PouchDBFind from 'pouchdb-find';

RegExp.quote = function(str) {
  return (str + '')
    .replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
};

class TermDatabase {
  constructor(store) {
    PouchDB.plugin(PouchDBFind);

    this.db = new PouchDB('termlist', {});
    this.remoteDB = new PouchDB('http://localhost:5984/termlist', {
      ajax: {
        cache: false
      }
    });

    this.db.sync(this.remoteDB, {
      since: 0,
      live: true,
      retry: true
    })

    this.db.changes({
        live: true,
        since: 'now',
        include_docs: true
      })
      .on('change', change => {
        console.log("Change: ", change);
        if (change.deleted) {
          store.commit('remove', change.doc)
        } else if (store.state.terms[change.doc._id]) {
          store.commit('save', change.doc)
        } else {
          store.commit('add', change.doc)
        }
      })

    this.db.changes({
        live: true,
        since: 'now',
        include_docs: true
      })
      .on('error', error => console.log("Error", error))

  }

  get(id) {
    return this.db
      .get(id);
  }

  remove(id) {
    return this.db
      .get(id)
      .then(doc => {
        return this.db
          .remove(doc);
      });
  }

  add(termObject) {
    return this.db
      .put(termObject);
  }

  save(termObject) {
    return this.db
      .get(termObject._id)
      .then(doc => {
        termObject._rev = doc._rev;

        return this.db
          .put(termObject);
      });
  }

  getTerms(data) {
    data = data || {};
    data.index = data.field || null;
    data.field = data.field || '_id';
    data.lastTerm = data.lastTerm || {};
    data.lastTerm[data.field] = data.lastTerm[data.field] || null;
    if(data.limit === undefined) {
      data.limit = 20
    }

    return this.db
      .find({
        selector: {
          [data.field]: {
            $gte: data.lastTerm[data.field]
          }
        },
        sort: [data.field],
        limit: data.limit,
        skip: 20 * data.pageNumberOffset + Number(!data.isBefore),
        use_index: data.index
      });
  }

  find(search) {
    search.search = new RegExp('.*' + RegExp.quote(search.search) + '.*', 'g');

    if (search.selected && search.selected !== "all") {
      return [this.db
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
          returnArray.push(this.db
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
  }

  createIndex(indexes, data) {
    if (data && data.field) {
      if (indexes.indexes.indexOf(data.field) === -1) {
        return this.db
          .createIndex({
            index: {
              fields: [data.field],
              name: data.field,
              ddoc: data.field
            }
          });
      }
    }
  }

  getTotal() {
    return this.db.allDocs({
      limit: 1
    });
  }
}

export default TermDatabase;
