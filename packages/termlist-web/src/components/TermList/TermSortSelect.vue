<template>
  <div class="field is-expanded">
    <div class="control">
      <AppSelect 
        :options="options" 
        :fullwidth="true" 
        @change="sort"/>
    </div>
  </div>
</template>
<script>
import AppSelect from '../Generic/AppSelect.vue'

export default {
  components: {
    AppSelect
  },
  props: {
    ui: {
      type: Object,
      required: true
    },
    fields: {
      type: Array,
      required: true
    }
  },
  computed: {
    options() {
      let optionsArray = []

      this.fields.forEach(field => {
        if (field.type !== 'filler') {
          optionsArray.push({
            name: field.name,
            ui: this.ui.sortBy + this.ui[field.name].toLowerCase()
          })
        }
      })

      return optionsArray
    }
  },
  methods: {
    sort(value) {
      // Sort
      this.$emit('sort', value)
    }
  }
}
</script>
