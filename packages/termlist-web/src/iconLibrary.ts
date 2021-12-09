import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faPencilAlt,
  faTrashAlt,
  faSearch,
  faUpload,
  faSpinner,
  faTimes,
} from '@fortawesome/free-solid-svg-icons'

library.add(faPencilAlt, faTrashAlt, faSearch, faUpload, faSpinner, faTimes)
export type LibraryWithDefs = typeof library & {
  definitions: {
    fas: {
      [key: string]: unknown[]
    }
  }
}
export const iconLibrary = library as LibraryWithDefs

export { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
