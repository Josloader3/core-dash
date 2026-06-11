import { Component, inject, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../components/sidebar/sidebar';
import { Topbar } from '../components/topbar/topbar';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, Sidebar, Topbar],
  template: `
    <div class="flex h-screen bg-slate-50">
      <app-sidebar />
      <div class="flex-1 flex flex-col overflow-hidden">
        <app-topbar (toggleSidebar)="sidebar()?.toggleMobile()" />
        <main class="flex-1 overflow-auto p-4 lg:p-6">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class Layout {
  private readonly sidebarRef = viewChild(Sidebar);
  protected readonly sidebar = this.sidebarRef;
}
