import { Component, inject, OnInit } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { AuthService } from '@core/services/auth/auth-service';
import { ButtonModule } from 'primeng/button';
import { UserRole } from '@core/enums/user-role.enum';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu-bar',
  imports: [MenubarModule, BadgeModule, AvatarModule, InputTextModule, CommonModule, ButtonModule, RouterModule],
  templateUrl: './menu-bar.html',
  styleUrl: './menu-bar.css'
})
export class MenuBar implements OnInit {
  private authService = inject(AuthService)
  items: MenuItem[] | undefined;

  isAuthenticated = this.authService.isAuthenticated;
  userRoles = this.authService.userRoles;

  ngOnInit() {
    this.updateMenu();
  }

  private updateMenu() {
    this.items = [
      {
        label: 'Productos',
        icon: 'pi pi-shopping-cart',
        routerLink: ['/productos'],
        visible: this.isAuthenticated(), // visible para todos los usuarios autenticados
      },
      {
        label: 'Ventas',
        icon: 'pi pi-chart-line',
        routerLink: ['/ventas'],
        visible: this.authService.hasAnyRole([UserRole.ADMIN, UserRole.MANAGER, UserRole.CASHIER]),
      },
      {
        label: 'Clientes',
        icon: 'pi pi-users',
        routerLink: ['/clientes'],
        visible: this.authService.hasAnyRole([UserRole.ADMIN, UserRole.MANAGER]),
      },
      {
        label: 'Inventario',
        icon: 'pi pi-box',
        routerLink: ['/inventario'],
        visible: this.authService.hasAnyRole([UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE]),
      },
      {
        label: 'Proveedores',
        icon: 'pi pi-box',
        routerLink: ['/proveedores'],
        visible: this.authService.hasAnyRole([UserRole.ADMIN, UserRole.MANAGER]),
      },
      {
        label: 'Reportes',
        icon: 'pi pi-file-excel',
        routerLink: ['/reportes'],
        visible: this.authService.hasRole(UserRole.ADMIN),
      },
    ];
  }

  logoutUser() {
    this.authService.logout();
  }
}