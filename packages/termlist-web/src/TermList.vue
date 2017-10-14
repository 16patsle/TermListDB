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
    },
    edit(e) {
      this.$emit('edit', e);
    },
    remove(e) {
      this.$emit('remove', e);
    },
    save(term, data) {
      const current = this.list.get('term', data.term)[0];

      if (current) {
        current.values({
          term: data.term,
          desc: data.desc
        });
      } else {
        this.list.add({
          term: data.term,
          desc: data.desc,
          date: Date.now()
        });
      }
    }
  }
}
</script>
