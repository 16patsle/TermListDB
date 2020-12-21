export type StateType = {
  terms: {
    [key: number]: any
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
  },
  totalRows: number
}
