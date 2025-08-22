import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@core/services/auth/auth-service';
import { asyncScheduler, catchError, map, scheduled } from 'rxjs';

export const activeSessionGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();

  if (token) {
    return authService.validateToken().pipe(
      map(isValid => {
        if (isValid) {
          router.navigateByUrl('/productos');
          return false;
        }
        return true;
      }),
      catchError(() => {
        return scheduled([true], asyncScheduler);
      })

    );
  }


  return true;
};
