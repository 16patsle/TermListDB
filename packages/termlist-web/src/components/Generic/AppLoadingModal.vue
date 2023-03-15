<template>
  <div class="modal is-active">
    <div class="modal-background" @click="close" />
    <div class="card">
      <header class="modal-card-head">
        <p class="modal-card-title">
          {{ ui.loading }}
        </p>
      </header>
      <section class="modal-card-body">
        <AppLoading text="" />
      </section>
      <footer class="modal-card-foot">
        <AppButton @click="close">
          {{ ui.cancel }}
        </AppButton>
      </footer>
    </div>
  </div>
</template>

<script lang="ts" setup>
import AppLoading from './AppLoading.vue'
import AppButton from './AppButton.vue'
import { globalService } from '@/machines/globalService'

import ui from '@/assets/ui'

const close = () => globalService.send('CANCEL')
</script>

<style>
.modal {
  text-align: center;
}
</style>
