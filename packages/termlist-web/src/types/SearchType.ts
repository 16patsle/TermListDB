import type { FieldNameType } from './FieldNameType'

export type SearchType = {
  /**
   * String to search for
   */
  search: string
  /**
   * The field to sort by.
   */
  field?: FieldNameType
}
