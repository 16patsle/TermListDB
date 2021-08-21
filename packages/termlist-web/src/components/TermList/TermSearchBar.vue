<template>
  <div class="field has-addons">
    <div class="control is-expanded has-icons-left">
      <input
        ref="searchBar"
        :placeholder="ui.search"
        class="input searchfield"
        type="text"
        @keyup="search"
      />
      <span class="icon is-small is-left">
        <!--<i class="fa fa-search" />-->
      </span>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'

import ui from '../../assets/ui'

import type { TermQueryType } from '../../types/TermQueryType'

export default defineComponent({
  emits: {
    search(payload: TermQueryType) {
      return typeof payload.search === 'string'
    },
  },
  setup() {
    const searchBar = ref<InstanceType<typeof HTMLInputElement>>()

    return {
      ui,
      searchBar,
    }
  },
  methods: {
    search(): void {
      // Search
      this.$emit('search', {
        search: this.searchBar?.value,
      })
    },
  },
})
</script>
