import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.html',
  styleUrl: './ticket.css',
  imports: [DatePipe, CurrencyPipe, CommonModule]
})
export class Ticket {

  dataSale = {
    designer: 'Jessica Jaluf',
    correlative: '0001',
    date: new Date(),
    paymentMethod: 'Efectivo',
    client: {
      name: 'Cliente Genérico',
      documentType: 'DNI',
      documentNumber: '12345678'
    },
    items: [
      { description: 'Producto 1', quantity: 2, price: 10.00 },
      { description: 'Producto 2', quantity: 1, price: 20.00 },
      { description: 'Producto 3', quantity: 3, price: 5.00 }
    ],
    total: 61.50,
    discount: 1.50,
    tax: 0.00,
    finalTotal: 60.00,
    advancePayment: 30.00,
    shortage: 30.00,
    printDate: new Date()
  }


}
