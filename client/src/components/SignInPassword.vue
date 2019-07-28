<template>
  <v-form v-model="valid" ref="form">
    <v-container>
      <v-layout column>
        <v-text-field v-model="username" :rules="usernameRules" label="Username" required>
        </v-text-field>
        <v-text-field
          v-model="password"
          :rules="passwordRules"
          label="Password"
          type="password"
          required
        >
        </v-text-field>
        <v-btn :disabled="!valid" @click="submit">submit</v-btn>
        <v-btn @click="clear">clear</v-btn>
      </v-layout>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Action } from 'vuex-class'

@Component
export default class SignInPassword extends Vue {
  @Action('signInPassword') signInPassword: ({ username, password }) => Promise<any>

  valid = false
  username = ''
  usernameRules = [(v: any) => !!v || 'Username is required']
  password = ''
  passwordRules = [(v: any) => !!v || 'Password is required']

  submit() {
    this.signInPassword({ username: this.username, password: this.password })
  }

  clear() {
    this.$refs.form.reset()
  }
}
</script>

<style scoped></style>
