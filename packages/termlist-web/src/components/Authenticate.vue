<template>
  <div class="modal is-active">
    <div class="modal-background" />
    <div id="firebaseui-auth-container" />
  </div>
</template>
<script>
import firebase from 'firebase/app'
import 'firebase/auth'
import firebaseui from 'firebaseui'

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
          signInSuccessWithAuthResult() {
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
