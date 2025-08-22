// ... (mismas importaciones, sin cambios)
import { asyncScheduler, BehaviorSubject, Observable, scheduled, throwError } from 'rxjs';
import { tap, catchError, map, switchMap, finalize } from 'rxjs/operators';
import { LocalKey } from '@core/enums/local-key.enum';
import { LoginResponse } from '@core/models/interfaces/login-response.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LoginForm } from '@core/models/interfaces/login-form.model';
import { User } from '@core/models/interfaces/user.model';
import { UserRole } from '@core/enums/user-role.enum';
import { ENV } from '@env/environment.dev';
import { of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  private http = inject(HttpClient);

  private userSignal = signal<User | null>(this.getUserData());
  private isLoadingSignal = signal<boolean>(false);
  private isRefreshing = new BehaviorSubject<boolean>(false); // Nuevo para manejar el estado de refresco

  user = this.userSignal.asReadonly();
  isLoading = this.isLoadingSignal.asReadonly();
  isAuthenticated = computed(() => !!this.userSignal());
  userRoles = computed(() => this.userSignal()?.roles || []);

  constructor() { }

  login(credentials: LoginForm): Observable<LoginResponse> {
    this.isLoadingSignal.set(true);
    return this.http.post<LoginResponse>(`${ENV.API_URL}/auth/login`, credentials)
      .pipe(
        tap((response) => {
          this.setAuthData(response.accessToken, response.refreshToken, response.user);
          this.userSignal.set(response.user);
          this.isLoadingSignal.set(false);
        }),
        catchError((error: HttpErrorResponse) => {
          this.isLoadingSignal.set(false);
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    this.clearAuthData();
    this.userSignal.set(null);
    this.router.navigateByUrl('/login');
  }

  hasRole(role: UserRole | string): boolean {
    return this.userRoles().includes(role);
  }

  hasAnyRole(roles: UserRole[] | string[]): boolean {
    return roles.some(role => this.userRoles().includes(role));
  }

  hasAllRoles(roles: UserRole[] | string[]): boolean {
    return roles.every(role => this.userRoles().includes(role));
  }

  // Métodos de almacenamiento ahora manejan ambos tokens
  private setAuthData(accessToken: string, refreshToken: string, user: User): void {
    localStorage.setItem(LocalKey.TOKEN_KEY, accessToken);
    localStorage.setItem(LocalKey.REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(LocalKey.USER_KEY, JSON.stringify(user));
  }

  private clearAuthData(): void {
    localStorage.removeItem(LocalKey.TOKEN_KEY);
    localStorage.removeItem(LocalKey.REFRESH_TOKEN_KEY);
    localStorage.removeItem(LocalKey.USER_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(LocalKey.TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(LocalKey.REFRESH_TOKEN_KEY);
  }

  getUserData(): User | null {
    const user = localStorage.getItem(LocalKey.USER_KEY);
    if (!user) {
      return null;
    }
    try {
      return JSON.parse(user);
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      this.clearAuthData();
      return null;
    }
  }

  // Nuevo método para refrescar el token
  refreshToken(): Observable<any> {
    this.isRefreshing.next(true);
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      this.isRefreshing.next(false);
      this.logout();
      return throwError(() => 'No refresh token available');
    }

    return this.http.post(`${ENV.API_URL}/auth/refresh-token`, { refreshToken })
      .pipe(
        tap((response: any) => {
          // Guardar los nuevos tokens y el usuario
          this.setAuthData(response.accessToken, response.refreshToken, response.user);
          this.userSignal.set(response.user);
        }),
        finalize(() => {
          this.isRefreshing.next(false);
        }),
        catchError((error) => {
          this.logout();
          return throwError(() => error);
        })
      );
  }

  validateToken(): Observable<boolean> {
    const token = this.getToken();
    const refreshToken = this.getRefreshToken();

    // Si no hay token de acceso ni de refresco, el usuario no está autenticado
    if (!token && !refreshToken) {
      this.clearAuthData();
      this.userSignal.set(null);
      console.log('No access or refresh token found, user is not authenticated', scheduled([false], asyncScheduler));
      return scheduled([false], asyncScheduler);
      // return of(false);
    }

    // Si hay token de acceso, valida con el backend
    if (token) {
      return this.http.get<{ valid: boolean }>(`${ENV.API_URL}/auth/validate`)
        .pipe(
          map(response => response.valid),
          catchError((error) => {
            // Si el access token no es válido, intenta con el refresh token
            if (error.status === 401 && refreshToken) {
              return this.refreshToken().pipe(
                map(() => true), // Si el refresh token funciona, la validación es exitosa
                catchError(() => scheduled([false], asyncScheduler)) // Si el refresh token falla, la validación es falsa
              );
            }
            this.clearAuthData();
            this.userSignal.set(null);
            return scheduled([false], asyncScheduler);
          })
        );
    } else {
      // Si no hay access token pero sí hay refresh token, intenta refrescarlo
      if (refreshToken) {
        return this.refreshToken().pipe(
          map(() => true),
          catchError(() => scheduled([false], asyncScheduler))
        );
      }
      return scheduled([false], asyncScheduler);
    }
  }
}