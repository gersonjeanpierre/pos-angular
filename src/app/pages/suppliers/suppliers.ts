import { ChangeDetectorRef, Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Supplier } from '@core/models/interfaces/supplier.model';
import { SupplierService } from '@core/services/suppliers/supplier-service';
import { CrudTable } from "@shared/components/crud-table/crud-table";
import { CrudForm } from "@shared/components/crud-form/crud-form";
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from "primeng/button";
import { Dialog } from 'primeng/dialog';
import { MessageToast } from '@shared/components/message-toast/message-toast';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.html',
  styleUrl: './suppliers.css',
  providers: [SupplierService],
  imports: [
    CrudTable,
    CrudForm,
    ToolbarModule,
    ButtonModule,
    Dialog,
    MessageToast
  ],
})
export class Suppliers {
  private supplierService = inject(SupplierService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef)

  supplierDialog: boolean = false;
  suppliers!: Supplier[];
  submitted: boolean = false;
  keyInternalId: boolean = true;

  activeOptions: any[] = [
    { label: 'Sí', value: true },
    { label: 'No', value: false }
  ];

  @ViewChild('toast') toast!: MessageToast;

  supplierForm: FormGroup = this.fb.group({
    id: [''],
    internalId: [0],
    socialReason: [''],
    ruc: [''],
    contactName: [''],
    phone: [''],
    email: [''],
    isActive: [true]
  })

  columns = [
    { field: 'internalId', header: 'ID' },
    { field: 'socialReason', header: 'Razón Social' },
    { field: 'ruc', header: 'RUC' },
    { field: 'contactName', header: 'Representante' },
    { field: 'phone', header: 'Celular' },
    { field: 'email', header: 'Email' },
    { field: 'isActive', header: 'Activo' }
  ];

  formFields = [
    { name: 'socialReason', label: 'Razón Social', class: 'w-72' },
    { name: 'ruc', label: 'RUC', class: 'w-40' },
    { name: 'contactName', label: 'Representante', class: 'w-72' },
    { name: 'phone', label: 'Celular', class: 'w-40' },
    { name: 'email', label: 'Email', type: 'email', class: 'w-72' },
    { name: 'isActive', label: 'Activo', type: 'selectbutton', options: this.activeOptions }
  ];

  actions = [
    { icon: 'pi pi-pencil', handler: (item: Supplier) => this.editSupplier(item) }
    // { icon: 'pi pi-trash', handler: (item: Supplier) => this.deleteSupplier(item) }
  ];

  ngOnInit() {

    this.supplierService.getAllSuppliers().subscribe((supplier) => {
      this.suppliers = supplier as Supplier[];
      // console.log(this.suppliers);
      this.cdr.detectChanges();
    });
  }

  createNewSupplier() {
    this.supplierForm.reset();
    this.supplierDialog = true;
  }

  editSupplier(supplier: Supplier) {

    this.supplierForm.patchValue({
      id: supplier.id ? String(supplier.id) : '',
      internalId: Number(supplier.internalId) ?? 0,
      socialReason: supplier.socialReason ?? '',
      ruc: supplier.ruc ?? '',
      contactName: supplier.contactName ?? '',
      phone: supplier.phone ?? '',
      email: supplier.email ?? '',
      isActive: supplier.isActive
    });
    this.supplierDialog = true;
  }

  deleteSupplier(supplier: Supplier) {
    // Implementa la lógica para eliminar el proveedor
  }

  hideDialog() {
    this.supplierDialog = false;
  }

  saveSupplier() {
    const supplier = this.supplierForm.value as Supplier;
    const { internalId, ...formValue } = supplier;

    if (!supplier.id || supplier.id === '') {
      const newSupplier: Supplier = { ...formValue } as Supplier;
      this.supplierService.createSupplier(newSupplier).subscribe({
        next: () => {
          this.ngOnInit();
          this.showSuccess('Proveedor creado correctamente');
        },
        error: (e) => {
          this.showError(e.error?.message || 'No se pudo crear el proveedor');
        }
      });
    } else {
      const updatedSupplier: Supplier = { ...formValue, id: supplier.id ?? undefined } as Supplier;
      this.supplierService.updateSupplierById(supplier.id, updatedSupplier).subscribe({
        next: () => {
          this.ngOnInit();
          this.showSuccess('Proveedor actualizado correctamente');
        },
        error: (e) => {
          this.showError(e.error?.message || 'No se pudo actualizar el proveedor');
        }
      });
    }

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
    this.toast.position = 'bottom-center'
    this.toast.detail = message;
    this.toast.sticky = true;
    this.toast.show();
    this.cdr.detectChanges();
  }

}
