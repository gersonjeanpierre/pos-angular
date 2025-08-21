import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginForm } from '@core/models/interfaces/login-form.model';
import { ENV } from '@env/environment.dev';

@Injectable({
  providedIn: 'root'
})
export class LoginUser {
  private readonly apiUrl = `${ENV.API_URL}/auth/login`;
  private http = inject(HttpClient);

  loginUser(loginFormValue: LoginForm) {
    return this.http.post(`${this.apiUrl}`, loginFormValue);
  }
}
