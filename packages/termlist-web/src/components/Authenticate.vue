<template>
  <div
    id="firebaseui-auth-container"
    :class="{ modal: true, 'is-active': !$store.state.auth.authenticated }"
  >
    <div class="modal-background" />
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import firebase from 'firebase/app'
import 'firebase/auth'
import * as firebaseui from 'termlist-auth-ui'

export default Vue.extend({
  components: {},
  props: {
    ui: {
      type: Object,
      required: true,
    },
  },
  data(): {
    uiConfig: firebaseui.auth.Config
    uiLogin: firebaseui.auth.AuthUI | null
  } {
    return {
      uiConfig: {
        callbacks: {
          signInSuccessWithAuthResult() {
            return false
          },
        },
        credentialHelper: firebaseui.auth.CredentialHelper.NONE,
        signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
      },
      uiLogin: null,
    }
  },
  mounted() {
    if (firebaseui.auth.AuthUI.getInstance()) {
      this.uiLogin = firebaseui.auth.AuthUI.getInstance()
    } else {
      this.uiLogin = new firebaseui.auth.AuthUI(firebase.auth())
    }
    if (this.uiLogin) {
      this.uiLogin.reset()
      this.uiLogin.start('#firebaseui-auth-container', this.uiConfig)
    }
  },
  methods: {
    logOut() {
      firebase.auth().signOut()
      if (this.uiLogin) {
        this.uiLogin.start('#firebaseui-auth-container', this.uiConfig)
      }
    },
  },
})
</script>
<style></style>
