import { database } from '../utils/firebase'

import { defineStore } from 'pinia'
import type { TermType } from '../types/TermType'

export type State = {
  duplicatedTerms: TermType[]
}

const filterDuplicatedTerms = (term: TermType, i: number, terms: TermType[]) =>
  term.term === terms[i + 1]?.term

export const useDedupeStore = defineStore('dedupe', {
  state: (): State => ({
    duplicatedTerms: [],
  }),
  actions: {
    async checkForDuplicates() {
      this.duplicatedTerms = []
      let terms = await database.getTerms({
        field: 'term',
        limit: 101,
      })
      let last = terms.at(-1)
      while (terms.length > 100 && last) {
        terms = await database.getTerms({
          field: 'term',
          limit: 100,
          startAfter: last.term,
        })
        const newLast = terms.at(-1)
        terms.push(last)
        last = newLast
        this.duplicatedTerms.push(...terms.filter(filterDuplicatedTerms))
      }
    },
  },
})
