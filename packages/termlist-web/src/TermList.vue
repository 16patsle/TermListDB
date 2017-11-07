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
    <tr v-for="term in terms">
      <td class="term">{{term.term}}</td>
      <td class="desc">{{term.desc}}</td>
      <td class="date">{{term.date}}</td>
      <td class="buttons"><a href="#" class="edit" @click.prevent="edit"><span class="icon is-small"><i class="fa fa-pencil"></i></span></a><a href="#" class="remove" @click.prevent="remove"><span class="icon is-small"><i class="fa fa-trash"></i></span></a></td>
</tr>
</tbody>
</table>
</span>
</template>
<script>
import SearchBar from './SearchBar.vue'

/*
var termList = new List(fields.table, {
  valueNames: ["term", "desc", "date"],
  item: '<tr><td class="term"></td><td class="desc"></td><td class="date"></td><td class="buttons"><a href="#" class="edit"><span class="icon is-small"><i class="fa fa-pencil"></i></span></a><a href="#" class="remove"><span class="icon is-small"><i class="fa fa-trash"></i></span></a></td></tr>'
});
*/

export default {
  data() {
    return {
      ui: {
        term: 'Ord',
        description: 'Forklaring',
        date: 'Dato',
      },
      terms: [{
        term: 'Ostepop',
        desc: '!',
        date: 123
      }, {
        term: 'Eplekake',
        desc: '!!',
        date: 456
      }]
    }
  },
  components: {
    SearchBar
  },
  mounted() {

    // Due to some bug in List.js, we need to pass the parent of the element.
    // The element needs the class "list" HACK
    this.list = new List(this.$refs.termlist.parentNode, {
      valueNames: ["term", "desc", "date"]
    });
  },
  methods: {
    search(searchString, columnSelect) {
      if (columnSelect === "all") {
        this.list.search(searchString);
      } else {
        this.list.search(searchString, [columnSelect]);
      }
      this.$bucket.find(searchString);
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
