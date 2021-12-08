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
      let terms = await database.getTerms({
        field: 'term',
        limit: batchSize + 1,
      })
      let last = terms.at(-1)
      while (terms.length > batchSize && last) {
        terms = await database.getTerms({
          field: 'term',
          limit: batchSize,
          startAfter: last.term,
        })
        const newLast = terms.at(-1)
        terms.push(last)
        last = newLast
        this.duplicatedTerms.push(...terms.filter(filterDuplicatedTerms))
        this.processed += batchSize
      }
    },
  },
})
