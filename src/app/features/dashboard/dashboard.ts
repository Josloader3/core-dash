import { Component, computed, effect, inject, viewChild, ElementRef } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DbData, Kpi, MonthlySales, Transaction } from '../../shared/models/dashboard.model';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  imports: [CardModule, TableModule, TagModule, CurrencyPipe],
  template: `
    <h1 class="text-2xl font-bold text-slate-800 mb-6">Dashboard</h1>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      @for (kpi of kpis(); track kpi.label) {
        <p-card styleClass="!border-0 !shadow-sm">
          <div class="flex items-center gap-4">
            <div
              class="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
              [style.background]="kpi.color + '20'"
            >
              <span>{{ kpi.icon }}</span>
            </div>
            <div>
              <p class="text-sm text-slate-500">{{ kpi.label }}</p>
              <p class="text-2xl font-bold text-slate-800">{{ kpi.value.toLocaleString() }}</p>
              <p class="text-xs" [class.text-green-600]="kpi.trend > 0" [class.text-red-600]="kpi.trend < 0">
                {{ kpi.trend > 0 ? '+' : '' }}{{ kpi.trend }}% vs mes anterior
              </p>
            </div>
          </div>
        </p-card>
      }
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <p-card header="Ventas Mensuales" styleClass="!border-0 !shadow-sm">
        <div class="h-64">
          <canvas #lineCanvas></canvas>
        </div>
      </p-card>
      <p-card header="Categorías de Productos" styleClass="!border-0 !shadow-sm">
        <div class="h-64">
          <canvas #doughnutCanvas></canvas>
        </div>
      </p-card>
    </div>

    <p-card header="Transacciones Recientes" styleClass="!border-0 !shadow-sm">
      <p-table [value]="transactions()" [rows]="5" [paginator]="false">
        <ng-template #header>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Monto</th>
            <th>Estado</th>
            <th>Fecha</th>
          </tr>
        </ng-template>
        <ng-template #body let-t>
          <tr>
            <td class="font-mono text-sm">#{{ t.id }}</td>
            <td>{{ t.client }}</td>
            <td>{{ t.amount | currency }}</td>
            <td>
              <p-tag
                [value]="t.status"
                [severity]="t.status === 'completed' ? 'success' : t.status === 'pending' ? 'warn' : 'danger'"
              />
            </td>
            <td>{{ t.date }}</td>
          </tr>
        </ng-template>
      </p-table>
    </p-card>
  `,
})
export class Dashboard {
  private readonly lineCanvas = viewChild<ElementRef<HTMLCanvasElement>>('lineCanvas');
  private readonly doughnutCanvas = viewChild<ElementRef<HTMLCanvasElement>>('doughnutCanvas');

  private readonly data = httpResource<DbData>(() => '/db.json', {
    defaultValue: {} as DbData,
  });

  protected readonly kpis = computed<Kpi[]>(() => this.data.value()?.kpis ?? []);
  protected readonly transactions = computed<Transaction[]>(() => this.data.value()?.transactions ?? []);
  protected readonly monthlySales = computed<MonthlySales[]>(() => this.data.value()?.monthlySales ?? []);

  private readonly productsByCategory = computed(() => {
    const products = this.data.value()?.products ?? [];
    const map = new Map<string, number>();
    for (const p of products) map.set(p.category, (map.get(p.category) ?? 0) + 1);
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  });

  private lineInstance: Chart | null = null;
  private doughnutInstance: Chart | null = null;

  constructor() {
    effect(() => {
      const sales = this.monthlySales();
      const canvas = this.lineCanvas();
      if (sales.length && canvas) this.renderLineChart(sales, canvas.nativeElement);
    });
    effect(() => {
      const data = this.productsByCategory();
      const canvas = this.doughnutCanvas();
      if (data.length && canvas) this.renderDoughnutChart(data, canvas.nativeElement);
    });
  }

  private renderLineChart(sales: MonthlySales[], canvas: HTMLCanvasElement): void {
    this.lineInstance?.destroy();
    this.lineInstance = new Chart(canvas, {
      type: 'line',
      data: {
        labels: sales.map((s) => s.month),
        datasets: [
          {
            label: 'Ventas',
            data: sales.map((s) => s.sales),
            borderColor: '#4f46e5',
            backgroundColor: 'rgba(79,70,229,0.1)',
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false },
    });
  }

  private renderDoughnutChart(data: { name: string; count: number }[], canvas: HTMLCanvasElement): void {
    this.doughnutInstance?.destroy();
    const colors = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
    this.doughnutInstance = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: data.map((d) => d.name),
        datasets: [
          {
            data: data.map((d) => d.count),
            backgroundColor: colors.slice(0, data.length),
          },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } },
    });
  }
}
