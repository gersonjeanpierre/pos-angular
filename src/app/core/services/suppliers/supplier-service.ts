import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Supplier } from '@core/models/interfaces/supplier.model';
import { ENV } from '@env/environment.dev';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private readonly apiUrl = `${ENV.API_URL}/suppliers`;
  private http = inject(HttpClient);

  createSupplier(supplier: Supplier) {
    return this.http.post<Supplier>(`${this.apiUrl}`, supplier);
  }

  getAllSuppliers() {
    return this.http.get<Supplier[]>(`${this.apiUrl}`);
  }

  updateSupplierById(id: string, supplier: Supplier) {
    return this.http.patch<Supplier>(`${this.apiUrl}/${id}`, supplier);
  }
}