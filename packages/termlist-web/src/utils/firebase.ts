import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import TermDatabase from '../database'

/* global process */
firebase.initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
})

const database = new TermDatabase(firebase.firestore())
export default database
