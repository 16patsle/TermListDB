import type { State as TermState } from '../stores/terms'
import type { State as ImportState } from '../stores/import'
import type { State as AuthState } from '../stores/auth'

export type StateType = {
  terms: TermState
  import: ImportState
  auth: AuthState
}
