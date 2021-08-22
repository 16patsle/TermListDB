<template>
  <div
    id="firebaseui-auth-container"
    :class="{
      modal: true,
      'is-active': !$store.state.auth.authenticated,
    }"
  >
    <div class="modal-background" />
  </div>
</template>
<script lang="ts">
import { Vue } from 'vue-class-component'
import firebase from 'firebase/app'
import 'firebase/auth'
import * as firebaseui from '../auth-ui/esm'

import ui from '../assets/ui'

export default class Aunthenticate extends Vue {
  ui = ui
  uiConfig: firebaseui.auth.Config = {
    callbacks: {
      signInSuccessWithAuthResult(): boolean {
        return false
      },
    },
    credentialHelper: firebaseui.auth.CredentialHelper.NONE,
    signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
  }
  uiLogin: firebaseui.auth.AuthUI | null = null

  mounted(): void {
    if (firebaseui.auth.AuthUI.getInstance()) {
      this.uiLogin = firebaseui.auth.AuthUI.getInstance()
    } else {
      this.uiLogin = new firebaseui.auth.AuthUI(firebase.auth())
    }
    if (this.uiLogin) {
      this.uiLogin.reset()
      this.uiLogin.start('#firebaseui-auth-container', this.uiConfig)
    }
  }

  logOut(): void {
    firebase.auth().signOut()
    if (this.uiLogin) {
      this.uiLogin.start('#firebaseui-auth-container', this.uiConfig)
    }
  }
}
</script>
<style></style>
