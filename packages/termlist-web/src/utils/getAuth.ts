import { getAuth } from 'firebase/auth'
import { firebaseApp } from './initializeFirebase'

export const auth = getAuth(firebaseApp)
