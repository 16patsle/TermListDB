<template>
  <span>
    <TermSearchBar :ui="ui" :fields="fields" @search="search" />
    <TermSortSelect :ui="ui" :fields="fields" @sort="sort" />
    <AppPagination
      :ui="ui"
      :firstpage="1"
      :currentpage="currentPage"
      :lastpage="Math.ceil($store.state.totalRows / 20)"
      @gotopage="gotoPage"
    />
    <div class="content-container">
      <AppLoading v-if="loading" class="loading-indicator" />
      <table class="table is-fullwidth is-hoverable">
        <thead>
          <tr>
            <th v-for="field in fields" :key="field.name">
              {{ ui[field.name] }}
            </th>
            <th />
          </tr>
        </thead>
        <tbody ref="termlist" class="list">
          <TermRow
            v-for="term in terms"
            :key="term._id"
            :md="utils.md"
            :ui="ui"
            :term="term"
            :fields="fields"
            @edit="edit"
            @remove="remove"
          />
        </tbody>
      </table>
    </div>
    <AppPagination
      :ui="ui"
      :firstpage="1"
      :currentpage="currentPage"
      :lastpage="Math.ceil($store.state.totalRows / 20)"
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

const TermListProps = Vue.extend({
  props: {
    utils: {
      type: Object,
      required: true,
    },
    ui: {
      type: Object,
      required: true,
    },
    terms: {
      type: Object,
      required: true,
    },
    fields: {
      type: Array,
      required: true,
    },
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
  currentPage = 1

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
</style>
