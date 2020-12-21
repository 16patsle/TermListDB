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
<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import AppModal from '../Generic/AppModal.vue'

import type { Store } from 'vuex'
import type { StateType } from '../../types/StateType'

const ModalImportingProps = Vue.extend({
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
  },
})
export default class ModalImporting extends ModalImportingProps {
  $refs!: {
    modal: AppModal
  }
  $store!: Store<StateType>

  mounted(): void {
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
