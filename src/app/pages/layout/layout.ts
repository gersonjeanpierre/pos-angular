import { Component } from '@angular/core';
import { MenuBar } from './menu-bar/menu-bar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [MenuBar, RouterOutlet],
  template: `
    <app-menu-bar></app-menu-bar>
    <router-outlet></router-outlet>
  `
})
export class Layout {

}
