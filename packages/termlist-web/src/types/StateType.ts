import type { State as TermState } from '../modules/termsModule'
import type { State as ImportState } from '../modules/importModule'
import type { State as AuthState } from '../modules/authModule'

export type StateType = {
  terms: TermState
  import: ImportState
  auth: AuthState
}
