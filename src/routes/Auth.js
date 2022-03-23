import { store, clearStore } from './Store';
import axios from 'axios';

class Auth {
  constructor() {
    // 5 mins = 300000 milliseconds
    // 10 mins = 600000 milliseconds
    this.authenticated = true;
    this.token = localStorage.getItem('token');
    const tokena = localStorage.getItem('token');
    const lastAccessTime = localStorage.getItem('lat');
    const timeNow = Date.now(); // Unix timestamp in milliseconds
    if (timeNow - lastAccessTime > 200000) {
      //clearStore()
      //this.authenticated = false
      console.log('You have been inactive for 5 mins, login again');
    } else {
      localStorage.setItem('lat', timeNow);
    }
    if (tokena == null) {
      clearStore();
      this.authenticated = false;
      console.log('LoggedIn is :', this.authenticated);
    }
  }

  isAuthenticated() {
    console.log('LoggedIn is :', this.token);
    return this.authenticated;
  }

  requestHeader() {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: 'Bearer ' + token,
        'access-token': token,
        Token: token,
      },
    };
    console.log(config);
    return 'Bearer ' + token;
  }
}

export default new Auth();
