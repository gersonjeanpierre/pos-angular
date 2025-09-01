import { Input, Output, EventEmitter, Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormModulesImport } from '@shared/modules/import-form';
import { IftaLabelModule } from "primeng/iftalabel";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'crud-form',
  templateUrl: './crud-form.html',
  styleUrl: './crud-form.css',
  imports: [
    FormModulesImport,
    IftaLabelModule,
    ButtonModule,
    InputTextModule,
    SelectButtonModule,
    SelectModule
  ]
})
export class CrudForm {
  @Input() form!: FormGroup;
  @Input() fields: {
    name: string;
    label: string;
    type?: string;
    class?: string;
    options?: { label: string; value: any; }[];
    optionsSelect?: {
      label: string,
      value?: string,
      id?: string
      items: {
        label: string, value: any
      }[]
    }[];
  }[] = [];
  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}