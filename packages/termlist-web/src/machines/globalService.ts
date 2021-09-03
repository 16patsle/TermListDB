import { interpret } from 'xstate'
import { globalMachine } from './globalMachine'

export const globalService = interpret(globalMachine)
globalService.start()
