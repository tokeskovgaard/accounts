import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import * as consts from '@/consts'

Vue.use(Vuex)

interface User {
  username: string
  email: string
  services: { service: string; data: object }[]
}

interface AppState {
  user: User | null
}

export const mutation = { setUser: 'setUser' }
export const action = { signInPassword: 'signInPassword' }

export default new Vuex.Store<AppState>({
  state: { user: null },
  mutations: {
    setUser(state, user) {
      state.user = user
    },
  },
  actions: {
    fetchUser({ commit }) {
      axios
        .get<User>(consts.backendAddress + '/auth/user')
        .then(user => commit(mutation.setUser, user))
        .catch(error => {
          throw error
        })
    },
    registerUser({ commit }, data: RegisterUser) {
      axios
        .post<User>(consts.backendAddress + '/auth/password/register', data)
        .then(user => commit(mutation.setUser, user))
        .catch(error => {
          throw error
        })
    },
    signInPassword({ commit }, data: AuthenticateUser) {
      axios
        .post<User>(consts.backendAddress + '/auth/password', data)
        .then(user => commit(mutation.setUser, user))
        .catch(error => {
          throw error
        })
    },
  },
})

export interface AuthenticateUser {
  username: string
  password: string
  email: string
}

export interface RegisterUser {
  username: string
  password: string
  email: string
}
