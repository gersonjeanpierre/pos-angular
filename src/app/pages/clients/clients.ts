import { ChangeDetectorRef, Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Client } from '@core/models/interfaces/client.model';
import { ClientService } from '@core/services/clients/client-service';
import { CrudForm } from '@shared/components/crud-form/crud-form';
import { CrudTable } from '@shared/components/crud-table/crud-table';
import { ToolbarModule } from "primeng/toolbar";
import { ButtonModule } from "primeng/button";
import { Dialog } from "primeng/dialog";
import { MessageToast } from '@shared/components/message-toast/message-toast';
import { TypePerson } from '@core/enums/type-person.enum';
import { TypeClient } from '@core/enums/type-client.enum';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.html',
  styleUrl: './clients.css',
  providers: [ClientService],
  imports: [
    CrudTable,
    CrudForm,
    ToolbarModule,
    ButtonModule,
    Dialog,
    MessageToast
  ],
})
export class Clients {
  private clientService = inject(ClientService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  clientDialog: boolean = false;
  clients: Client[] = [];
  keyInternalId: boolean = false;

  clientForm: FormGroup = this.fb.group({
    id: [''],
    typePerson: [''],
    typeClient: [''],
    phone: [''],
    fullName: [''],
    socialReason: [''],
    dni: [''],
    ruc: [''],
    ce: [''],
    email: ['']
  })

  typePersonOptions = Object.entries(TypePerson).map(([key, value]) => ({
    label: value,
    value: value
  }));

  typeClientOptions = Object.entries(TypeClient).map(([key, value]) => ({
    label: value,
    value: value
  }));

  columns = [
    { field: 'fullName', header: 'Nombre' },
    { field: 'typePerson', header: 'Tipo Persona' },
    { field: 'typeClient', header: 'Tipo Cliente' },
    { field: 'dni', header: 'DNI' },
    { field: 'ruc', header: 'RUC' },
    { field: 'ce', header: 'CE' },
    { field: 'phone', header: 'Teléfono' },
    { field: 'email', header: 'Email' }
  ];

  formFields = [
    { name: 'fullName', label: 'Nombre' },
    {
      name: 'typePerson', label: 'Tipo Persona', type: 'select-enum', options: this.typePersonOptions
    },
    { name: 'typeClient', label: 'Tipo Cliente', type: 'select-enum', options: this.typeClientOptions },
    { name: 'dni', label: 'DNI' },
    { name: 'ruc', label: 'RUC' },
    { name: 'ce', label: 'CE' },
    { name: 'phone', label: 'Teléfono' },
    { name: 'email', label: 'Email', type: 'email' }
  ];

  actions = [
    {
      label: 'Editar',
      icon: 'pi pi-pencil',
      handler: (client: Client) => this.editClient(client)
    }
  ];

  @ViewChild('toast') toast!: MessageToast;

  ngOnInit() {
    console.log(this.typePersonOptions);
    this.clientService.getAllClients().subscribe(
      (clients) => {
        this.clients = clients as Client[];
        this.cdr.detectChanges();
      }
    )
  }

  createNewClient() {
    this.clientForm.reset();
    this.clientDialog = true;
  }

  editClient(client: Client) {
    this.clientForm.patchValue(client);
    this.clientDialog = true;
  }

  saveClient() {
    const client: Client = this.clientForm.value;
    if (!client.id || client.id === '') {
      this.clientService.createClient(client).subscribe({
        next: () => {
          this.showSuccess('Cliente creado correctamente');
          this.ngOnInit();
        },
        error: (err) => {
          this.showError(err.error?.message || 'Ha ocurrido un error');
        }
      });
    } else {
      this.clientService.updateClientById(client.id, client).subscribe({
        next: () => {
          this.showSuccess('Cliente actualizado correctamente');
          this.ngOnInit();
        },
        error: (err) => {
          this.showError(err.error?.message || 'Ha ocurrido un error');
        }
      });
    }
    this.hideDialog();
  }

  showSuccess(message: string) {
    this.toast.clear();
    this.toast.severity = 'success';
    this.toast.summary = 'Éxito';
    this.toast.life = 2000;
    this.toast.detail = message;
    this.toast.position = 'bottom-right'
    this.toast.sticky = false;
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

  hideDialog() {
    this.clientDialog = false;
  }
}
