<template>
<div class="field is-expanded">
  <div class="control">
    <AppSelect :options="options" fullwidth="true" @change="sort"></AppSelect>
  </div>
</div>
</template>
<script>
import AppSelect from '../Generic/AppSelect.vue'

export default {
  props: ['ui', 'fields'],
  components: {
    AppSelect
  },
  computed: {
    options() {
      let optionsArray = []

      this.fields.forEach((field) => {
        if (field.type !== 'filler') {
          optionsArray.push({
            name: field.name,
            ui: this.ui.sortBy + this.ui[field.name].toLowerCase()
          })
        }
      })

      return optionsArray;
    }
  },
  methods: {
    sort(value) {
      // Search
      this.$emit('sort', value);
    }
  }
}
</script>
