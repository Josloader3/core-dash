import { Component, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [NgClass, RouterLink, RouterLinkActive],
  template: `
    <aside
      [ngClass]="{
        '-translate-x-full': !expanded() && !mobileOpen(),
        'translate-x-0': expanded() || mobileOpen()
      }"
      class="fixed top-0 left-0 z-40 h-screen w-64 bg-slate-900 text-white transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto"
    >
      <div class="flex items-center gap-3 px-6 py-5 border-b border-slate-700">
        <span class="text-2xl font-bold tracking-tight">CoreDash</span>
      </div>
      <nav class="mt-4 px-3 space-y-1">
        @for (item of navItems; track item.route) {
          <a
            [routerLink]="item.route"
            routerLinkActive="!bg-slate-700 !text-white"
            [routerLinkActiveOptions]="{ exact: false }"
            class="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
          >
            <span class="text-lg">{{ item.icon }}</span>
            <span>{{ item.label }}</span>
          </a>
        }
      </nav>
    </aside>
    @if (mobileOpen()) {
      <div
        class="fixed inset-0 bg-black/50 z-30 lg:hidden"
        (click)="closeMobile()"
      ></div>
    }
  `,
})
export class Sidebar {
  readonly expanded = signal(true);
  readonly mobileOpen = signal(false);
  readonly navItems: NavItem[] = [
    { label: 'Dashboard', icon: '📊', route: '/dashboard' },
    { label: 'Usuarios', icon: '👥', route: '/users' },
    { label: 'Productos', icon: '📦', route: '/products' },
  ];

  toggleMobile(): void {
    this.mobileOpen.update((v) => !v);
  }

  closeMobile(): void {
    this.mobileOpen.set(false);
  }
}
