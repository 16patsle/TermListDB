import type { FieldType } from './FieldType'

export type SearchType = {
  /**
   * String to search for
   */
  search: string
  /**
   * Selected field to search in, or 'all'
   */
  selected: string
  /**
   * All the fields
   */
  fields: FieldType[]
  /**
   * The field to sort by.
   */
  field?: string
}
