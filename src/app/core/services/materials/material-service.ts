import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Material } from "@core/models/interfaces/material.model";
import { ENV } from "@env/environment.dev";

@Injectable()
export class MaterialService {
  private apiUrl = `${ENV.API_URL}/material`;
  private http = inject(HttpClient);

  createMaterial(material: Material) {
    return this.http.post<Material>(this.apiUrl, material);
  }

  getAllMaterials() {
    return this.http.get<Material[]>(this.apiUrl);
  }

  updateMaterialById(id: string, material: Material) {
    return this.http.patch<Material>(`${this.apiUrl}/${id}`, material);
  }

  deleteMaterial(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}