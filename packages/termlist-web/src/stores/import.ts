import { database } from '../utils/firebase'
import { globalService } from '../machines/globalService'

import { defineStore } from 'pinia'
import type { TermType } from '../types/TermType'
import { useTermsStore } from './terms'

export type State = {
  imported: number
  total: number
}

export const useImportStore = defineStore('import', {
  state: (): State => ({
    imported: 0,
    total: 0,
  }),
  actions: {
    async import(terms: TermType[]) {
      try {
        this.prepare(terms.length)

        const imports = []

        for (const term of terms) {
          if (globalService.state.value === 'importing') {
            imports.push(
              (async () => {
                const termsStore = useTermsStore()
                const added = await termsStore.add(
                  Object.assign(
                    {
                      _id: term.date,
                    },
                    term
                  )
                )
                if (added) {
                  this.imported += 1
                  if (this.imported === this.total) {
                    globalService.send('COMPLETE')
                  }
                }
              })()
            )
          }
        }

        await Promise.all(imports)
      } catch (e) {
        console.error('Error:', e, terms)
      }
    },
    async export() {
      try {
        const exported = (await database.getTerms({ limit: undefined })).map(
          term => ({
            _id: term._id,
            term: term.term,
            desc: term.desc,
            date: term.date,
            type: term.type,
          })
        )

        return (
          'data:application/json;charset=utf-8, ' +
          encodeURIComponent(JSON.stringify(exported))
        )
      } catch (e) {
        console.error('Error:', e)
      }
    },
    prepare(imports: number) {
      this.total = imports
      this.imported = 0
    },
  },
})
