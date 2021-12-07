import type { FieldType } from '../types/FieldType'

const fields: FieldType[] = [
  {
    name: 'term',
    type: 'short',
  },
  {
    name: 'desc',
    type: 'long',
  },
  {
    name: 'type',
    type: 'select',
    options: [
      'verb',
      'noun',
      'adjective',
      'adverb',
      'preposition',
      'conjunction',
      'pronounciation',
    ],
  },
  {
    name: 'date',
    type: 'date',
    immutable: true,
  },
]

export default fields

export const fieldNames = ['term', 'desc', 'type', 'date'] as const
