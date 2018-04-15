<template>
  <div>
    <TermSearchBar
      :ui="ui"
      :fields="fields"
      @search="search"/>
    <TermSortSelect
      :ui="ui"
      :fields="fields"
      @sort="sort"/>
    <AppPagination
      :ui="ui"
      :firstpage="1"
      :currentpage="currentPage"
      :lastpage="Math.ceil($store.state.totalRows/20)"
      @gotopage="gotoPage"/>
    <table class="table is-fullwidth is-hoverable">
      <thead>
        <tr>
          <th v-for="field in fields" :data-field="field.name || field.type">{{ ui[field.name] }}</th>
          <th data-field="buttons"/>
        </tr>
      </thead>
      <tbody
        class="list"
        ref="termlist">
        <TermRow
          v-for="term in terms"
          :md="utils.md"
          :key="term._id"
          :ui="ui"
          :term="term"
          :fields="fields"
          @show="show"
          @edit="edit"
          @remove="remove"/>
      </tbody>
    </table>
    <AppPagination
      :ui="ui"
      :firstpage="1"
      :currentpage="currentPage"
      :lastpage="Math.ceil($store.state.totalRows/20)"
      @gotopage="gotoPage"/>
  </div>
</template>
<script>
import TermSearchBar from './TermList/TermSearchBar.vue'
import TermSortSelect from './TermList/TermSortSelect.vue'
import TermRow from './TermList/TermRow.vue'
import AppPagination from './Generic/AppPagination.vue'

export default {
  components: {
    TermSearchBar,
    TermSortSelect,
    TermRow,
    AppPagination
  },
  props: {
    utils: {
      type: Object,
      required: true
    },
    ui: {
      type: Object,
      required: true
    },
    terms: {
      type: Object,
      required: true
    },
    fields: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      currentPage: 1
    }
  },
  methods: {
    search(search) {
      this.$store.dispatch('find', search)
    },
    show(term) {
      this.$emit('show', term)
    },
    edit(term) {
      this.$emit('edit', term)
    },
    remove(term) {
      this.$emit('remove', term)
    },
    gotoPage(pageNumber) {
      if (pageNumber < this.currentPage) {
        this.$emit('gotopage', pageNumber - 1, true)
      } else {
        this.$emit('gotopage', pageNumber - this.currentPage)
      }
      this.currentPage = pageNumber
    },
    sort(field) {
      this.$emit('sort', field)
      this.currentPage = 0
    }
  }
}
</script>
<style scoped>
table {
  table-layout: fixed;
}

thead th[data-field='term'] {
  width: 20%;
}
thead th[data-field='type'] {
  width: 15%;
}
thead th[data-field='date'] {
  width: 160px;
}
thead th[data-field='filler'] {
  width: 10px;
}
thead th[data-field='buttons'] {
  width: 60px;
}
</style>
