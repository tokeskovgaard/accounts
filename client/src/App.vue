<template>
  <v-app>
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm6 md3 elevation-12 class="pa-4">
            <router-view />
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Action } from 'vuex-class'

@Component()
export default class App extends Vue {
  @Action('fetchUser') fetchUser: any

  mounted() {
    this.fetchUser()
  }
}
</script>
