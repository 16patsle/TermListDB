<template>
  <AppModal
    ref="modal"
    :title="ui.importTerms"
    :close-callback="close"
    :ok-text="null"
    :cancel-text="ui.cancel"
  >
    <template v-slot:modal-body>
      <p class="subtitle">
        {{ ui.processingImport }}
      </p>
      <div class="field">
        <div class="control">
          <progress
            :value="$store.state.imports.imported"
            :max="$store.state.imports.total"
            class="progress is-primary"
          >
            {{
              Math.round(
                ($store.state.imports.imported / $store.state.imports.total) *
                  100
              )
            }}%
          </progress>
          <p class="has-text-centered">
            {{ $store.state.imports.imported }} /
            {{ $store.state.imports.total }}
          </p>
          <p class="has-text-centered">
            {{
              Math.round(
                ($store.state.imports.imported / $store.state.imports.total) *
                  100
              )
            }}%
          </p>
        </div>
      </div>
    </template>
  </AppModal>
</template>
<script>
import AppModal from '../Generic/AppModal.vue'

export default {
  components: {
    AppModal
  },
  props: {
    ui: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      selectedFile: null,
      importedFile: {},
      importedTerms: []
    }
  },
  mounted() {
    this.$watch(
      () => this.$store.state.imports.finished,
      value => {
        if (!value) {
          this.toggleModal(true)
        } else {
          this.toggleModal(false)
        }
      },
      {
        immediate: true
      }
    )
  },
  methods: {
    toggleModal(bool) {
      this.$refs.modal.toggleModal(bool)
    },
    close() {
      this.toggleModal(false)

      this.$store.commit('cancelImport')
    }
  }
}
</script>
<style></style>
