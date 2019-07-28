<template>
  <div class="home">
    <v-tabs>
      <v-tab :href="'#tab-sign-up'">Sign up</v-tab>
      <v-tab :href="'#tab-sign-in'">Sign in</v-tab>
      <v-tab-item :value="'tab-sign-up'">
        <v-card flat tile>
          <SignUpPassword />
        </v-card>
      </v-tab-item>
      <v-tab-item :value="'tab-sign-in'">
        <v-card flat tile>
          <SignInPassword />
        </v-card>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import SignUpPassword from '@/components/SignUpPassword.vue'
import SignInPassword from '@/components/SignInPassword.vue'

@Component({
  components: { SignUpPassword, SignInPassword },
})
export default class Home extends Vue {}
</script>
