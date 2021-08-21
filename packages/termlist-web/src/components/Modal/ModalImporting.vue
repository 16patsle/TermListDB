<template>
  <AppModal
    ref="modal"
    :title="ui.importTerms"
    :close-callback="close"
    :ok-text="null"
    :cancel-text="ui.cancel"
  >
    <template #modal-body>
      <p class="subtitle">
        {{ ui.processingImport }}
      </p>
      <div class="field">
        <div class="control">
          <progress
            :value="$store.state.storeModule.imports.imported"
            :max="$store.state.storeModule.imports.total"
            class="progress is-primary"
          >
            {{
              Math.round(
                ($store.state.storeModule.imports.imported /
                  $store.state.storeModule.imports.total) *
                  100
              )
            }}%
          </progress>
          <p class="has-text-centered">
            {{ $store.state.storeModule.imports.imported }} /
            {{ $store.state.storeModule.imports.total }}
          </p>
          <p class="has-text-centered">
            {{
              Math.round(
                ($store.state.storeModule.imports.imported /
                  $store.state.storeModule.imports.total) *
                  100
              )
            }}%
          </p>
        </div>
      </div>
    </template>
  </AppModal>
</template>
<script lang="ts">
import {Options, Vue} from 'vue-class-component'
import AppModal from '../Generic/AppModal.vue'

import type { Store } from 'vuex'
import type { StateType } from '../../types/StateType'

import ui from '../../assets/ui'

@Options({
  components: {
    AppModal,
  },
})
export default class ModalImporting extends Vue {
  $refs!: {
    modal: AppModal
  }
  $store!: Store<StateType>

  ui = ui

  mounted(): void {
    this.$watch(
      () => this.$store.state.storeModule.imports.finished,
      value => {
        if (!value) {
          this.toggleModal(true)
        } else {
          this.toggleModal(false)
        }
      },
      {
        immediate: true,
      }
    )
  }

  toggleModal(bool: boolean): void {
    this.$refs.modal.toggleModal(bool)
  }

  close(): void {
    this.toggleModal(false)

    this.$store.commit('cancelImport')
  }
}
</script>
<style></style>
