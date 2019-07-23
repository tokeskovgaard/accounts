<template>
  <div class="home">
    <h1>Sign-up</h1>
    <v-icon v-on:click="signUpWithFacebook()">extension</v-icon>

    <hr />
    <SignUpPassword />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import SignUpPassword from '@/components/SignUpPassword.vue'
@Component({
  components: { SignUpPassword },
})
export default class Home extends Vue {}
</script>
