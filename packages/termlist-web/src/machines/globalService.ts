import { ref } from 'vue'
import { interpret } from 'xstate'
import { globalMachine } from './globalMachine'

export const globalService = interpret(globalMachine)
globalService.start()

export const currentState = ref(globalService.state.value)

globalService.onTransition(state => {
  currentState.value = state.value
})
