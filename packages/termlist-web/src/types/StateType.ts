import type { State as TermState } from '../stores/termsModule'
import type { State as ImportState } from '../stores/importModule'
import type { State as AuthState } from '../stores/auth'

export type StateType = {
  terms: TermState
  import: ImportState
  auth: AuthState
}
