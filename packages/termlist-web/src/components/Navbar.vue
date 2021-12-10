<template>
  <AppNavbar fixed="top">
    <template #brand>
      <AppNavbarItem>
        <h1 class="title">
          {{ ui.termlist }}
        </h1>
      </AppNavbarItem>
    </template>
    <template #start>
      <AppNavbarItem v-if="authenticated">
        <AppInputField grouped>
          <template #controls>
            <div class="control">
              <AppButton primary @click="globalService.send('EDIT')">
                {{ ui.add }}
              </AppButton>
            </div>
            <div class="control">
              <AppButton @click="globalService.send('VIEW_TOOLS')">
                {{ ui.tools }}
              </AppButton>
            </div>
          </template>
        </AppInputField>
      </AppNavbarItem>
    </template>
    <template #end>
      <AppNavbarItem v-if="authenticated && authStore.$state.user">
        {{ authStore.$state.user.displayName }}
      </AppNavbarItem>
      <AppNavbarItem v-if="authenticated">
        <AppButton @click="logOut">
          {{ ui.logOut }}
        </AppButton>
      </AppNavbarItem>
    </template>
  </AppNavbar>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { signOut } from 'firebase/auth'
import { useAuthStore } from '../stores/auth'
import AppButton from './Generic/AppButton.vue'
import AppNavbar from './Generic/AppNavbar.vue'
import AppNavbarItem from './Generic/AppNavbarItem.vue'
import AppInputField from './Generic/AppInputField.vue'
import ui from '../assets/ui'
import { currentState, globalService } from '../machines/globalService'
import { auth } from '../utils/getAuth'

const authStore = useAuthStore()
const authenticated = computed(() => currentState.value !== 'authenticated')

const logOut = async () => {
  await signOut(auth)
  globalService.send('LOG_OUT')
}
</script>
