import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = environment.apiURL +  'auth/';
  JwtHelper = new JwtHelperService();
  decodedToken: any;

  constructor(private http: HttpClient) {
    // const token = localStorage.getItem('token');
    // if (!this.JwtHelper.isTokenExpired(token)) {
    //   this.decodedToken  = this.JwtHelper.decodeToken(token);
    // }
  }

  login(model: any ) {
    return this.http.post(this.baseUrl + 'login', model)
      .pipe(
        map((response: any) => {
          const user = response;
          if (user) {
            localStorage.setItem('token', user.token);
            this.decodedToken  = this.JwtHelper.decodeToken(user.token);
          }
        })
      );
  }

  register(model: any ) {
    return this.http.post(this.baseUrl + 'register', model).pipe();
  }

  loggedIn() {
    const token = localStorage.getItem('token');
    return !this.JwtHelper.isTokenExpired(token);
  }

}