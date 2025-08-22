import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@core/services/auth/auth-service';
import { map, catchError } from 'rxjs/operators';
import { asyncScheduler, of, scheduled } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si no hay token, redirige
  const token = authService.getToken();
  if (!token) {
    router.navigateByUrl('/login');
    return false;
  }
  // Valida el token con el backend
  return authService.validateToken().pipe(
    map((valid: any) => {
      // Si la respuesta es un objeto con { valid: true }
      if (valid && valid.valid !== false) {
        return true;
      }
      router.navigateByUrl('/login');
      return false;
    }),
    catchError(() => {
      router.navigateByUrl('/login');
      return scheduled([false], asyncScheduler);
    })
  );
};