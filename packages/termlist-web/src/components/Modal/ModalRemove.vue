<template>
  <AppModal
    ref="modal"
    :title="ui.removeterm"
    :callback="removeTerm"
    :ok-text="ui.save"
    :cancel-text="ui.cancel"
  >
    <template v-slot:modal-body>
      <p class="subtitle">
        {{ ui.wanttoremove }}
      </p>
      <p>{{ current.term }}</p>
    </template>
    <template v-slot:modal-footer>
      <AppButton :danger="true" @click="removeTerm">
        {{ ui.removeterm }}!
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
      current: {
        term: ''
      }
    }
  },
  methods: {
    toggleModal(bool) {
      this.$refs.modal.toggleModal(bool)
    },
    confirmRemoveTerm(current) {
      this.current = current
      this.toggleModal(true)
    },
    removeTerm() {
      this.$emit('remove', this.current)
      this.toggleModal(false)
    },
    close() {
      this.toggleModal(false)
    }
  }
}
</script>
<style></style>
