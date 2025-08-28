import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ENV } from '@env/environment.dev';

@Injectable({
  providedIn: 'root'
})

export class GalleryService {
  private readonly apiUrl = `${ENV.API_URL}/gallery`;
  private http = inject(HttpClient);

  getAllGalleries() {
    return this.http.get(`${this.apiUrl}`);
  }
}
