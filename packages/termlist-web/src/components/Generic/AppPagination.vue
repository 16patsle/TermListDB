<template>
  <nav class="pagination is-centered" role="navigation" aria-label="pagination">
    <a :disabled="cannotGoBack" class="pagination-previous" @click="previous">{{
      ui.previous
    }}</a>
    <a :disabled="cannotGoForward" class="pagination-next" @click="next">{{
      ui.next
    }}</a>
    <ul class="pagination-list">
      <li v-if="!(currentpage < firstpage + 1)">
        <a
          :aria-label="ui.gotopage + ' ' + firstpage"
          class="pagination-link"
          @click="clickPage"
          >{{ firstpage }}</a
        >
      </li>
      <li v-if="!(currentpage - 2 <= firstpage)">
        <span class="pagination-ellipsis">&hellip;</span>
      </li>
      <li v-if="!(currentpage < firstpage + 2)">
        <a
          :aria-label="ui.gotopage + ' ' + (currentpage - 1)"
          class="pagination-link"
          @click="clickPage"
          >{{ currentpage - 1 }}</a
        >
      </li>
      <li>
        <a
          :aria-label="ui.pagenumber + ' ' + currentpage"
          :disabled="onlyOnePage"
          class="pagination-link is-current"
          aria-current="page"
          >{{ currentpage }}</a
        >
      </li>
      <li v-if="!(currentpage > lastpage - 2)">
        <a
          :aria-label="ui.gotopage + ' ' + (currentpage + 1)"
          class="pagination-link"
          @click="clickPage"
          >{{ currentpage + 1 }}</a
        >
      </li>
      <li v-if="!(currentpage + 2 >= lastpage)">
        <span class="pagination-ellipsis">&hellip;</span>
      </li>
      <li v-if="!(currentpage > lastpage - 1)">
        <a
          :aria-label="ui.gotopage + ' ' + lastpage"
          class="pagination-link"
          @click="clickPage"
          >{{ lastpageNumber }}</a
        >
      </li>
    </ul>
  </nav>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import ui from '../../assets/ui'

const props = withDefaults(
  defineProps<{
    currentpage: number
    firstpage?: number
    lastpage: number
  }>(),
  {
    firstpage: 1,
  }
)

const emit = defineEmits<{
  (e: 'goto', event: MouseEvent): void
  (e: 'gotopage', pageNumber: number): void
}>()

const lastpageNumber = computed((): string => {
  if (isNaN(props.lastpage)) {
    return ' '
  } else {
    return String(props.lastpage)
  }
})

const cannotGoBack = computed(() =>
  props.currentpage == props.firstpage ? true : null
)
const cannotGoForward = computed(() =>
  props.currentpage == props.lastpage ? true : null
)
const onlyOnePage = computed(() =>
  props.currentpage == props.firstpage && props.currentpage == props.lastpage
    ? true
    : null
)

const previous = (e: MouseEvent): void => {
  if (cannotGoBack.value) {
    return
  }
  emit('goto', e)
  gotoPage(props.currentpage - 1)
}

const next = (e: MouseEvent): void => {
  if (cannotGoForward.value) {
    return
  }
  emit('goto', e)
  gotoPage(props.currentpage + 1)
}

const clickPage = (e: MouseEvent): void => {
  gotoPage(Number((e.target as Element).textContent))
}

const gotoPage = (pageNumber: number): void => {
  emit('gotopage', pageNumber)
}
</script>

<style lang="scss">
@import 'bulma/sass/utilities/controls';
@import 'bulma/sass/utilities/extends';
@import 'bulma/sass/components/pagination';
</style>
