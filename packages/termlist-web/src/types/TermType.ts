import { z } from 'zod'

export const TermDef = z.object({
  _id: z.string().optional(),
  date: z.string(),
  desc: z.string().optional(),
  term: z.string().nonempty(),
  type: z
    .enum([
      'verb',
      'noun',
      'adjective',
      'adverb',
      'preposition',
      'conjunction',
      'pronounciation',
    ])
    .optional()
    .catch(undefined),
})

export type TermDefType = z.infer<typeof TermDef>

export const Term = z.intersection(
  TermDef,
  z.object({
    _id: z.string(),
    /**
     * Slices of the term name used for searching
     * Usually contain the first char and the first three chars
     */
    _charSlices: z.array(z.string()).optional(),
  })
)

export type TermType = z.infer<typeof Term>
