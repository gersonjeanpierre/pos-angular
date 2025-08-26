import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Supplier } from '@core/models/interfaces/supplier.model';
import { SupplierService } from '@core/services/suppliers/supplier-service';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { SkeletonModule } from 'primeng/skeleton';
import { ButtonModule } from "primeng/button";
import { RouterOutlet } from '@angular/router';

import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Dialog } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormModulesImport } from '@shared/modules/import-form';
import { FormBuilder } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { IftaLabelModule } from 'primeng/iftalabel';

@Component({
  selector: 'app-suppliers',
  imports: [CardModule, TableModule, SkeletonModule, ButtonModule,
    ToastModule, ToolbarModule, ConfirmDialog, Dialog, InputTextModule,
    FormModulesImport, SelectButtonModule, IftaLabelModule
  ],
  templateUrl: './suppliers.html',
  styleUrl: './suppliers.css',
  providers: [SupplierService, MessageService, ConfirmationService]
})
export class Suppliers {
  private supplierService = inject(SupplierService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef)

  supplierDialog: boolean = false;
  suppliers!: Supplier[];
  selectedSupplier: Supplier = this.getEmptySupplier();
  submitted: boolean = false;

  activeOptions: any[] = [
    { label: 'Sí', value: true },
    { label: 'No', value: false }
  ];
  value: boolean = true;

  supplierForm = this.fb.group({
    id: [''],
    internalId: [0],
    socialReason: [''],
    ruc: [''],
    contactName: [''],
    phone: [''],
    email: [''],
    isActive: [true]
  })

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
    this.selectedSupplier = { ...supplier };
    // Map supplier to form values, converting id to number if needed
    this.supplierForm.patchValue({
      id: supplier.id ? String(supplier.id) : '',
      internalId: Number(supplier.internalId) ?? 0,
      socialReason: supplier.socialReason ?? '',
      ruc: supplier.ruc ?? '',
      contactName: supplier.contactName ?? '',
      phone: supplier.phone ?? '',
      email: supplier.email ?? '',
      isActive: supplier.isActive ?? true
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
      // Crear nuevo proveedor
      const newSupplier: Supplier = {
        ...formValue,
      } as Supplier;
      this.supplierService.createSupplier(newSupplier).subscribe(() => {
        this.ngOnInit();
      });
    } else {
      // Editar proveedor existente
      const updatedSupplier: Supplier = {
        ...formValue,
        id: supplier.id ?? undefined
      } as Supplier;
      this.supplierService.updateSupplierById(supplier.id, updatedSupplier).subscribe(() => {
        this.ngOnInit();
      });
    }

    this.hideDialog();
  }
  // saveSupplier() {

  //   const { internalId, ...formValue } = this.supplierForm.value;
  //   const id = formValue.id ?? '';
  //   // Ensure id is never null
  //   const supplier: Supplier = {
  //     ...formValue,
  //     id: formValue.id ?? undefined
  //   } as Supplier;


  //   this.supplierService.updateSupplierById(id, supplier).subscribe(() => {
  //     this.ngOnInit(); // Refresh the supplier list
  //   });
  //   this.hideDialog();
  // }

  private getEmptySupplier(): Supplier {
    return {
      internalId: 0,
      socialReason: '',
      ruc: '',
      contactName: '',
      phone: '',
      email: '',
      isActive: false
    };
  }
}
