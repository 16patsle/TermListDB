import type firebase from 'firebase/app'
import DocumentSnapshotStub from './DocumentSnapshotStub'
import QuerySnapshotStub from './QuerySnapshotStub'
import type { FieldType } from './types/FieldType'
import type { SearchType } from './types/SearchType'
import type { TermQueryType } from './types/TermQueryType'
import type { TermType } from './types/TermType'

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

  async start(): Promise<void> {
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

  connect(user: firebase.User): void {
    this.userInfoReference = this.db.collection('users').doc(user.uid)

    this.userInfoReference.update({ name: user.displayName })
    this.termsDB = this.userInfoReference.collection('termlists')

    this.userId = user.uid
    this.connected = true
    console.log('Connected to ' + user.uid + ' as ' + user.displayName)
  }

  get(
    id: string
  ):
    | Promise<
        firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>
      >
    | DocumentSnapshotStub {
    if (!this.connected) {
      console.warn('Not connected to db')
      return new DocumentSnapshotStub()
    }
    return this.termsDB.doc(id).get()
  }

  remove(id: string): Promise<void> {
    if (!this.connected) {
      console.warn('Not connected to db')
      return Promise.reject('Not connected to db')
    }
    return this.termsDB.doc(id).delete()
  }

  add(termObject: TermType): Promise<void> {
    if (!this.connected) {
      console.warn('Not connected to db')
      return Promise.reject('Not connected to db')
    }
    if (typeof termObject._id !== 'string') {
      console.log(termObject)
      throw new Error('Not a string!')
    }
    return this.termsDB.doc(termObject._id).set(termObject)
  }

  save(termObject: { _id: any }): Promise<void> {
    if (!this.connected) {
      console.warn('Not connected to db')
      return Promise.reject('Not connected to db')
    }
    return this.termsDB.doc(termObject._id).set(termObject)
  }

  async getTerms(data: TermQueryType = {}): Promise<TermType[]> {
    if (!this.connected) {
      console.warn('Not connected to db')
      return []
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

    return (await result.get()).docs.map(val => val.data() as TermType)
  }

  async find(search: SearchType): Promise<TermType[]> {
    if (!this.connected) {
      console.warn('Not connected to db')
      return []
    }

    /* TODO: Figure out why some stuff doesn't appear, and add search button so we don't search on each key press */
    const regex = new RegExp('.*' + regexQuote(search.search) + '.*', 'g')
    search.field = search.field || '_id'

    const allTerms = await this.termsDB.orderBy(search.field).get()
    let fields = search.fields
    if (search.selected && search.selected !== 'all') {
      fields = fields.filter(val => val.name === search.selected)
    }
    const returnArray: TermType[] = []

    for (const field of fields) {
      if (!field.immutable) {
        allTerms.docs.forEach(val => {
          const data = val.data() as TermType
          if (regex.test(data[field.name])) {
            returnArray.push(data)
          }
        })
      }
    }

    return returnArray
  }

  async getTotalTerms(): Promise<number> {
    if (!this.connected) {
      console.warn('Not connected to db')
      return 0
    }
    const data = await this.userInfoReference.get()
    return data.data().termlists_total
  }
}

export default TermDatabase
