<template>
  <div
    id="firebaseui-auth-container"
    :class="{
      modal: true,
      'is-active': !store.state.auth.authenticated,
    }"
  >
    <div class="modal-background" />
  </div>
</template>

<script lang="ts">
export type AuthenticateMethods = {
  logOut(): void
}
</script>

<script lang="ts" setup>
import { onMounted } from 'vue'
import firebase from 'firebase/app'
import 'firebase/auth'
import * as firebaseui from '../auth-ui/esm'
import { useStore } from '../store'

const store = useStore()
const uiConfig: firebaseui.auth.Config = {
  callbacks: {
    signInSuccessWithAuthResult(): boolean {
      return false
    },
  },
  credentialHelper: firebaseui.auth.CredentialHelper.NONE,
  signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
}
let uiLogin: firebaseui.auth.AuthUI | null = null

onMounted((): void => {
  if (firebaseui.auth.AuthUI.getInstance()) {
    uiLogin = firebaseui.auth.AuthUI.getInstance()
  } else {
    uiLogin = new firebaseui.auth.AuthUI(firebase.auth())
  }
  if (uiLogin) {
    uiLogin.reset()
    uiLogin.start('#firebaseui-auth-container', uiConfig)
  }
})

const logOut = (): void => {
  firebase.auth().signOut()
  if (uiLogin) {
    uiLogin.start('#firebaseui-auth-container', uiConfig)
  }
}

defineExpose({
  logOut,
})
</script>
<style></style>
