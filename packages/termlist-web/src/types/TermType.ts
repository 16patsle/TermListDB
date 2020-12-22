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
}
