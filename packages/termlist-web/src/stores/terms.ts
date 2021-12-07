import { database } from '../utils/firebase'
import { globalService } from '../machines/globalService'

import { defineStore } from 'pinia'
import type { TermQueryType } from '../types/TermQueryType'
import type { TermType } from '../types/TermType'
import type { FieldNameType } from '../types/FieldNameType'

export type State = {
  terms: Map<string, TermType>
  totalRows: number
  sortedBy: FieldNameType
  currentPage: number
}

export const useTermsStore = defineStore('terms', {
  state: (): State => ({
    terms: new Map(),
    totalRows: 0,
    sortedBy: 'term',
    currentPage: 1,
  }),
  getters: {
    loading(): boolean {
      return globalService.state.value === 'loading'
    },
  },
  actions: {
    async remove(term: TermType) {
      try {
        await database.remove(term._id)
        this.terms.delete(term._id)
        this.totalRows--
        globalService.send('REMOVE')
      } catch (e) {
        console.error('Error:', e, term)
      }
    },
    async add(term: TermType) {
      try {
        term._charSlices = term.term
          ? [term.term.substr(0, 1), term.term.substr(0, 3)]
          : []

        await database.add(term)
        const success = !this.terms.has(term._id)
        if (success) {
          this.terms.set(term._id, term)
          this.totalRows++
          // Reload from first page
          await this.getTerms({
            field: this.sortedBy,
          })
        } else {
          console.error('Already exists!', term)
        }
        globalService.send('SAVE')
        return success
      } catch (e) {
        console.error('Error:', e, term)
        return false
      }
    },
    async save(term: TermType) {
      try {
        if (this.terms.get(term._id) !== term) {
          term._charSlices = term.term
            ? [term.term.substr(0, 1), term.term.substr(0, 3)]
            : []

          await database.save(term)
          if (this.terms.has(term._id)) {
            this.terms.set(term._id, term)
          } else {
            console.error('Could not save! Term might not exist!', term)
          }
          globalService.send('SAVE')
        } else {
          throw 'Term not changed!'
        }
      } catch (e) {
        console.error('Error:', e, term)
      }
    },
    async getTerms(data: TermQueryType) {
      try {
        const termsObject = new Map<string, TermType>()
        let terms = await database.getTerms(data)

        if (data.showLimit) {
          // Return last x elements
          terms = terms.slice(Math.max(terms.length - data.showLimit, 0))
        }

        terms.forEach(term => termsObject.set(term._id, term))
        this.terms = termsObject
      } catch (e) {
        console.error('Error:', e, data)
      }
    },
    async fetchTotal() {
      try {
        this.totalRows = await database.getTotalTerms()
      } catch (e) {
        console.error('Error:', e)
      }
    },
    async gotoPage({
      pageNumber,
      currentPage,
    }: {
      pageNumber: number
      currentPage: number
    }) {
      const terms = this.terms
      const pageNumberOffset = pageNumber - currentPage
      const isBefore = pageNumber < currentPage
      const sortedBy = this.sortedBy

      globalService.send('LOAD_START')

      if (Math.abs(pageNumberOffset) === 1) {
        if (isBefore) {
          await this.getTerms({
            field: sortedBy,
            endBefore: findBeforeAfter(terms, sortedBy, 'before'),
          })
        } else {
          await this.getTerms({
            field: sortedBy,
            startAfter: findBeforeAfter(terms, sortedBy, 'after'),
          })
        }
      } else {
        if (isBefore) {
          const limit = pageNumber * 20

          await this.getTerms({
            field: sortedBy,
            limit,
            showLimit: 20,
          })
        } else {
          const termsLeft = this.totalRows - 20 * currentPage
          // Amount of terms on x pages
          const limit = termsLeft
          let showLimit = 20

          // If the amount of terms won't fill the last page completely,
          // find out how many are on the last page and add them instead
          if (termsLeft % 20 !== 0) {
            showLimit = termsLeft % 20
          }

          await this.getTerms({
            field: sortedBy,
            startAfter: findBeforeAfter(terms, sortedBy, 'after'),
            limit,
            showLimit,
          })
        }
      }

      globalService.send('LOAD_COMPLETE')
      this.setCurrentPage(pageNumber)
    },
    async search(search: string) {
      globalService.send('LOAD_START')

      await this.getTerms({
        field: this.sortedBy,
        search,
      })

      globalService.send('LOAD_COMPLETE')
    },
    async sort(field?: FieldNameType) {
      globalService.send('LOAD_START')
      await this.getTerms({ field })
      globalService.send('LOAD_COMPLETE')
      this.setSortedBy(field)
      this.setCurrentPage(1)
    },
    setSortedBy(sortedBy?: FieldNameType) {
      this.sortedBy = sortedBy ?? 'term'
    },
    setCurrentPage(page: number) {
      this.currentPage = page
    },
    setTotal(total: number) {
      this.totalRows = total
    },
  },
})

const findBeforeAfter = (
  terms: Map<string, TermType>,
  sortedBy: FieldNameType,
  mode: 'before' | 'after'
): string | undefined => {
  const termsArray = Array.from(terms.values())
  // Return first if before, last if after
  return termsArray.at(mode === 'before' ? 0 : -1)?.[sortedBy]
}
