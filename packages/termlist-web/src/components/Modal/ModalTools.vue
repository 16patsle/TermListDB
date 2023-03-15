<template>
  <AppModal is-active :title="ui.tools" @close="close">
    <template #modal-body>
      <div class="control">
        <AppButton @click="globalService.send('IMPORT')">
          {{ ui.importTerms }}
        </AppButton>
      </div>
      <div class="control">
        <AppButton @click="globalService.send('EXPORT')">
          {{ ui.exportTerms }}
        </AppButton>
      </div>
      <div class="control">
        <AppButton @click="globalService.send('DEDUPE')">
          {{ ui.checkForDuplicates }}
        </AppButton>
      </div>
    </template>
    <template #modal-footer>
      <AppButton @click="close">
        {{ ui.close }}
      </AppButton>
    </template>
  </AppModal>
</template>

<script lang="ts" setup>
import AppModal from '../Generic/AppModal.vue'
import AppButton from '../Generic/AppButton.vue'
import { globalService } from '../../machines/globalService'

import ui from '../../assets/ui'

const close = () => globalService.send('CANCEL')
</script>

<style lang="scss">
@import '@/assets/includes';
@import 'bulma/sass/form/shared';
@import 'bulma/sass/form/tools';
</style>
