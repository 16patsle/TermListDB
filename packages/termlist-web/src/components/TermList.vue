<template>
<span>
<SearchBar @search="search"></SearchBar>
<table class="table is-fullwidth">
  <thead>
    <tr>
      <th>{{ui.term}}</th>
      <th>{{ui.description}}</th>
      <th>{{ui.date}}</th>
      <th></th>
    </tr>
  </thead>
  <tbody class="list" ref="termlist">
    <TermRow v-for="term in terms" :key="term._id" :term="term" @edit="edit" @remove="remove"></TermRow>
</tbody>
</table>
</span>
</template>
<script>
import SearchBar from './components/SearchBar.vue'
import TermRow from './components/TermRow.vue'

export default {
  props: ['ui', 'terms'],
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
