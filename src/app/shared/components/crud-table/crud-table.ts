import { Input, Output, EventEmitter, Component } from '@angular/core';
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";

@Component({
  selector: 'crud-table',
  templateUrl: './crud-table.html',
  styleUrl: './crud-table.css',
  imports: [TableModule, ButtonModule]
})
export class CrudTable {
  @Input() items: any[] = [];
  @Input() columns: { field: string; header: string }[] = [];
  @Input() actions: { icon: string; handler: (item: any) => void }[] = [];
  @Input() internalId: boolean = false;

  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  onEdit(item: any) {
    this.edit.emit(item);
  }

  onDelete(item: any) {
    this.delete.emit(item);
  }
}