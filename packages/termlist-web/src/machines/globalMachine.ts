import { createMachine } from 'xstate'
import type { TermType } from '../types/TermType'

export type GlobalEvent =
  | { type: 'LOAD_COMPLETE' }
  | { type: 'LOAD_START' }
  | { type: 'EDIT'; term?: TermType }
  | { type: 'SAVE' }
  | { type: 'CANCEL' }

export type GlobalContext = {
  currentTerm?: TermType
}

export const globalMachine = createMachine<GlobalContext, GlobalEvent>(
  {
    id: 'global',
    initial: 'loading',
    context: {
      currentTerm: undefined,
    },
    states: {
      loading: {
        on: {
          LOAD_COMPLETE: { target: 'idle' },
        },
      },
      idle: {
        on: {
          LOAD_START: { target: 'loading' },
          EDIT: { target: 'editing', actions: 'setCurrentTerm' },
        },
      },
      editing: {
        on: {
          SAVE: { target: 'idle', actions: 'setCurrentTerm' },
          CANCEL: { target: 'idle', actions: 'setCurrentTerm' },
        },
      },
    },
  },
  {
    actions: {
      setCurrentTerm(context, event) {
        if ('term' in event) {
          context.currentTerm = event.term
        } else {
          context.currentTerm = undefined
        }
      },
    },
  }
)
