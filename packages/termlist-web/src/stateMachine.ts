import { interpret } from 'xstate'
import { globalMachine } from './machines/globalMachine'

export const globalService = interpret(globalMachine)
globalService.start()
