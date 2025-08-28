import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Client } from '@core/models/interfaces/client.model';
import { ENV } from '@env/environment.dev';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private readonly apiUrl = `${ENV.API_URL}/clients`;
  private http = inject(HttpClient);

  createClient(client: Client) {
    return this.http.post<Client>(this.apiUrl, client);
  }

  getAllClients() {
    return this.http.get<Client[]>(this.apiUrl);
  }

  getClientById(id: string) {
    return this.http.get<Client>(`${this.apiUrl}/${id}`);
  }

  updateClientById(id: string, client: Client) {
    return this.http.patch<Client>(`${this.apiUrl}/${id}`, client);
  }

  // deleteClient(id: string) {
  //   return this.http.delete(`${this.apiUrl}/${id}`);
  // }
}
