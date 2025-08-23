import { Routes } from '@angular/router';
import { Login } from 'src/app/pages/login/login';
import { Layout } from 'src/app/pages/layout/layout';
import { Products } from 'src/app/pages/products/products';
import { authGuard } from '@core/guards/auth/auth-guard';
import { activeSessionGuard } from '@core/guards/auth/active-session-guard';
import { roleGuard } from '@core/guards/auth/role-guard';
import { UserRole } from '@core/enums/user-role.enum';
import { Inventory } from '@features/inventory/inventory';
import { AccessDenied } from '@features/access-denied/access-denied';
import { Sales } from '@features/sales/sales';
import { Clients } from '@features/clients/clients';
import { Reports } from '@features/reports/reports';
import { Suppliers } from '@features/suppliers/suppliers';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    canActivate: [activeSessionGuard],
    component: Login
  },

  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      {
        path: 'productos',
        component: Products,
        canActivate: [roleGuard],
        data: { roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE] }
      },
      {
        path: 'ventas',
        component: Sales,
        canActivate: [roleGuard],
        data: { roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.CASHIER] }
      },
      {
        path: 'clientes',
        component: Clients,
        canActivate: [roleGuard],
        data: { roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE, UserRole.CASHIER] }
      },
      {
        path: 'inventario',
        component: Inventory,
        canActivate: [roleGuard],
        data: { roles: [UserRole.ADMIN, UserRole.MANAGER] }
      },
      {
        path: 'proveedores',
        component: Suppliers,
        canActivate: [roleGuard],
        data: { roles: [UserRole.ADMIN, UserRole.MANAGER] }
      },
      {
        path: 'reportes',
        component: Reports,
        canActivate: [roleGuard],
        data: { roles: [UserRole.ADMIN, UserRole.MANAGER] }
      },
      {
        path: 'acceso-denegado',
        component: AccessDenied
      },
    ]
  }
];