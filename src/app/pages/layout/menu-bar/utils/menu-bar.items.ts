import { UserRole } from '@core/enums/user-role.enum';
import { AuthService } from '@core/services/auth/auth-service';

export function getMenuItems(authService: AuthService) {
  return [
    {
      label: 'Productos',
      icon: 'pi pi-shopping-cart',
      routerLink: '/productos',
      visible: authService.isAuthenticated(),
    },
    {
      label: 'Ventas',
      icon: 'pi pi-chart-line',
      routerLink: '/ventas',
      visible: authService.hasAnyRole([UserRole.ADMIN, UserRole.MANAGER, UserRole.CASHIER]),
    },
    {
      label: 'Clientes',
      icon: 'pi pi-users',
      routerLink: '/clientes',
      visible: authService.hasAnyRole([UserRole.ADMIN, UserRole.MANAGER]),
    },
    {
      label: 'Inventario',
      icon: 'pi pi-box',
      routerLink: '/inventario',
      visible: authService.hasAnyRole([UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE]),
    },
    {
      label: 'Proveedores',
      icon: 'pi pi-truck',
      routerLink: '/proveedores',
      visible: authService.hasAnyRole([UserRole.ADMIN, UserRole.MANAGER]),
    },
    {
      label: 'Reportes',
      icon: 'pi pi-file-export',
      routerLink: '/reportes',
      visible: authService.hasRole(UserRole.ADMIN),
    },
  ];
}