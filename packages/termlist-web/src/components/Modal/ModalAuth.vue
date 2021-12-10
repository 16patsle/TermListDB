<template>
  <AppModal is-active :title="ui.logIn" :close-allowed="false">
    <template #modal-body>
      <AppInputField :label="ui.email" help-danger>
        <template #control>
          <AppInput v-model="email" :danger="isEmailError" type="email" />
        </template>
        <template v-if="isEmailError" #help>
          {{ getErrorDescription(error) }}
        </template>
      </AppInputField>
      <AppInputField :label="ui.password" help-danger>
        <template #control>
          <AppInput
            v-model="password"
            :danger="Boolean(error) && !isEmailError"
            type="password"
          />
        </template>
        <template v-if="error && !isEmailError" #help>
          {{ getErrorDescription(error) }}
        </template>
      </AppInputField>
    </template>
    <template #modal-footer>
      <AppButton primary :loading="loading" @click="login">{{
        ui.logIn
      }}</AppButton>
    </template>
  </AppModal>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { AuthError, signInWithEmailAndPassword } from '@firebase/auth'
import AppModal from '../Generic/AppModal.vue'
import AppInputField from '../Generic/AppInputField.vue'
import AppInput from '../Generic/AppInput.vue'
import AppButton from '../Generic/AppButton.vue'
import { auth } from '../../utils/getAuth'

import ui from '../../assets/ui'

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const isEmailError = computed(() => error.value.includes('email'))

function isAuthError(value: unknown): value is AuthError {
  return (
    typeof value === 'object' &&
    typeof (value as AuthError).message === 'string'
  )
}

const getErrorDescription = (code: string) =>
  ui.errorDescriptions[code] ?? ui.errorDescriptions.generic + ` (${code})`

const login = async (): Promise<void> => {
  loading.value = true
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value)
  } catch (err) {
    if (isAuthError(err)) {
      error.value = err.code
    } else {
      error.value = ui.errorDescriptions.generic
    }
  }
  loading.value = false
}
</script>
