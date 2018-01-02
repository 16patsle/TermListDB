<template>
<Modal ref="modal" :class="{'is-active':!$store.state.imports.finished}" :title="ui.exportTerms" :closeCallback="close" :ok-text="null" :cancel-text="null">
  <div slot="modal-body">
    <p class="subtitle">{{exportInstructions}}</p>
    <a :href="exportURI" class="button is-primary" :disabled="!exported" download="terms.json" @click="downloadExport">{{ui.download}}</a>
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
      exportURI: null
    }
  },
  computed: {
    exportInstructions() {
      if (this.exported) {
        return this.ui.downloadExportInstructions
      } else {
        return this.ui.processingExport
      }
    },
    exported() {
      return Boolean(this.exportURI)
    }
  },
  methods: {
    toggleModal(bool) {
      this.$refs.modal.toggleModal(bool);
    },
    confirmExportTerm() {
      this.toggleModal(true);

      this.exportTerms()
    },
    close() {
      this.toggleModal(false);

      this.exportURI = null;
    },
    async exportTerms() {
      const terms = await this.$store.dispatch('exportTerms')

      let exported = []

      for (let term of terms.docs) {
        exported.push({
          _id: term._id,
          term: term.term,
          desc: term.desc,
          date: term.date,
          type: term.type
        })
      }

      this.exportURI = 'data:application/json;charset=utf-8, ' + encodeURIComponent(JSON.stringify(exported))
    },
    downloadExport(e) {
      if (!this.exported) {
        e.preventDefault();
      } else {
        //this.exportURI = 'data:application/octet-stream,field1%2Cfield2%0Afoo%2Cbar%0Agoo%2Cgai%0A'
      }
    }
  }
}
</script>
<style>

</style>
