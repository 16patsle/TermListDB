import { createMachine } from 'xstate'
import type { TermType } from '../types/TermType'

export type GlobalEvent =
  | { type: 'LOAD_COMPLETE' }
  | { type: 'LOAD_START' }
  | { type: 'EDIT'; term?: TermType }
  | { type: 'PROMPT_REMOVE'; term?: TermType }
  | { type: 'SAVE' }
  | { type: 'CANCEL' }
  | { type: 'REMOVE' }
  | { type: 'IMPORT' }
  | { type: 'EXPORT' }
  | { type: 'COMPLETE' }

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
          PROMPT_REMOVE: { target: 'removing', actions: 'setCurrentTerm' },
          IMPORT: { target: 'confirmImport' },
          EXPORT: { target: 'exporting' },
        },
      },
      editing: {
        on: {
          SAVE: { target: 'idle', actions: 'setCurrentTerm' },
          CANCEL: { target: 'idle', actions: 'setCurrentTerm' },
        },
      },
      removing: {
        on: {
          REMOVE: { target: 'idle', actions: 'setCurrentTerm' },
          CANCEL: { target: 'idle', actions: 'setCurrentTerm' },
        },
      },
      confirmImport: {
        on: {
          IMPORT: { target: 'importing' },
          CANCEL: { target: 'idle' },
        },
      },
      importing: {
        on: {
          CANCEL: { target: 'idle' },
          COMPLETE: { target: 'idle' },
        },
      },
      exporting: {
        on: {
          CANCEL: { target: 'idle' },
          COMPLETE: { target: 'idle' },
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
