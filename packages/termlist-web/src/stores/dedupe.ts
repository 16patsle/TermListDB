import { database } from '../utils/firebase'

import { defineStore } from 'pinia'
import type { TermType } from '../types/TermType'

export type State = {
  duplicatedTerms: TermType[]
  processed: number
}

const batchSize = 100

const isDuplicateTerm = (term1: TermType, term2?: TermType) =>
  term1.term === term2?.term

const filterDuplicatedTerms = (term: TermType, i: number, terms: TermType[]) =>
  isDuplicateTerm(term, terms[i + 1])

export const useDedupeStore = defineStore('dedupe', {
  state: (): State => ({
    duplicatedTerms: [],
    processed: 0,
  }),
  actions: {
    async checkForDuplicates() {
      this.duplicatedTerms = []
      let terms: TermType[]
      let last: TermType | undefined = undefined
      do {
        // Fetch the next batch of terms
        terms = await database.getTerms({
          field: 'term',
          limit: batchSize,
          startAfter: last?.term,
        })
        // Make sure to check the last term of the previous batch
        if (last && isDuplicateTerm(last, terms[0])) {
          this.duplicatedTerms.push(last)
        }
        last = terms.at(-1)
        // Filter out duplicates
        this.duplicatedTerms.push(...terms.filter(filterDuplicatedTerms))
        this.processed += batchSize
      } while (terms.length >= batchSize)
    },
  },
})
