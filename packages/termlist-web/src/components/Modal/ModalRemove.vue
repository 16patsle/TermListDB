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
      <AppButton :danger="true" @click="removeTerm">
        {{ ui.removeterm }}!
      </AppButton>
      <AppButton @click="close">
        {{ ui.cancel }}
      </AppButton>
    </template>
  </AppModal>
</template>
<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import AppModal from '../Generic/AppModal.vue'
import AppButton from '../Generic/AppButton.vue'
import type { TermType } from '../../types/TermType'

const ModalRemoveProps = Vue.extend({
  props: {
    ui: {
      type: Object,
      required: true,
    },
  },
})

@Component({
  components: {
    AppModal,
    AppButton,
  },
})
export default class ModalRemove extends ModalRemoveProps {
  $refs!: {
    modal: AppModal
  }

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
