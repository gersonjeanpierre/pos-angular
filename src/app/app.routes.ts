import { Routes } from '@angular/router';
import { Login } from 'src/app/pages/login/login';
import { Layout } from 'src/app/pages/layout/layout';
import { Products } from 'src/app/pages/products/products';
import { authGuard } from '@core/guards/auth/auth-guard';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      {
        path: 'productos',
        component: Products

      }
    ]
  }
];
