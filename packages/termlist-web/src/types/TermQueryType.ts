export type TermQueryType = {
  /**
   * The field to sort by.
   */
  field?: string
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
}
