import { Component, inject } from '@angular/core';
import { ToolbarModule } from "primeng/toolbar";
import { ButtonModule } from "primeng/button";
import { MenubarModule } from "primeng/menubar";
import { MenuItem } from 'primeng/api';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { Ripple } from "primeng/ripple";

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.html',
  styleUrl: './inventory.css',
  imports: [
    ToolbarModule,
    ButtonModule,
    MenubarModule,
    RouterOutlet,
    Ripple,
    RouterModule
  ],
})

export class Inventory {
  router = inject(Router)

  items: MenuItem[] = []

  ngOnInit() {
    this.items = [
      {
        label: 'Movimientos',
        routerLink: '/inventario/movimientos'
      },
      {
        label: 'Materiales',
        routerLink: '/inventario/materiales'
      }
    ];
  }
}
