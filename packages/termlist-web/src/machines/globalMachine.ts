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
  | { type: 'LOG_OUT' }
  | { type: 'COMPLETE' }
  | { type: 'LOG_IN' }
  | { type: 'VIEW_TOOLS' }
  | { type: 'DEDUPE' }
  | { type: 'SEARCH' }

export type GlobalContext = {
  currentTerm?: TermType
  dedupe?: boolean
}

export const globalMachine = createMachine<GlobalContext, GlobalEvent>(
  {
    id: 'global',
    initial: 'boot',
    context: {
      currentTerm: undefined,
    },
    states: {
      boot: {
        on: {
          LOG_IN: { target: 'authenticating' },
        },
      },
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
          VIEW_TOOLS: { target: 'viewTools' },
          LOG_OUT: { target: 'authenticating' },
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
          CANCEL: { target: 'viewTools' },
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
          CANCEL: { target: 'viewTools' },
          COMPLETE: { target: 'idle' },
        },
      },
      authenticating: {
        on: {
          LOG_IN: { target: 'idle' },
        },
      },
      viewTools: {
        on: {
          CANCEL: { target: 'idle' },
          IMPORT: { target: 'confirmImport' },
          EXPORT: { target: 'exporting' },
          DEDUPE: { target: 'deduping', actions: 'setDedupe' },
        },
      },
      deduping: {
        on: {
          CANCEL: { target: 'viewTools', actions: 'setDedupe' },
          SEARCH: { target: 'idle', actions: 'setDedupe' },
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
      setDedupe(context, event) {
        if (event.type === 'DEDUPE') {
          context.dedupe = true
        } else if (event.type === 'CANCEL' || event.type === 'SEARCH') {
          context.dedupe = false
        }
      },
    },
  }
)
