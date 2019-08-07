import axios from 'axios';
import {BACKEND_ADDRESS} from '@/environment';

export class Account {
  public jwtToken: string | undefined;
  public user: { username: string } | undefined;
}

export class AuthClient {
  public getAccount(): Promise<Account> {
    return axios.get<Account>(BACKEND_ADDRESS + '/auth/account')
      .then(user => user.data)
      .catch((error) => {
        throw error;
      });
  }

  public signIn(data: { username: string, password: string }) {
    return axios.post<Account>(BACKEND_ADDRESS + '/auth/password/sign-in', data)
      .then(user => user.data)
      .catch((error) => {
        throw error;
      });
  }

  public register(data: { username: string, password: string }) {
    return axios.post<Account>(BACKEND_ADDRESS + '/auth/password/register', data)
      .then(user => user.data)
      .catch((error) => {
        throw error;
      });
  }
}