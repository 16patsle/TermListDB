import {
  collection,
  deleteDoc,
  doc,
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
  getFirestore,
} from 'firebase/firestore'
import { z } from 'zod'
import { log } from './utils/log'

import type {
  CollectionReference,
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  QueryConstraint,
} from 'firebase/firestore'
import type { User } from 'firebase/auth'
import type { TermQueryType } from './types/TermQueryType'
import { Term, type TermType } from './types/TermType'
import { firebaseApp } from './utils/initializeFirebase'

const db = getFirestore(firebaseApp)
let userId: string | undefined
let userInfoReference: DocumentReference<DocumentData> | undefined
let termsDB: CollectionReference<DocumentData> | undefined

async function start(): Promise<void> {
  await enableIndexedDbPersistence(db).catch((err: { code: string }) => {
    if (err.code == 'failed-precondition') {
      // Multiple tabs open, only works in one.
      // Silently fail
      console.warn('DB persistence not enabled because multiple tabs are open.')
    } else if (err.code == 'unimplemented') {
      // The current browser does not support persistence.
      // Silently fail
      console.warn('DB persistence not supported in this browser.')
    }
  })
}

function connect(user: User): void {
  userInfoReference = doc(collection(db, 'users'), user.uid)

  void updateDoc(userInfoReference, { name: user.displayName })
  termsDB = collection(db, 'users', user.uid, 'termlists')

  userId = user.uid
  log(`Connected to ${user.uid} as ${user.displayName || ''}`)
}

function get(id: string): Promise<DocumentSnapshot<DocumentData>> | undefined {
  if (!termsDB) {
    console.warn('Not connected to db')
    return
  }
  return getDoc(doc(termsDB, id))
}

function remove(id: string): Promise<void> {
  if (!termsDB) {
    console.warn('Not connected to db')
    return Promise.reject('Not connected to db')
  }
  return deleteDoc(doc(termsDB, id))
}

function add(termObject: TermType): Promise<void> {
  if (!termsDB) {
    console.warn('Not connected to db')
    return Promise.reject('Not connected to db')
  }
  if (typeof termObject._id !== 'string') {
    log('Invalid id', termObject)
    throw new Error('Not a string!')
  }
  return setDoc(doc(termsDB, termObject._id), termObject)
}

function save(termObject: TermType): Promise<void> {
  if (!termsDB) {
    console.warn('Not connected to db')
    return Promise.reject('Not connected to db')
  }
  return setDoc(doc(termsDB, termObject._id), termObject)
}

async function getTerms(data: TermQueryType = {}): Promise<TermType[]> {
  if (!termsDB) {
    console.warn('Not connected to db')
    return []
  }

  const queryConstraints: QueryConstraint[] = [orderBy(data.field || '_id')]

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

  if (data.filter) {
    switch (data.filter) {
      case 'missingDescription':
        queryConstraints.push(where('desc', '==', ''))
        break
      case 'missingType':
        queryConstraints.push(where('type', '==', ''))
        break
    }
  }

  if (!data.search) {
    const termQuery = query(termsDB, ...queryConstraints)
    return (await getDocs(termQuery)).docs.map(val => Term.parse(val.data()))
  } else {
    let slice = data.search.substr(0, 3)
    if (data.search.length < 3) {
      slice = data.search.substr(0, 1)
    }
    queryConstraints.push(where('_charSlices', 'array-contains', slice))

    const termQuery = query(termsDB, ...queryConstraints)
    return (await getDocs(termQuery)).docs.reduce<TermType[]>(
      (returnArray, val) => {
        const termData = Term.parse(val.data())
        const { term } = termData
        if (term && data.search && term.includes(data.search)) {
          returnArray.push(termData)
        }
        return returnArray
      },
      []
    )
  }
}

async function getTotalTerms(): Promise<number> {
  if (!userInfoReference) {
    console.warn('Not connected to db')
    return 0
  }
  const data = (await getDoc(userInfoReference)).data()
  return data ? z.number().parse(data.termlists_total) : 0
}

export const database = Object.freeze({
  get userId() {
    return userId
  },
  get userInfoReference() {
    return userInfoReference
  },
  start,
  connect,
  get,
  remove,
  add,
  save,
  getTerms,
  getTotalTerms,
})
