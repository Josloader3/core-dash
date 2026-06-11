import { Component, inject, output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-topbar',
  imports: [AvatarModule, ButtonModule, TooltipModule],
  template: `
    <header
      class="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 shadow-sm"
    >
      <button
        pButton
        class="lg:hidden"
        icon="pi pi-bars"
        (click)="toggleSidebar.emit()"
        severity="secondary"
        [text]="true"
      ></button>
      <div class="flex items-center gap-3 ml-auto">
        <div class="text-right hidden sm:block">
          <p class="text-sm font-medium text-slate-700">{{ auth.user()?.name }}</p>
          <p class="text-xs text-slate-400">{{ auth.user()?.email }}</p>
        </div>
        <p-avatar
          label="A"
          styleClass="!bg-indigo-600 !text-white"
          size="large"
          shape="circle"
        ></p-avatar>
        <button
          pButton
          icon="pi pi-sign-out"
          (click)="auth.logout()"
          severity="danger"
          [text]="true"
          pTooltip="Cerrar sesión"
        ></button>
      </div>
    </header>
  `,
})
export class Topbar {
  protected readonly auth = inject(AuthService);
  readonly toggleSidebar = output<void>();
}
