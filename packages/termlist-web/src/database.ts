import {
  collection,
  deleteDoc,
  doc,
  DocumentSnapshot,
  enableIndexedDbPersistence,
  endBefore,
  getDoc,
  getDocs,
  limit,
  limitToLast,
  orderBy,
  query,
  setDoc,
  startAfter,
  updateDoc,
  where,
} from 'firebase/firestore'
import { log } from './utils/log'

import type {
  CollectionReference,
  DocumentData,
  DocumentReference,
  Firestore,
} from 'firebase/firestore'
import type { User } from 'firebase/auth'
import type { TermQueryType } from './types/TermQueryType'
import type { TermType } from './types/TermType'

const regexQuote = function (str: string) {
  return (str + '').replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&')
}

class TermDatabase {
  db: Firestore
  userId?: string
  userInfoReference?: DocumentReference<DocumentData>
  termsDB?: CollectionReference<DocumentData>

  constructor(firestore: Firestore) {
    this.db = firestore
  }

  async start(): Promise<void> {
    await enableIndexedDbPersistence(this.db).catch((err: { code: string }) => {
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

  async connect(user: User): Promise<void> {
    this.userInfoReference = doc(collection(this.db, 'users'), user.uid)

    await updateDoc(this.userInfoReference, { name: user.displayName })
    this.termsDB = collection(this.db, 'users', user.uid, 'termlists')

    this.userId = user.uid
    log(`Connected to ${user.uid} as ${user.displayName || ''}`)
  }

  get(id: string): Promise<DocumentSnapshot<DocumentData>> | undefined {
    if (!this.termsDB) {
      console.warn('Not connected to db')
      return
    }
    return getDoc(doc(this.termsDB, id))
  }

  remove(id: string): Promise<void> {
    if (!this.termsDB) {
      console.warn('Not connected to db')
      return Promise.reject('Not connected to db')
    }
    return deleteDoc(doc(this.termsDB, id))
  }

  add(termObject: TermType): Promise<void> {
    if (!this.termsDB) {
      console.warn('Not connected to db')
      return Promise.reject('Not connected to db')
    }
    if (typeof termObject._id !== 'string') {
      log('Invalid id', termObject)
      throw new Error('Not a string!')
    }
    return setDoc(doc(this.termsDB, termObject._id), termObject)
  }

  save(termObject: TermType): Promise<void> {
    if (!this.termsDB) {
      console.warn('Not connected to db')
      return Promise.reject('Not connected to db')
    }
    return setDoc(doc(this.termsDB, termObject._id), termObject)
  }

  async getTerms(data: TermQueryType = {}): Promise<TermType[]> {
    if (!this.termsDB) {
      console.warn('Not connected to db')
      return []
    }

    const queryConstraints = [orderBy(data.field || '_id')]

    if (data.limit || data.limit === undefined) {
      if (data.endBefore) {
        queryConstraints.push(limitToLast(data.limit || 20))
      } else {
        queryConstraints.push(limit(data.limit || 20))
      }
    }
    if (data.startAfter) {
      queryConstraints.push(startAfter(data.startAfter))
    }
    if (data.endBefore) {
      queryConstraints.push(endBefore(data.endBefore))
    }

    if (!data.search) {
      const termQuery = query(this.termsDB, ...queryConstraints)
      return (await getDocs(termQuery)).docs.map(val => val.data() as TermType)
    } else {
      const regex = new RegExp('.*' + regexQuote(data.search) + '.*', 'g')

      let slice = data.search.substr(0, 3)
      if (data.search.length < 3) {
        slice = data.search.substr(0, 1)
      }
      queryConstraints.push(where('_charSlices', 'array-contains', slice))

      const termQuery = query(this.termsDB, ...queryConstraints)
      return (await getDocs(termQuery)).docs.reduce((returnArray, val) => {
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
    const data = (await getDoc(this.userInfoReference)).data()
    return data ? (data.termlists_total as number) : 0
  }
}

export default TermDatabase
