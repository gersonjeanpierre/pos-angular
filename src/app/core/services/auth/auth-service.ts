import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LoginForm } from '@core/models/interfaces/login-form.model';
import { User } from '@core/models/interfaces/user.model';
import { Observable, of, tap } from 'rxjs';
import { LocalKey } from '@core/enums/local-key.enum';
import { UserRole } from '@core/enums/user-role.enum';
import { ENV } from '@env/environment.dev';
import { LoginResponse } from '@core/models/interfaces/login-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  private http = inject(HttpClient);

  private userSignal = signal<User | null>(null);
  private isLoadingSignal = signal<boolean>(false);

  user = this.userSignal.asReadonly();
  isLoading = this.isLoadingSignal.asReadonly();
  isAuthenticated = computed(
    () => !!this.userSignal()
  )
  userRoles = computed(
    () => this.userSignal()?.roles || []
  )

  constructor() {
    this.initializeAuth()
  }

  private initializeAuth(): void {
    const token = this.getToken();
    const userData = this.getUserData();

    if (token && userData) {
      try {
        console.log('Initializing auth with token and user data');
        this.userSignal.set(userData);
      } catch (error) {
        console.error('Error initializing auth:', error);
        this.clearAuthData();
      }
    }
  }

  login(credentials: LoginForm): Observable<LoginResponse> {
    this.isLoadingSignal.set(true);

    return this.http.post<LoginResponse>(`${ENV.API_URL}/auth/login`, credentials)
      .pipe(
        tap({
          next: (response) => {
            this.setAuthData(response.token, response.user);
            this.isLoadingSignal.set(false);
          },
          error: () => {
            this.isLoadingSignal.set(false);
          }
        })
      );
  }

  logout(): void {
    this.clearAuthData();
    this.router.navigateByUrl('/login');
  }

  hasRole(role: UserRole | string): boolean {
    const currentRoles = this.userRoles();
    return currentRoles.includes(role);
  }

  hasAnyRole(roles: UserRole[] | string[]): boolean {
    const currentRoles = this.userRoles();
    return roles.some(role => currentRoles.includes(role));
  }

  hasAllRoles(roles: UserRole[] | string[]): boolean {
    const currentRoles = this.userRoles();
    return roles.every(role => currentRoles.includes(role));
  }

  getToken(): string | null {
    return localStorage.getItem(LocalKey.TOKEN_KEY)
  }

  getUserData(): User | null {
    const user: User = JSON.parse(localStorage.getItem(LocalKey.USER_KEY) || 'null');
    if (!user) return null;
    return user;
  }

  private setAuthData(token: string, user: User): void {
    localStorage.setItem(LocalKey.TOKEN_KEY, token);
    localStorage.setItem(LocalKey.USER_KEY, JSON.stringify(user));
  }

  private clearAuthData(): void {
    localStorage.removeItem(LocalKey.TOKEN_KEY);
    localStorage.removeItem(LocalKey.USER_KEY);
  }

  // Método para verificar si el token sigue siendo válido
  validateToken(): Observable<boolean> {
    const token = this.getToken();
    if (!token) {
      return of(false);
    }
    return this.http.get(`${ENV.API_URL}/auth/validate`)
      .pipe(
        tap({
          next: (response: any) => {
            console.log('Token validation response:', response);
            if (!response.valid) {
              this.clearAuthData();
            }
          },
          error: () => {
            this.clearAuthData();
          }
        })
      );
  }

}
