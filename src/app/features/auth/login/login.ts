import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule, CardModule, MessageModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-800 p-4">
      <p-card styleClass="!w-full !max-w-md !shadow-2xl !border-0">
        <ng-template #header>
          <div class="text-center pt-6 pb-2">
            <h1 class="text-3xl font-bold text-slate-800">CoreDash</h1>
            <p class="text-slate-500 text-sm mt-1">Admin Dashboard</p>
          </div>
        </ng-template>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
          <div class="flex flex-col gap-1">
            <label for="email" class="text-sm font-medium text-slate-700">Email</label>
            <input id="email" type="email" pInputText formControlName="email" placeholder="admin@core.com" />
            @if (loginForm.controls.email.touched && loginForm.controls.email.invalid) {
              <p-message severity="error" variant="simple" text="Email requerido"></p-message>
            }
          </div>
          <div class="flex flex-col gap-1">
            <label for="password" class="text-sm font-medium text-slate-700">Contraseña</label>
            <input id="password" type="password" pInputText formControlName="password" placeholder="••••••••" />
            @if (loginForm.controls.password.touched && loginForm.controls.password.invalid) {
              <p-message severity="error" variant="simple" text="Contraseña requerida"></p-message>
            }
          </div>
          @if (error()) {
            <p-message severity="error" variant="simple" [text]="error()"></p-message>
          }
          <button pButton type="submit" label="Iniciar sesión" class="w-full" [disabled]="loginForm.invalid"></button>
        </form>
      </p-card>
    </div>
  `,
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  protected readonly error = signal('');

  protected readonly loginForm = new FormGroup({
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    const { email, password } = this.loginForm.getRawValue();
    if (this.auth.login(email, password)) {
      this.router.navigate(['/dashboard']);
    } else {
      this.error.set('Credenciales inválidas');
    }
  }
}
