<template>
  <div class="modal is-active">
    <div class="modal-background"></div>
    <div id="firebaseui-auth-container"></div>
  </div>
</template>
<script>
import firebase from 'firebase/app'
import 'firebase/auth'
import firebaseui from 'firebaseui'
import secrets from '../../secrets'

export default {
  components: {},
  props: {
    ui: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      uiConfig: {
        callbacks: {
          signInSuccessWithAuthResult(authResult, redirectUrl) {
            return false
          }
        },
        credentialHelper: firebaseui.auth.CredentialHelper.NONE,
        signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID]
      }
    }
  },
  mounted() {
    if (firebaseui.auth.AuthUI.getInstance()) {
      this.uiLogin = firebaseui.auth.AuthUI.getInstance()
      this.uiLogin.reset()
    } else {
      this.uiLogin = new firebaseui.auth.AuthUI(firebase.auth())
    }
    this.uiLogin.start('#firebaseui-auth-container', this.uiConfig)
  },
  methods: {
    logOut() {
      firebase.auth().signOut()
      this.uiLogin.start('#firebaseui-auth-container', this.uiConfig)
    }
  }
}
</script>
<style></style>
