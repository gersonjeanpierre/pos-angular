import { Component, inject, OnInit } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { AuthService } from '@core/services/auth/auth-service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-menu-bar',
  imports: [MenubarModule, BadgeModule, AvatarModule, InputTextModule, CommonModule, ButtonModule],
  templateUrl: './menu-bar.html',
  styleUrl: './menu-bar.css'
})
export class MenuBar implements OnInit {
  private authService = inject(AuthService)
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'Productos',
        icon: 'pi pi-home',
      },
      {
        label: 'Ventas',
        icon: 'pi pi-home',
      },
      {
        label: 'Clientes',
        icon: 'pi pi-home',
      },
      {
        label: 'Inventario',
        icon: 'pi pi-home',
      },
      // {
      //   label: 'Proyectos',
      //   icon: 'pi pi-search',
      //   badge: '3',
      //   items: [
      //     {
      //       label: 'Core',
      //       icon: 'pi pi-bolt',
      //       shortcut: '⌘+S',
      //     },
      //     {
      //       label: 'Blocks',
      //       icon: 'pi pi-server',
      //       shortcut: '⌘+B',
      //     },
      //     {
      //       separator: true,
      //     },
      //     {
      //       label: 'UI Kit',
      //       icon: 'pi pi-pencil',
      //       shortcut: '⌘+U',
      //     },
      //   ],
      // },
    ];
  }

  logoutUser() {
    this.authService.logout();
  }
}