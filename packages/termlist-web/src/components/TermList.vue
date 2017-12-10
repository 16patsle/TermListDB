<template>
<span>
<SearchBar :ui="ui" :fields="fields" @search="search"></SearchBar>
<AppPagination :ui="ui" :firstpage="1" :currentpage="currentPage" :lastpage="Math.ceil($store.state.totalRows/20)" @gotopage="gotoPage"></AppPagination>
<table class="table is-fullwidth">
  <thead>
    <tr>
      <th v-for="field in fields">{{ui[field.name]}}</th>
      <th></th>
    </tr>
  </thead>
  <tbody class="list" ref="termlist">
    <TermRow v-for="term in terms" :md="utils.md" :key="term._id" :ui="ui" :term="term" :fields="fields" @edit="edit" @remove="remove"></TermRow>
</tbody>
</table>
<AppPagination :ui="ui" :firstpage="1" :currentpage="currentPage" :lastpage="Math.ceil($store.state.totalRows/20)" @gotopage="gotoPage"></AppPagination>
</span>
</template>
<script>
import SearchBar from './TermList/SearchBar.vue'
import TermRow from './TermList/TermRow.vue'
import AppPagination from './Generic/AppPagination.vue'

export default {
  props: ['utils', 'ui', 'terms', 'fields'],
  components: {
    SearchBar,
    TermRow,
    AppPagination
  },
  data() {
    return {
      currentPage: 1
    }
  },
  methods: {
    search(search) {
      this.$store.dispatch('find', search);
    },
    edit(term) {
      this.$emit('edit', term);
    },
    remove(term) {
      this.$emit('remove', term);
    },
    gotoPage(pageNumber) {
      if (pageNumber < this.currentPage) {
        this.$emit('gotopage', pageNumber - 1, true);
      } else {
        this.$emit('gotopage', pageNumber - this.currentPage);
      }
      this.currentPage = pageNumber;
    }
  }
}
</script>
