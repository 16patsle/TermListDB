import type { TermType } from './TermType'

export type StateType = {
  terms: {
    [key: string]: TermType
  }
  imports: {
    imported: number
    total: number
    finished: boolean
    cancel: boolean
  }
  auth: {
    authenticated: boolean
    user: any
  }
  totalRows: number
}
