<template>
<Modal ref="modal" :title="ui.importTerms" :callback="importTerm" :closeCallback="close" :ok-text="ui.save" :cancel-text="ui.cancel">
  <div slot="modal-body">
    <p class="subtitle">{{ui.trelloImportInstructions}}</p>
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
                {{ui.browseForFile}}
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
    },
    confirmImportTerm() {
      this.toggleModal(true);
    },
    importTerm() {
      if (this.selectedFile && this.selectedFile.type === 'application/json' && this.selectedFile.size > 0) {
        this.fileReader = new FileReader();
        this.fileReader.onload = (e) => {
          let file = JSON.parse(e.target.result)

          this.prepareFileImport(file)
        }
        this.fileReader.readAsText(this.selectedFile)
      }
    },
    prepareFileImport(file) {
      // Look for Trello import
      if (file.idOrganization && file.name && file.invited) {
        this.importedFile = {
          lists: file.lists,
          cards: file.cards
        };

        this.importedTerms = this.prepareTrelloImport(this.importedFile)
      } else {
        this.importedFile = file

        this.importedTerms = this.prepareStandardImport(this.importedFile)
      }

      this.$emit('import', this.importedTerms);

      this.close();
    },
    prepareTrelloImport(file) {
      let importedTerms = []
      let listObject = {}

      for (let list of file.lists) {
        this.$set(listObject, list.id, list.name);
      }

      for (let card of file.cards) {
        let term = {};
        term.term = card.name;
        term.desc = card.desc;
        term.date = new Date(card.dateLastActivity).toJSON();

        switch (listObject[card.idList]) {
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

        importedTerms.push(term);
      }

      return importedTerms
    },
    prepareStandardImport(file) {
      let importedTerms = []

      for (let term of file) {
        importedTerms.push(term);
      }

      return importedTerms
    },
    close() {
      this.toggleModal(false);

      this.$refs.importFile.value = '';
      this.selectedFile = null;
    },
    handleFiles(e) {
      this.selectedFile = e.target.files[0];
    }
  }
}
</script>
<style>

</style>
