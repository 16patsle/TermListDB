export type TermDefType = {
  _id?: string
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
}

export type TermType = TermDefType & {
  _id: string
  /**
   * Slices of the term name used for searching
   * Usually contain the first char and the first three chars
   */
  _charSlices?: string[]
}
