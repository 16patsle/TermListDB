import { database } from '../utils/firebase'

import { defineStore } from 'pinia'
import { currentContext } from '../machines/globalService'
import type { TermType } from '../types/TermType'

export type State = {
  duplicatedTerms: TermType[]
  processed: number
  complete: boolean
}

const batchSize = 100

const isDuplicateTerm = (term1: TermType, term2?: TermType) =>
  term1.term === term2?.term

const onlyDuplicatedTerms = (term: TermType, i: number, terms: TermType[]) =>
  isDuplicateTerm(term, terms[i + 1])

const deduplicateTerms = (term: TermType, i: number, terms: TermType[]) =>
  !isDuplicateTerm(term, terms[i + 1])

export const useDedupeStore = defineStore('dedupe', {
  state: (): State => ({
    duplicatedTerms: [],
    processed: 0,
    complete: false,
  }),
  actions: {
    async checkForDuplicates() {
      this.duplicatedTerms = []
      this.processed = 0
      this.complete = false
      let terms: TermType[]
      let last: TermType | undefined = undefined
      do {
        // Fetch the next batch of terms
        terms = await database.getTerms({
          field: 'term',
          limit: batchSize,
          // If last is undefined, we are on the first batch, and startAfter does nothing
          startAfter: last?.term,
        })
        // When last is defined, make sure to check it against the current batch
        const toFilter = last ? [last, ...terms] : terms
        // Filter out duplicates
        this.duplicatedTerms.push(...toFilter.filter(onlyDuplicatedTerms))
        last = terms.at(-1)
        this.processed += terms.length
      } while (terms.length >= batchSize && currentContext.value.dedupe)
      // Filter out duplicates
      this.duplicatedTerms = this.duplicatedTerms.filter(deduplicateTerms)
      this.complete = true
    },
  },
})
