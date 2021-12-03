import { database } from '../utils/firebase'
import { log } from '../utils/log'

import { defineStore } from 'pinia'
import type { User } from 'firebase/auth'
import { globalService } from '../machines/globalService'

export type State = {
  user?: User
}

export const useAuthStore = defineStore('auth', {
  state: (): State => ({
    user: undefined,
  }),
  actions: {
    setAuthenticated(user: User | null) {
      log('Auth update')
      if (user) {
        database.connect(user)
        this.user = user
        globalService.send('LOG_IN')
      } else {
        this.user = undefined
        globalService.send('LOG_OUT')
      }
    },
  },
})
