import { Component, inject, computed, OnInit } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { AuthService } from '@core/services/auth/auth-service';
import { ButtonModule } from 'primeng/button';
import { RouterModule, Router } from '@angular/router';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { FormsModule } from '@angular/forms';
import { getMenuItems } from './utils/menu-bar.items';

@Component({
  selector: 'app-menu-bar',
  imports: [
    MenubarModule, BadgeModule, AvatarModule,
    InputTextModule, CommonModule, ButtonModule,
    ToggleButtonModule, RouterModule, FormsModule
  ],
  templateUrl: './menu-bar.html',
  styleUrl: './menu-bar.css'
})
export class MenuBar implements OnInit {
  private authService = inject(AuthService);
  protected router = inject(Router);

  protected menuItems = computed(() => {
    return getMenuItems(this.authService);
  });

  ngOnInit() {
    this.getUserData();
  }

  onMenuItemToggle(routerLink: string) {
    this.router.navigate([routerLink]);
  }

  getUserData() {
    return this.authService.getUserData()?.fullName;
  }

  logoutUser() {
    this.authService.logout();
  }
}