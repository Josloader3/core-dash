import { Component, input, output, effect } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-user-form',
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule, SelectModule, ToggleSwitchModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium">Nombre</label>
        <input pInputText formControlName="name" />
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium">Email</label>
        <input pInputText formControlName="email" type="email" />
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium">Rol</label>
        <p-select formControlName="role" [options]="roles" class="w-full" />
      </div>
      <div class="flex items-center gap-3">
        <p-toggleSwitch formControlName="status" />
        <span class="text-sm">{{ form.value.status ? 'Activo' : 'Inactivo' }}</span>
      </div>
      <div class="flex justify-end gap-2 mt-2">
        <button pButton label="Cancelar" severity="secondary" [text]="true" (click)="cancelled.emit()" type="button"></button>
        <button pButton label="Guardar" type="submit" [disabled]="form.invalid"></button>
      </div>
    </form>
  `,
})
export class UserForm {
  readonly user = input<User | null>(null);
  readonly saved = output<User>();
  readonly cancelled = output<void>();

  protected readonly roles = ['admin', 'editor', 'viewer'];

  protected readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    role: new FormControl('viewer', { nonNullable: true, validators: [Validators.required] }),
    status: new FormControl(true, { nonNullable: true }),
  });

  constructor() {
    effect(() => {
      const u = this.user();
      if (u) {
        this.form.patchValue({ name: u.name, email: u.email, role: u.role, status: u.status });
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const u = this.user();
    this.saved.emit({
      id: u?.id ?? 0,
      ...this.form.getRawValue(),
      createdAt: u?.createdAt ?? new Date().toISOString(),
    } as User);
  }
}
