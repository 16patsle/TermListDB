import { createMachine } from 'xstate'

export type GlobalEvent =
  | { type: 'LOAD_COMPLETE' }
  | { type: 'LOAD_START' }
  | { type: 'EDIT' }
  | { type: 'SAVE' }

export const globalMachine = createMachine<any, GlobalEvent>({
  id: 'global',
  initial: 'loading',
  states: {
    loading: {
      on: {
        LOAD_COMPLETE: { target: 'idle' },
      },
    },
    idle: {
      on: {
        LOAD_START: { target: 'loading' },
        EDIT: { target: 'editing' },
      },
    },
    editing: {
      on: {
        SAVE: { target: 'idle' },
      },
    },
  },
})
