import type { FilterType } from '@/stores/terms'
import type { FieldNameType } from './FieldNameType'

export type TermQueryType = {
  /**
   * The field to sort by.
   */
  field?: FieldNameType
  /**
   * The maximum number of items to return.
   */
  limit?: number
  /**
   * The field values to start this query after, in order of the query's field to sort by.
   */
  startAfter?: string
  /**
   * The field values to end this query before, in order of the query's field to sort by.
   */
  endBefore?: string
  /**
   * The maximum amount of items to show.
   */
  showLimit?: number
  /**
   * String to search for, if we're searching
   */
  search?: string
  /**
   * The chosen special filter to use.
   */
  filter?: FilterType
}
