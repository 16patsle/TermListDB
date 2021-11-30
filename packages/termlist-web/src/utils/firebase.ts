import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import TermDatabase from '../database'

/* global process */
export const firebaseApp = initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
})

const database = new TermDatabase(getFirestore(firebaseApp))
export default database
