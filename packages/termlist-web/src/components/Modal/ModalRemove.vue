<template>
  <AppModal
    ref="modal"
    :title="ui.removeterm"
    :callback="removeTerm"
    :ok-text="ui.save"
    :cancel-text="ui.cancel"
  >
    <template #modal-body>
      <p class="subtitle">
        {{ ui.wanttoremove }}
      </p>
      <p>{{ currentTerm }}</p>
    </template>
    <template #modal-footer>
      <AppButton danger @click="removeTerm">
        {{ ui.removeterm }}!
      </AppButton>
      <AppButton @click="close">
        {{ ui.cancel }}
      </AppButton>
    </template>
  </AppModal>
</template>
<script lang="ts">
import {Options, Vue} from 'vue-class-component'
import AppModal from '../Generic/AppModal.vue'
import AppButton from '../Generic/AppButton.vue'

import type { TermType } from '../../types/TermType'

import ui from '../../assets/ui'

@Options({
  components: {
    AppModal,
    AppButton,
  },
})
export default class ModalRemove extends Vue {
  $refs!: {
    modal: AppModal
  }

  ui = ui
  current: TermType | null = null

  get currentTerm(): string {
    return this.current && this.current.term ? this.current.term : ''
  }

  toggleModal(bool: boolean): void {
    this.$refs.modal.toggleModal(bool)
  }

  confirmRemoveTerm(current: TermType): void {
    this.current = current
    this.toggleModal(true)
  }

  removeTerm(): void {
    this.$emit('remove', this.current)
    this.toggleModal(false)
  }

  close(): void {
    this.toggleModal(false)
  }
}
</script>
<style></style>
