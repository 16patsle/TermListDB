<template>
  <tr class="term-row">
    <td
      v-for="field in fields"
      :key="field.name"
      :data-field="field.name || field.type"
      @click="show">
      <div v-html="getFieldValue(field)"/>
    </td>
    <td class="buttons">
      <TermRowButton
        icon="pencil"
        @click="edit"/>
      <TermRowButton
        icon="trash"
        @click="remove"/>
    </td>
  </tr>
</template>
<script>
import TermRowButton from './TermRowButton.vue'

export default {
  components: {
    TermRowButton
  },
  props: {
    md: {
      type: Object,
      required: true
    },
    ui: {
      type: Object,
      required: true
    },
    term: {
      type: Object,
      required: true
    },
    fields: {
      type: Array,
      required: true
    }
  },
  methods: {
    show() {
      this.$emit('show', this.term)
    },
    edit() {
      this.$emit('edit', this.term)
    },
    remove() {
      this.$emit('remove', this.term)
    },
    getFieldValue(field) {
      if (!this.term[field.name]) {
        return ''
      } else if (field.name === 'desc') {
        return this.md.render(String(this.term[field.name]))
      } else if (field.name === 'type') {
        return this.ui.wordClasses[this.term.type]
      } else if (field.name === 'date') {
        let date = new Date(this.term.date)
        return new Intl.DateTimeFormat(undefined, {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }).format(date)
      } else {
        return this.term[field.name]
      }
    }
  }
}
</script>

<style scoped>
tr.term-row td {
  white-space: pre-line;
}
tr.term-row td div {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  height: 1.5em !important;
  mask: gradient(red, blue);
  mask-image: linear-gradient(
    -45deg,
    rgba(0, 0, 0, 1) 20%,
    rgba(0, 0, 0, 0) 50%
  );
}
td[data-field='term'] {
  max-width: 20%;
}
td[data-field='type'] {
  max-width: 15%;
}
td[data-field='date'] {
  max-width: 160px;
}
td[data-field='filler'] {
  max-width: 10px;
}
td[data-field='buttons'] {
  max-width: 60px;
}
</style>
