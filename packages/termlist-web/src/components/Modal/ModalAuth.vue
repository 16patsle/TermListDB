<template>
  <AppModal ref="modal" :title="ui.logIn" :close-allowed="false">
    <template #modal-body>
      <div class="field">
        <label class="label">{{ ui.email }}</label>
        <div class="control">
          <input v-model="email" class="input" type="email" />
        </div>
      </div>
      <div class="field">
        <label class="label">{{ ui.password }}</label>
        <div class="control">
          <input v-model="password" class="input" type="password" />
        </div>
      </div>
    </template>
    <template #modal-footer>
      <AppButton primary @click="login">{{ ui.logIn }}</AppButton>
    </template>
  </AppModal>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { AuthError, getAuth, signInWithEmailAndPassword } from '@firebase/auth'
import AppModal, { AppModalMethods } from '../Generic/AppModal.vue'
import AppButton from '../Generic/AppButton.vue'
import { useStore } from '../../stores'
import { globalService } from '../../machines/globalService'
import { firebaseApp } from '../../utils/firebase'

import ui from '../../assets/ui'

const auth = getAuth(firebaseApp)

const store = useStore()
const modal = ref<InstanceType<typeof AppModal> & AppModalMethods>()

const email = ref('')
const password = ref('')
const error = ref('')

onMounted(() =>
  globalService.onTransition(state => {
    modal.value?.toggleModal(state.value === 'authenticating')
  })
)

function isAuthError(value: unknown): value is AuthError {
  return (
    typeof value === 'object' &&
    typeof (value as AuthError).message === 'string'
  )
}

const login = async (): Promise<void> => {
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value)
  } catch (err) {
    if (isAuthError(err)) {
      error.value = err.message
    } else {
      error.value = 'Error!'
    }
  }
}
</script>
<style></style>
