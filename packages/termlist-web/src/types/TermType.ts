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
   * First character of term
   */
  _firstChar?: string
  /**
   * First three characters of term
   */
  _firstThreeChars?: string
}
