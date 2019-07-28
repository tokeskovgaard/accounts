<template>
  <v-form v-model="valid" ref="form">
    <v-container>
      <v-layout column>
        <v-text-field
          v-model="username"
          :rules="usernameRules"
          :counter="10"
          label="Username"
          required
        >
        </v-text-field>
        <v-text-field
          v-model="password"
          :rules="passwordRules"
          :counter="10"
          label="Password"
          type="password"
          required
        >
        </v-text-field>
        <v-text-field v-model="email" :rules="emailRules" label="E-mail" required></v-text-field>
        <div>
          <v-btn :disabled="!valid" @click="submit">submit</v-btn>
          <v-btn @click="clear">clear</v-btn>
        </div>
      </v-layout>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import axios from 'axios'

@Component
export default class SignUpPassword extends Vue {
  valid = false
  username = ''
  usernameRules = [
    (v: any) => !!v || 'Username is required',
    (v: any) => (v && v.length <= 10) || 'Username must be less than 10 characters',
  ]
  password = ''
  passwordRules = [
    (v: any) => !!v || 'Password is required',
    (v: any) => (v && v.length <= 10) || 'Password must be less than 10 characters',
  ]
  email = ''
  emailRules = [
    (v: any) => !!v || 'E-mail is required',
    (v: any) => /.+@.+/.test(v) || 'E-mail must be valid',
  ]

  submit() {
    axios
      .post('http://localhost:4000/auth/password', {
        username: this.username,
        password: this.password,
      })
      .then(response => console.log(response))
      .catch(error => console.error(error))
  }

  clear() {
    // this.$refs.form.reset()
  }
}
</script>

<style scoped></style>
