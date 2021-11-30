import { defineStore } from 'pinia'
import { globalService } from '../machines/globalService'

export const useRootStore = defineStore('root', {
  getters: {
    loading(): boolean {
      return globalService.state.value === 'loading'
    },
  },
})
