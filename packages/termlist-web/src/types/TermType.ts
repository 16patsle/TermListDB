export type TermType = {
  _id: string
  date: string
  desc?: string
  term?: string
  type?:
    | 'verb'
    | 'noun'
    | 'adjective'
    | 'adverb'
    | 'preposition'
    | 'conjunction'
    | 'pronounciation'
  _deleted?: boolean
  /**
   * Slices of the term name used for searching
   * Usually contain the first char and the first three chars
   */
  _charSlices?: string[]
}
