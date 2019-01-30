import firebase from 'firebase/app'
import 'firebase/firestore'
import secrets from '../secrets'

RegExp.quote = function(str) {
  return (str + '').replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&')
}

class TermDatabase {
  constructor() {
    firebase.initializeApp(secrets.firebase)

    this.db = firebase
      .firestore()
      .enablePersistence()
      .catch(err => {
        if (err.code == 'failed-precondition') {
          // Multiple tabs open, only works in one.
          // Silently fail
          console.warn(
            'DB persistence not enabled because multiple tabs are open.'
          )
        } else if (err.code == 'unimplemented') {
          // The current browser does not support persistence.
          // Silently fail
          console.warn('DB persistence not supported in this browser.')
        }
      })
    this.db
      .collection('users')
      .doc('test')
      .set({ name: 'Test' })
    this.termsDB = this.db
      .collection('users')
      .doc('test')
      .collection('termlists')
  }

  get(id) {
    return this.termsDB.doc(id).get()
  }

  remove(id) {
    return this.termsDB.doc(id).delete()
  }

  add(termObject) {
    return this.termsDB.doc(termObject._id).set(termObject)
  }

  save(termObject) {
    return this.termsDB.doc(termObject._id).set(termObject)
  }

  getTerms(data = {}) {
    let result = this.termsDB.orderBy(data.field || '_id')

    if (data.limit || data.limit === undefined) {
      result = result.limit(data.limit || 20)
    }
    if (data.startAfter) {
      result = result.startAfter(data.startAfter)
    }
    if (data.endBefore) {
      result = result.endBefore(data.endBefore)
    }

    return result.get()
  }

  async find(search) {
    /* TODO: Figure out why some stuff doesn't appear, and add search button so we don't search on each key press */
    search.search = new RegExp('.*' + RegExp.quote(search.search) + '.*', 'g')
    search.field = search.field || '_id'

    const allTerms = await this.termsDB.orderBy(search.field).get()
    if (search.selected && search.selected !== 'all') {
      return [
        allTerms.docs
          .map(val => {
            return val.data()
          })
          .filter(val => {
            return search.search.test(val[search.selected])
          })
      ]
    } else {
      let returnArray = []

      for (const field of search.fields) {
        if (!field.immutable) {
          returnArray.push(
            allTerms.docs
              .map(val => {
                return val.data()
              })
              .filter(val => {
                return search.search.test(val[field])
              })
          )
        }
      }

      return returnArray
    }
  }
}

export default TermDatabase
