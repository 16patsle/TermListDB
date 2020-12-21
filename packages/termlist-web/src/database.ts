import type firebase from 'firebase/app'
import DocumentSnapshotStub from './DocumentSnapshotStub'
import QuerySnapshotStub from './QuerySnapshotStub'

const regexQuote = function (str: string) {
  return (str + '').replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&')
}

class TermDatabase {
  db: firebase.firestore.Firestore
  userId?: string
  connected: boolean
  userInfoReference?: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>
  termsDB: firebase.firestore.CollectionReference<firebase.firestore.DocumentData>
  
  constructor(firestore: firebase.firestore.Firestore) {
    this.db = firestore
    this.connected = false
  }

  async start() {
    await this.db.enablePersistence().catch((err: { code: string }) => {
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

  connect(user: { uid: string; displayName: string }) {
    this.userInfoReference = this.db.collection('users').doc(user.uid)

    this.userInfoReference.update({ name: user.displayName })
    this.termsDB = this.userInfoReference.collection('termlists')

    this.userId = user.uid
    this.connected = true
    console.log('Connected to ' + user.uid + ' as ' + user.displayName)
  }

  get(id: any) {
    if (!this.connected) {
      console.warn('Not connected to db')
      return new DocumentSnapshotStub()
    }
    return this.termsDB.doc(id).get()
  }

  remove(id: any) {
    if (!this.connected) {
      console.warn('Not connected to db')
      return
    }
    return this.termsDB.doc(id).delete()
  }

  add(termObject: { _id: any }) {
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

  save(termObject: { _id: any }) {
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
      if (data.endBefore) {
        result = result.limitToLast(data.limit || 20)
      } else {
        result = result.limit(data.limit || 20)
      }
    }
    if (data.startAfter) {
      result = result.startAfter(data.startAfter)
    }
    if (data.endBefore) {
      result = result.endBefore(data.endBefore)
    }

    return result.get()
  }

  async find(search: {
    search: RegExp
    field: string
    selected: string
    fields: any
  }) {
    if (!this.connected) {
      console.warn('Not connected to db')
      return new QuerySnapshotStub()
    }

    /* TODO: Figure out why some stuff doesn't appear, and add search button so we don't search on each key press */
    search.search = new RegExp('.*' + regexQuote(search.search) + '.*', 'g')
    search.field = search.field || '_id'

    const allTerms = await this.termsDB.orderBy(search.field).get()
    if (search.selected && search.selected !== 'all') {
      return [
        allTerms.docs
          .map((val: { data: () => any }) => {
            return val.data()
          })
          .filter((val: { [x: string]: any }) => {
            return search.search.test(val[search.selected])
          }),
      ]
    } else {
      const returnArray = []

      for (const field of search.fields) {
        if (!field.immutable) {
          returnArray.push(
            allTerms.docs
              .map((val: { data: () => any }) => {
                return val.data()
              })
              .filter((val: { [x: string]: any }) => {
                return search.search.test(val[field.name])
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
    const data = await this.userInfoReference.get()
    return data.data().termlists_total
  }
}

export default TermDatabase