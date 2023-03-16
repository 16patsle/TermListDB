<template>
  <div>
    <ModalEdit v-if="showEditModal" :term="currentContext.currentTerm" />
    <ModalRemove v-if="showRemoveModal" :term="currentContext.currentTerm" />
    <ModalTools v-if="showToolsModal" />
    <ModalAuth v-if="showAuthModal" />
    <ToolModals v-if="showToolModals" />
  </div>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, ref, watch } from 'vue'
import { currentState, currentContext } from '../machines/globalService'

const ModalEdit = defineAsyncComponent(
  () => import(/* webpackPrefetch: true */ './Modal/ModalEdit.vue')
)
const ModalRemove = defineAsyncComponent(
  () => import('./Modal/ModalRemove.vue')
)
const ModalTools = defineAsyncComponent(() => import('./Modal/ModalTools.vue'))
const ModalAuth = defineAsyncComponent(
  () => import(/* webpackPreload: true */ './Modal/ModalAuth.vue')
)
const ToolModals = defineAsyncComponent(() => import('./ToolModals.vue'))

const showEditModal = computed(() => currentState.value === 'editing')
const showRemoveModal = computed(() => currentState.value === 'removing')
const showToolsModal = computed(() => currentState.value === 'viewTools')
const showAuthModal = computed(() => currentState.value === 'authenticating')
const showToolModals = ref(false)
watch(
  currentState,
  () =>
    showToolModals.value ||
    (showToolModals.value = currentState.value === 'viewTools')
)
</script>
