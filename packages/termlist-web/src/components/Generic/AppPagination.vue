<template>
<nav class="pagination is-centered" role="navigation" aria-label="pagination">
  <a class="pagination-previous" @click="previous">{{ ui.previous }}</a>
  <a class="pagination-next" @click="next">{{ ui.next }}</a>
  <ul class="pagination-list">
    <li v-if="!(currentpage < firstpage + 1)"><a class="pagination-link" @click="clickPage" :aria-label="ui.gotopage + ' ' + firstpage">{{firstpage}}</a></li>
    <li v-if="!(currentpage - 2 <= firstpage)"><span class="pagination-ellipsis">&hellip;</span></li>
    <li v-if="!(currentpage < firstpage + 2)"><a class="pagination-link" @click="clickPage" :aria-label="ui.gotopage + ' ' + (currentpage - 1)">{{currentpage - 1}}</a></li>
    <li><a class="pagination-link is-current" :aria-label="ui.pagenumber + ' ' + currentpage" aria-current="page">{{currentpage}}</a></li>
    <li v-if="!(currentpage > lastpage - 2)"><a class="pagination-link" @click="clickPage" :aria-label="ui.gotopage + ' ' + (currentpage + 1)">{{currentpage + 1}}</a></li>
    <li v-if="!(currentpage + 2 >= lastpage)"><span class="pagination-ellipsis">&hellip;</span></li>
    <li v-if="!(currentpage > lastpage - 1)"><a class="pagination-link" @click="clickPage" :aria-label="ui.gotopage + ' ' + lastpage">{{lastpage}}</a></li>
  </ul>
</nav>
</template>
<script>
export default {
  props: ['ui', 'currentpage', 'firstpage', 'lastpage'],
  methods: {
    previous(e) {
      this.$emit('goto', e);
      this.gotoPage(this.currentpage - 1);
    },
    next(e) {
      this.$emit('goto', e);
      this.gotoPage(this.currentpage + 1);
    },
    clickPage(e) {
      this.gotoPage(Number(e.target.textContent))
    },
    gotoPage(pageNumber) {
      this.$emit('gotopage', pageNumber);
    }
  }
}
</script>
