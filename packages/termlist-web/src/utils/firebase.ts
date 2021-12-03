import { getFirestore } from 'firebase/firestore'
import { firebaseApp } from './initializeFirebase'
import TermDatabase from '../database'

export const database = new TermDatabase(getFirestore(firebaseApp))
