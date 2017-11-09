<template>
<span>
<SearchBar :ui="ui" :fields="fields" @search="search"></SearchBar>
<table class="table is-fullwidth">
  <thead>
    <tr>
      <th v-for="field in fields">{{ui[field.name]}}</th>
    </tr>
  </thead>
  <tbody class="list" ref="termlist">
    <TermRow v-for="term in terms" :key="term._id" :term="term" :fields="fields" @edit="edit" @remove="remove"></TermRow>
</tbody>
</table>
</span>
</template>
<script>
import SearchBar from './TermList/SearchBar.vue'
import TermRow from './TermList/TermRow.vue'

export default {
  props: ['ui', 'terms', 'fields'],
  components: {
    SearchBar,
    TermRow
  },
  methods: {
    search(searchString, columnSelect) {
      if (columnSelect === "all") {
        //this.list.search(searchString);
      } else {
        //this.list.search(searchString, [columnSelect]);
      }
      //this.$bucket.find(searchString);
      this.$store.dispatch('find', searchString, columnSelect);
    },
    edit(term) {
      this.$emit('edit', term);
    },
    remove(term) {
      this.$emit('remove', term);
    }
  }
}
</script>
