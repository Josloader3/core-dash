import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { UserForm } from './user-form/user-form';
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-users',
  imports: [
    FormsModule, TableModule, ButtonModule, InputTextModule, DialogModule,
    ConfirmDialogModule, ToastModule, TagModule, SelectModule,
    UserForm, DatePipe,
  ],
  providers: [ConfirmationService, MessageService],
  template: `
    <p-toast></p-toast>
    <p-confirmDialog></p-confirmDialog>

    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-slate-800">Usuarios</h1>
      <button pButton label="Nuevo Usuario" icon="pi pi-plus" (click)="openCreate()"></button>
    </div>

    <div class="flex gap-3 mb-4 flex-wrap">
      <input pInputText placeholder="Buscar..." [ngModel]="searchTerm()" (ngModelChange)="searchTerm.set($event)" class="w-64" />
      <p-select
        [options]="roleOptions"
        placeholder="Rol"
        [ngModel]="selectedRole()"
        (ngModelChange)="selectedRole.set($event)"
        class="w-40"
      />
      <p-select
        [options]="statusOptions"
        placeholder="Estado"
        [ngModel]="selectedStatus()"
        (ngModelChange)="selectedStatus.set($event)"
        class="w-40"
      />
    </div>

    <p-table
      [value]="filteredUsers()"
      [rows]="10"
      [paginator]="true"
      [rowsPerPageOptions]="[5, 10, 20]"
      styleClass="!shadow-sm !border-0"
    >
      <ng-template #header>
        <tr>
          <th>Nombre</th>
          <th>Email</th>
          <th>Rol</th>
          <th>Estado</th>
          <th>Creado</th>
          <th>Acciones</th>
        </tr>
      </ng-template>
      <ng-template #body let-u>
        <tr>
          <td class="font-medium">{{ u.name }}</td>
          <td class="text-slate-500">{{ u.email }}</td>
          <td>
            <p-tag [value]="u.role" [severity]="u.role === 'admin' ? 'info' : u.role === 'editor' ? 'warn' : 'success'" />
          </td>
          <td>
            <p-tag
              [value]="u.status ? 'Activo' : 'Inactivo'"
              [severity]="u.status ? 'success' : 'danger'"
            />
          </td>
          <td>{{ u.createdAt | date:'mediumDate' }}</td>
          <td>
            <div class="flex gap-2">
              <button pButton icon="pi pi-pencil" severity="info" [text]="true" (click)="openEdit(u)"></button>
              <button pButton icon="pi pi-trash" severity="danger" [text]="true" (click)="confirmDelete(u)"></button>
            </div>
          </td>
        </tr>
      </ng-template>
    </p-table>

    <p-dialog
      [header]="editingUser() ? 'Editar Usuario' : 'Nuevo Usuario'"
      [modal]="true"
      [(visible)]="dialogVisible"
      [style]="{ width: '500px' }"
    >
      <app-user-form
        [user]="editingUser()"
        (saved)="onSaved($event)"
        (cancelled)="dialogVisible.set(false)"
      />
    </p-dialog>
  `,
})
export class Users {
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);

  private readonly data = httpResource<{ users: User[] }>(() => '/db.json', {
    defaultValue: { users: [] },
  });

  protected readonly searchTerm = signal('');
  protected readonly selectedRole = signal<string | null>(null);
  protected readonly selectedStatus = signal<boolean | null>(null);
  protected readonly dialogVisible = signal(false);
  protected readonly editingUser = signal<User | null>(null);

  protected readonly roleOptions = ['admin', 'editor', 'viewer'];
  protected readonly statusOptions = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false },
  ];

  protected readonly filteredUsers = computed(() => {
    let users = [...this.data.value().users];
    const term = this.searchTerm().toLowerCase();
    if (term) users = users.filter((u) => u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term));
    if (this.selectedRole()) users = users.filter((u) => u.role === this.selectedRole());
    if (this.selectedStatus() !== null) users = users.filter((u) => u.status === this.selectedStatus());
    return users;
  });

  openCreate(): void {
    this.editingUser.set(null);
    this.dialogVisible.set(true);
  }

  openEdit(user: User): void {
    this.editingUser.set(user);
    this.dialogVisible.set(true);
  }

  onSaved(user: User): void {
    const users = this.data.value().users;
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx >= 0) {
      users[idx] = user;
      this.messageService.add({ severity: 'success', summary: 'Actualizado', detail: 'Usuario actualizado' });
    } else {
      const maxId = users.length > 0 ? Math.max(...users.map((u) => u.id)) : 0;
      users.push({ ...user, id: maxId + 1 });
      this.messageService.add({ severity: 'success', summary: 'Creado', detail: 'Usuario creado' });
    }
    this.dialogVisible.set(false);
  }

  confirmDelete(user: User): void {
    this.confirmationService.confirm({
      message: `¿Eliminar a ${user.name}?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const users = this.data.value().users;
        const idx = users.findIndex((u) => u.id === user.id);
        if (idx >= 0) users.splice(idx, 1);
        this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Usuario eliminado' });
      },
    });
  }
}
