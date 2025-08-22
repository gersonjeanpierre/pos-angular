import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-products',
  imports: [],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products {
  private http = inject(HttpClient);

  constructor() {
    this.getProductAddons();
  }

  getProductAddons() {
    this.http.get('http://localhost:3000/api/v1/product-addons').subscribe({
      next: (data) => {
        console.log('Product Addons:', data);
      },
      error: (error) => {
        console.error('Error fetching product addons:', error);
      }
    });
  }
}
