<template>
<Modal ref="modal" :title="ui.importTerms" :closeCallback="close" :ok-text="null" :cancel-text="ui.cancel">
  <div slot="modal-body">
    <p class="subtitle">{{ui.processingImport}}</p>
    <div class="field">
      <div class="control">
        <progress class="progress is-primary" :value="$store.state.imports.imported" :max="$store.state.imports.total">{{ Math.round($store.state.imports.imported / $store.state.imports.total * 100) }}%</progress>
        <p class="has-text-centered">{{ $store.state.imports.imported }} / {{ $store.state.imports.total }}</p>
        <p class="has-text-centered">{{ Math.round($store.state.imports.imported / $store.state.imports.total * 100) }}%</p>
      </div>
    </div>
  </div>
</Modal>
</template>
<script>
import Modal from './Modal.vue';
import AppButton from '../Generic/AppButton.vue';

export default {
  components: {
    Modal,
    AppButton
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
  methods: {
    toggleModal(bool) {
      this.$refs.modal.toggleModal(bool);
    },
    close() {
      this.toggleModal(false);

      this.$store.commit('cancelImport');
    }
  },
  mounted() {
    this.$watch(() => this.$store.state.imports.finished, value => {
      if (!value) {
        this.toggleModal(true)
      } else {
        this.toggleModal(false)
      }
    }, {
      immediate: true
    })
  }
}
</script>
<style>

</style>
