import DocumentSnapshotStub from './DocumentSnapshotStub'
import QuerySnapshotStub from './QuerySnapshotStub'

RegExp.quote = function(str) {
  return (str + '').replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&')
}

class TermDatabase {
  constructor(firebase) {
    this.firebase = firebase
    this.db = firebase.firestore()
    this.userId = null
    this.connected = false
    this.userInfoReference = null;
  }

  async start() {
    await this.db.enablePersistence().catch(err => {
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
  }

  connect(user) {
    this.userInfoReference = this.db
      .collection('users')
      .doc(user.uid)

    this.userInfoReference.update({ name: user.displayName })
    this.termsDB = this.userInfoReference.collection('termlists')

    this.userId = user.uid
    this.connected = true
    console.log('Connected to ' + user.uid + ' as ' + user.displayName)
  }

  get(id) {
    if (!this.connected) {
      console.warn('Not connected to db')
      return new DocumentSnapshotStub()
    }
    return this.termsDB.doc(id).get()
  }

  remove(id) {
    if (!this.connected) {
      console.warn('Not connected to db')
      return
    }
    return this.termsDB.doc(id).delete()
  }

  add(termObject) {
    if (!this.connected) {
      console.warn('Not connected to db')
      return
    }
    if (typeof termObject._id !== 'string') {
      console.log(termObject)
      throw new Error('Not a string!')
    }
    return this.termsDB.doc(termObject._id).set(termObject)
  }

  save(termObject) {
    if (!this.connected) {
      console.warn('Not connected to db')
      return
    }
    return this.termsDB.doc(termObject._id).set(termObject)
  }

  getTerms(data = {}) {
    if (!this.connected) {
      console.warn('Not connected to db')
      return new QuerySnapshotStub()
    }

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
    if (!this.connected) {
      console.warn('Not connected to db')
      return new QuerySnapshotStub()
    }

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

  async getTotalTerms() {
    if (!this.connected) {
      console.warn('Not connected to db')
      return 0
    }
    const data = await this.userInfoReference
      .get()
    return data.data().termlists_total
  }
}

export default TermDatabase
