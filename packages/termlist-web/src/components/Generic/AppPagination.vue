<template>
  <nav class="pagination is-centered" role="navigation" aria-label="pagination">
    <a
      :disabled="firstpage == currentpage"
      class="pagination-previous"
      @click="previous"
    >{{ ui.previous }}</a>
    <a :disabled="lastpage == currentpage" class="pagination-next" @click="next">{{ ui.next }}</a>
    <ul class="pagination-list">
      <li v-if="!(currentpage < firstpage + 1)">
        <a
          :aria-label="ui.gotopage + ' ' + firstpage"
          class="pagination-link"
          @click="clickPage"
        >{{ firstpage }}</a>
      </li>
      <li v-if="!(currentpage - 2 <= firstpage)">
        <span class="pagination-ellipsis">&hellip;</span>
      </li>
      <li v-if="!(currentpage < firstpage + 2)">
        <a
          :aria-label="ui.gotopage + ' ' + (currentpage - 1)"
          class="pagination-link"
          @click="clickPage"
        >{{ currentpage - 1 }}</a>
      </li>
      <li>
        <a
          :aria-label="ui.pagenumber + ' ' + currentpage"
          class="pagination-link is-current"
          aria-current="page"
        >{{ currentpage }}</a>
      </li>
      <li v-if="!(currentpage > lastpage - 2)">
        <a
          :aria-label="ui.gotopage + ' ' + (currentpage + 1)"
          class="pagination-link"
          @click="clickPage"
        >{{ currentpage + 1 }}</a>
      </li>
      <li v-if="!(currentpage + 2 >= lastpage)">
        <span class="pagination-ellipsis">&hellip;</span>
      </li>
      <li v-if="!(currentpage > lastpage - 1)">
        <a
          :aria-label="ui.gotopage + ' ' + lastpage"
          class="pagination-link"
          @click="clickPage"
        >{{ lastpageNumber }}</a>
      </li>
    </ul>
  </nav>
</template>
<script>
export default {
  props: {
    ui: {
      type: Object,
      required: true
    },
    currentpage: {
      type: Number,
      required: true
    },
    firstpage: {
      type: Number,
      default: 1
    },
    lastpage: {
      type: Number,
      required: true
    }
  },
  computed: {
    lastpageNumber() {
      if (isNaN(this.lastpage)) {
        return ' '
      } else {
        return this.lastpage
      }
    }
  },
  methods: {
    previous(e) {
      this.$emit('goto', e)
      this.gotoPage(this.currentpage - 1)
    },
    next(e) {
      this.$emit('goto', e)
      this.gotoPage(this.currentpage + 1)
    },
    clickPage(e) {
      this.gotoPage(Number(e.target.textContent))
    },
    gotoPage(pageNumber) {
      this.$emit('gotopage', pageNumber)
    }
  }
}
</script>
