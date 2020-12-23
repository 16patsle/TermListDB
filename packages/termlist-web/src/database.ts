import type firebase from 'firebase/app'
import DocumentSnapshotStub from './DocumentSnapshotStub'

import type { TermQueryType } from './types/TermQueryType'
import type { TermType } from './types/TermType'

const regexQuote = function (str: string) {
  return (str + '').replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&')
}

class TermDatabase {
  db: firebase.firestore.Firestore
  userId?: string
  userInfoReference?: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>
  termsDB?: firebase.firestore.CollectionReference<firebase.firestore.DocumentData>

  constructor(firestore: firebase.firestore.Firestore) {
    this.db = firestore
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
    console.log('Connected to ' + user.uid + ' as ' + user.displayName)
  }

  get(
    id: string
  ):
    | Promise<
        firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>
      >
    | DocumentSnapshotStub {
    if (!this.termsDB) {
      console.warn('Not connected to db')
      return new DocumentSnapshotStub()
    }
    return this.termsDB.doc(id).get()
  }

  remove(id: string): Promise<void> {
    if (!this.termsDB) {
      console.warn('Not connected to db')
      return Promise.reject('Not connected to db')
    }
    return this.termsDB.doc(id).delete()
  }

  add(termObject: TermType): Promise<void> {
    if (!this.termsDB) {
      console.warn('Not connected to db')
      return Promise.reject('Not connected to db')
    }
    if (typeof termObject._id !== 'string') {
      console.log(termObject)
      throw new Error('Not a string!')
    }
    return this.termsDB.doc(termObject._id).set(termObject)
  }

  save(termObject: TermType): Promise<void> {
    if (!this.termsDB) {
      console.warn('Not connected to db')
      return Promise.reject('Not connected to db')
    }
    return this.termsDB.doc(termObject._id).set(termObject)
  }

  async getTerms(data: TermQueryType = {}): Promise<TermType[]> {
    if (!this.termsDB) {
      console.warn('Not connected to db')
      return []
    }

    let query = this.termsDB.orderBy(data.field || '_id')

    if (data.limit || data.limit === undefined) {
      if (data.endBefore) {
        query = query.limitToLast(data.limit || 20)
      } else {
        query = query.limit(data.limit || 20)
      }
    }
    if (data.startAfter) {
      query = query.startAfter(data.startAfter)
    }
    if (data.endBefore) {
      query = query.endBefore(data.endBefore)
    }

    if (!data.search) {
      return (await query.get()).docs.map(val => val.data() as TermType)
    } else {
      const regex = new RegExp('.*' + regexQuote(data.search) + '.*', 'g')

      if (data.search.length < 3) {
        query = query.where('_firstChar', '==', data.search.substr(0, 1))
      } else {
        query = query.where('_firstThreeChars', '==', data.search.substr(0, 3))
      }

      return (await query.get()).docs.reduce((returnArray, val) => {
        const data = val.data() as TermType
        const { term } = data
        if (term && regex.test(term)) {
          returnArray.push(data)
        }
        return returnArray
      }, [] as TermType[])
    }
  }

  async getTotalTerms(): Promise<number> {
    if (!this.userInfoReference) {
      console.warn('Not connected to db')
      return 0
    }
    const data = (await this.userInfoReference.get()).data()
    return data ? data.termlists_total : 0
  }
}

export default TermDatabase
