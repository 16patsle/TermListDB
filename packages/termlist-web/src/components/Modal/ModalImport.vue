<template>
  <AppModal
    ref="modal"
    :title="ui.importTerms"
    :callback="importTerm"
    :close-callback="close"
    :ok-text="ui.save"
    :cancel-text="ui.cancel"
  >
    <template #modal-body>
      <p class="subtitle">
        {{ ui.trelloImportInstructions }}
      </p>
      <div class="field">
        <div class="control">
          <div class="file is-centered has-name is-boxed">
            <label class="file-label">
              <input
                ref="importFile"
                class="file-input"
                type="file"
                accept="application/json"
                @change="handleFiles"
              />
              <span class="file-cta">
                <span class="file-icon">
                  <i class="fa fa-upload" />
                </span>
                <span class="file-label">{{ ui.browseForFile }}</span>
              </span>
              <span v-if="fileInfo" class="file-name">{{ fileInfo }}</span>
            </label>
          </div>
        </div>
      </div>
    </template>
    <template #modal-footer>
      <AppButton :primary="true" @click="importTerm">
        {{ ui.importTerms }}!
      </AppButton>
      <AppButton @click="close">
        {{ ui.cancel }}
      </AppButton>
    </template>
  </AppModal>
</template>
<script>
import AppModal from '../Generic/AppModal.vue'
import AppButton from '../Generic/AppButton.vue'

export default {
  components: {
    AppModal,
    AppButton,
  },
  props: {
    ui: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      selectedFile: null,
      importedFile: {},
      importedTerms: [],
    }
  },
  computed: {
    fileInfo() {
      if (this.selectedFile && this.selectedFile.name) {
        return this.selectedFile.name
      } else {
        return null
      }
    },
  },
  methods: {
    toggleModal(bool) {
      this.$refs.modal.toggleModal(bool)
    },
    confirmImportTerm() {
      this.toggleModal(true)
    },
    importTerm() {
      if (
        this.selectedFile &&
        this.selectedFile.type === 'application/json' &&
        this.selectedFile.size > 0
      ) {
        this.fileReader = new FileReader()
        this.fileReader.onload = e => {
          let file = JSON.parse(e.target.result)

          this.prepareFileImport(file)
        }
        this.fileReader.readAsText(this.selectedFile)
      }
    },
    prepareFileImport(file) {
      this.importedFile = file

      this.importedTerms = this.prepareStandardImport(this.importedFile)

      this.$emit('import', this.importedTerms)

      this.close()
    },
    prepareStandardImport(file) {
      let importedTerms = []

      for (let term of file) {
        importedTerms.push(term)
      }

      return importedTerms
    },
    close() {
      this.toggleModal(false)

      this.$refs.importFile.value = ''
      this.selectedFile = null
    },
    handleFiles(e) {
      this.selectedFile = e.target.files[0]
    },
  },
}
</script>
<style></style>
