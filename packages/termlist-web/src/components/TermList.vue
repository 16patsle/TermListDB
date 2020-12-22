<template>
  <span>
    <TermSearchBar @search="search" />
    <TermSortSelect @sort="sort" />
    <AppPagination
      :firstpage="1"
      :currentpage="currentPage"
      :lastpage="Math.ceil($store.state.storeModule.totalRows / 20)"
      @gotopage="gotoPage"
    />
    <div class="content-container">
      <AppLoading v-if="loading" class="loading-indicator" />
      <table class="table is-fullwidth is-hoverable">
        <thead>
          <tr>
            <th
              v-for="field in fields"
              :key="field.name"
              :class="field.name || field.type"
            >
              {{ ui[field.name] }}
            </th>
            <th class="row-buttons" />
          </tr>
        </thead>
        <tbody ref="termlist" class="list">
          <TermRow
            v-for="term in terms"
            :key="term._id"
            :term="term"
            @edit="edit"
            @remove="remove"
          />
        </tbody>
      </table>
    </div>
    <AppPagination
      :firstpage="1"
      :currentpage="currentPage"
      :lastpage="Math.ceil($store.state.storeModule.totalRows / 20)"
      @gotopage="gotoPage"
    />
  </span>
</template>
<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import TermSearchBar from './TermList/TermSearchBar.vue'
import TermSortSelect from './TermList/TermSortSelect.vue'
import TermRow from './TermList/TermRow.vue'
import AppPagination from './Generic/AppPagination.vue'
import AppLoading from './Generic/AppLoading.vue'

import type { SearchType } from '../types/SearchType'
import type { TermType } from '../types/TermType'

import ui from '../assets/ui'
import fields from '../assets/fields'

const TermListProps = Vue.extend({
  props: {
    loading: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
})

@Component({
  components: {
    TermSearchBar,
    TermSortSelect,
    TermRow,
    AppPagination,
    AppLoading,
  },
})
export default class TermList extends TermListProps {
  ui = ui
  fields = fields
  currentPage = 1

  get terms(): {
    [key: string]: TermType
  } {
    return this.$store.state.storeModule.terms
  }

  search(search: SearchType): void {
    this.$emit('search', search)
  }

  edit(term: TermType): void {
    this.$emit('edit', term)
  }

  remove(term: TermType): void {
    this.$emit('remove', term)
  }

  gotoPage(pageNumber: number): void {
    this.$emit('gotopage', pageNumber, this.currentPage)
    this.currentPage = pageNumber
  }

  sort(field: string): void {
    this.$emit('sort', field)
    this.currentPage = 1
  }
}
</script>

<style scoped>
.content-container {
  position: relative;
}

.loading-indicator {
  position: absolute;
  top: 0;
}

.table th.date {
  width: 9.6em;
}

.table th.row-buttons {
  width: 3.9em;
}
</style>
