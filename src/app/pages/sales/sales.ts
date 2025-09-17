import { Component } from '@angular/core';
import { Card } from "primeng/card";
import { Ticket } from './ticket/ticket';
import { Scroller } from "primeng/scroller";

@Component({
  selector: 'app-sales',
  templateUrl: './sales.html',
  styleUrl: './sales.css',
  imports: [
    Card,
    Ticket,
    Scroller
  ]
})
export class Sales {
  largeItems = Array.from({ length: 1000 }).map((_, i) => ({
    name: `Producto ${i + 1}`,
    description: `Descripción del producto ${i + 1}`
  }));

}
