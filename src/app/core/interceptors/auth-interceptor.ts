import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../services/auth/auth-service';
import { BehaviorSubject, throwError, catchError, switchMap } from 'rxjs';
import { Router } from '@angular/router';

const isRefreshingToken = new BehaviorSubject<boolean>(false);
const refreshTokenSubject = new BehaviorSubject<any>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const addToken = (request: HttpRequest<unknown>): HttpRequest<unknown> => {
    const accessToken = authService.getToken();
    if (accessToken) {
      return request.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`
        }
      });
    }
    return request;
  };

  return next(addToken(req)).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si el error es 401 (no autorizado)
      if (error.status === 401) {
        // Evita que múltiples solicitudes intenten refrescar el token al mismo tiempo
        if (isRefreshingToken.value) {
          return refreshTokenSubject.pipe(
            switchMap(() => {
              return next(addToken(req));
            }),
            catchError(() => {
              authService.logout();
              router.navigateByUrl('/login');
              return throwError(() => error);
            })
          );
        } else {
          isRefreshingToken.next(true);
          refreshTokenSubject.next(null);

          // Intenta refrescar el token
          return authService.refreshToken().pipe(
            switchMap(() => {
              isRefreshingToken.next(false);
              return next(addToken(req)); // Vuelve a intentar la solicitud original con el nuevo token
            }),
            catchError((err) => {
              isRefreshingToken.next(false);
              authService.logout();
              router.navigateByUrl('/login');
              return throwError(() => err);
            })
          );
        }
      }
      return throwError(() => error);
    })
  );
};