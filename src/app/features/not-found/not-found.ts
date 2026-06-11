import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, ButtonModule],
  template: `
    <div class="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
      <span class="text-9xl font-black text-indigo-600">404</span>
      <h1 class="text-2xl font-bold text-slate-800 mt-4">Página no encontrada</h1>
      <p class="text-slate-500 mt-2 mb-8 text-center">
        La página que buscas no existe o ha sido movida.
      </p>
      <button pButton label="Volver al Dashboard" icon="pi pi-home" routerLink="/dashboard"></button>
    </div>
  `,
})
export class NotFound {}
