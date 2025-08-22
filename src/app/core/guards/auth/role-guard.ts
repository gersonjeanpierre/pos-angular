import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserRole } from '@core/enums/user-role.enum';
import { AuthService } from '@core/services/auth/auth-service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRoles = route.data['roles'] as UserRole[];

  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  if (!authService.hasAnyRole(requiredRoles)) {
    router.navigateByUrl('/acceso-denegado');
    return false;
  }

  return true;
};
