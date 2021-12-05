<template>
  <AppModal :is-active="true" :title="ui.logIn" :close-allowed="false">
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
import { ref } from 'vue'
import { AuthError, getAuth, signInWithEmailAndPassword } from '@firebase/auth'
import AppModal from '../Generic/AppModal.vue'
import AppButton from '../Generic/AppButton.vue'
import { firebaseApp } from '../../utils/initializeFirebase'

import ui from '../../assets/ui'

const auth = getAuth(firebaseApp)

const email = ref('')
const password = ref('')
const error = ref('')

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
