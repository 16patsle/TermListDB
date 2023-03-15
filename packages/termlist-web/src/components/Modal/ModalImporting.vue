<template>
  <AppModal is-active :title="ui.importTerms" @close="close">
    <template #modal-body>
      <p class="subtitle">
        {{ ui.processingImport }}
      </p>
      <AppInputField>
        <progress
          :value="importStore.$state.imported"
          :max="importStore.$state.total"
          class="progress is-primary"
        >
          {{
            Math.round(
              (importStore.$state.imported / importStore.$state.total) * 100
            )
          }}%
        </progress>
        <p class="has-text-centered">
          {{ importStore.$state.imported }} /
          {{ importStore.$state.total }}
        </p>
        <p class="has-text-centered">
          {{
            Math.round(
              (importStore.$state.imported / importStore.$state.total) * 100
            )
          }}%
        </p>
      </AppInputField>
    </template>
    <template #modal-footer>
      <AppButton @click="close">
        {{ ui.cancel }}
      </AppButton>
    </template>
  </AppModal>
</template>

<script lang="ts" setup>
import AppModal from '../Generic/AppModal.vue'
import AppInputField from '../Generic/AppInputField.vue'
import AppButton from '../Generic/AppButton.vue'
import { globalService } from '@/machines/globalService'

import ui from '@/assets/ui'
import { useImportStore } from '@/stores/import'

const importStore = useImportStore()

const close = () => globalService.send('CANCEL')
</script>

<style lang="scss">
@import '@/assets/includes';
@import 'bulma/sass/elements/progress';
@import 'bulma/sass/form/shared';
@import 'bulma/sass/form/tools';
</style>
