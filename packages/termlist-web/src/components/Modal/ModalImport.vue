<template>
<Modal ref="modal" :title="ui.importTerms" :callback="importTerm" :ok-text="ui.save" :cancel-text="ui.cancel">
  <div slot="modal-body">
    <p class="subtitle">For å importere ord, velg en eksportfil fra Trello.</p>
    <div class="field">
      <div class="control">
        <div class="file is-centered has-name is-boxed">
          <label class="file-label">
            <input class="file-input" type="file" accept="application/json" ref="importFile" @change="handleFiles">
            <span class="file-cta">
              <span class="file-icon">
                <i class="fa fa-upload"></i>
              </span>
              <span class="file-label">
                Velg en fil…
              </span>
            </span>
            <span class="file-name" v-if="fileInfo">
              {{fileInfo}}
            </span>
          </label>
        </div>
      </div>
    </div>
  </div>
  <div slot="modal-footer">
    <AppButton :primary="true" @click="importTerm">{{ui.importTerms}}!</AppButton>
    <AppButton @click="close">{{ui.cancel}}</AppButton>
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
  computed: {
    fileInfo() {
      if (this.selectedFile && this.selectedFile.name) {
        return this.selectedFile.name
      } else {
        return null
      }
    }
  },
  methods: {
    toggleModal(bool) {
      this.$refs.modal.toggleModal(bool);

      this.$refs.importFile.value = '';
      this.selectedFile = null;
      //this.importedFile = {};
    },
    confirmImportTerm() {
      this.toggleModal(true);
    },
    importTerm() {
      if (this.selectedFile && this.selectedFile.type === 'application/json' && this.selectedFile.size > 0) {
        this.fileReader = new FileReader();
        this.fileReader.onload = (e) => {
          let file = JSON.parse(e.target.result)

          this.importedFile.lists = file.lists;
          this.importedFile.cards = file.cards;
          this.prepareFileImport()
        }
        this.fileReader.readAsText(this.selectedFile)
      }
    },
    prepareFileImport() {
      this.importedFile.listObject = {}

      for (let list of this.importedFile.lists) {
        this.$set(this.importedFile.listObject, list.id, list.name);
      }

      for (let card of this.importedFile.cards) {
        let term = {};
        term.term = card.name;
        term.desc = card.desc;
        term.date = new Date(card.dateLastActivity).toJSON();

        switch (this.importedFile.listObject[card.idList]) {
          case 'Verb':
            term.type = 'verb';
            break;
          case 'Substantiv':
            term.type = 'noun';
            break;
          case 'Adjektiv':
            term.type = 'adjective';
            break;
          case 'Uttale':
            term.type = 'pronounciation';
            break;
          default:
            break;
        }

        this.importedTerms.push(term);
      }

      this.$emit('import', this.importedTerms);

      this.toggleModal(false);
    },
    close() {
      this.toggleModal(false);
    },
    handleFiles(e) {
      this.selectedFile = e.target.files[0];
    }
  }
}
</script>
<style>

</style>
