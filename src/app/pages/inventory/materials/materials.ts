import { ChangeDetectorRef, Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Material } from '@core/models/interfaces/material.model';
import { MaterialService } from '@core/services/materials/material-service';
import { CrudTable } from "@shared/components/crud-table/crud-table";
import { CrudForm } from "@shared/components/crud-form/crud-form";
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from "primeng/button";
import { Dialog } from 'primeng/dialog';
import { MessageToast } from '@shared/components/message-toast/message-toast';
import { GalleryService } from '@core/services/locations/gallery-service';
import { Gallery } from '@core/models/interfaces/gallery.model';

@Component({
  selector: 'app-materials',
  templateUrl: './materials.html',
  styleUrl: './materials.css',
  providers: [MaterialService],
  imports: [
    CrudTable,
    CrudForm,
    ToolbarModule,
    ButtonModule,
    Dialog,
    MessageToast
  ],
})
export class Materials {
  private materialService = inject(MaterialService);
  private galleryService = inject(GalleryService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  materialDialog: boolean = false;
  materials: Material[] = [];
  submitted: boolean = false;

  groupedGalleries: any[] = [];
  selectedStand: string | undefined;

  @ViewChild('toast') toast!: MessageToast;

  materialForm: FormGroup = this.fb.group({
    id: [''],
    name: [''],
    stock: [0],
    unitOfMeasure: [''],
    quantityMaterial: [0],
    widthMaterial: [0],
    heightMaterial: [0],
    standId: [''],
  });

  columns = [
    // { field: 'id', header: 'ID' },
    { field: 'name', header: 'Nombre' },
    { field: 'unitOfMeasure', header: 'Unidad' },
    { field: 'stock', header: 'Stock' },
    { field: 'quantityMaterial', header: 'Cantidad' },
    { field: 'widthMaterial', header: 'Ancho' },
    { field: 'heightMaterial', header: 'Alto' },
    // { field: 'standId', header: 'Stand' },
    { field: 'standName', header: 'StandName' }
  ];

  formFields = [
    { name: 'standId', label: 'Stand', type: 'select-group', optionsSelect: this.groupedGalleries },
    { name: 'name', label: 'Nombre', class: 'w-72' },
    { name: 'unitOfMeasure', label: 'Unidad de Medida', class: 'w-40' },
    { name: 'stock', label: 'Stock', type: 'number', class: 'w-32' },
    { name: 'quantityMaterial', label: 'Cantidad', type: 'number', class: 'w-32' },
    { name: 'widthMaterial', label: 'Ancho', type: 'number', class: 'w-32' },
    { name: 'heightMaterial', label: 'Alto', type: 'number', class: 'w-32' },
  ];

  actions = [
    { icon: 'pi pi-pencil', handler: (item: Material) => this.editMaterial(item) }
    // { icon: 'pi pi-trash', handler: (item: Material) => this.deleteMaterial(item) }
  ];

  ngOnInit() {
    this.materialService.getAllMaterials().subscribe((materials) => {
      console.log(materials)
      this.materials = materials as Material[];
      this.cdr.detectChanges();
    });
    this.galleryService.getAllGalleries().subscribe((data) => {
      this.groupedGalleries = this.groupedDataForSelect(data as Gallery[]);

      const standField = this.formFields.find(f => f.name === 'standId');
      if (standField) {
        standField.optionsSelect = this.groupedGalleries;
      }
      this.cdr.detectChanges();
    });
  }

  createNewMaterial() {
    this.materialForm.reset({ isActive: true });
    this.materialDialog = true;
  }

  editMaterial(material: Material) {
    this.materialForm.patchValue(material);
    this.materialDialog = true;
  }

  deleteMaterial(material: Material) {
    // Implementa la lógica para eliminar el material si lo necesitas
  }

  hideDialog() {
    this.materialDialog = false;
  }

  saveMaterial() {
    const material: Material = this.materialForm.value;

    if (!material.id || material.id === '') {
      this.materialService.createMaterial(material).subscribe({
        next: () => {
          this.ngOnInit();
          this.showSuccess('Material creado correctamente');
        },
        error: (e) => {
          this.showError(e.error?.message || 'No se pudo crear el material');
        }
      });
    } else {
      this.materialService.updateMaterialById(material.id, material).subscribe({
        next: () => {
          this.ngOnInit();
          this.showSuccess('Material actualizado correctamente');
        },
        error: (e) => {
          this.showError(e.error?.message || 'No se pudo actualizar el material');
        }
      });
    }
    console.log(this.materialForm.value);
    this.hideDialog();
  }

  showSuccess(message: string) {
    this.toast.clear();
    this.toast.severity = 'success';
    this.toast.summary = 'Éxito';
    this.toast.position = 'bottom-right';
    this.toast.detail = message;
    this.toast.life = 2000;
    this.toast.show();
    this.cdr.detectChanges();
  }

  showError(message: string) {
    this.toast.clear();
    this.toast.severity = 'error';
    this.toast.summary = 'Error';
    this.toast.position = 'bottom-center';
    this.toast.detail = message;
    this.toast.sticky = true;
    this.toast.show();
    this.cdr.detectChanges();
  }

  groupedDataForSelect(data: Gallery[]) {
    return data.map(gallery => ({
      label: gallery.name,
      value: gallery.name,
      id: gallery.id,
      items: gallery.stands.map(stand => ({
        label: stand.name,
        value: stand.id
      }))
    }))
  }
}