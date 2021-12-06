import { browserLocalPersistence, initializeAuth } from 'firebase/auth'
import { firebaseApp } from './initializeFirebase'

export const auth = initializeAuth(firebaseApp, {
  persistence: [browserLocalPersistence],
  popupRedirectResolver: undefined,
})
