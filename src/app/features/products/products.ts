import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
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
import { ProductForm } from './product-form/product-form';
import { Product } from '../../shared/models/product.model';

@Component({
  selector: 'app-products',
  imports: [
    FormsModule, TableModule, ButtonModule, InputTextModule, DialogModule,
    ConfirmDialogModule, ToastModule, TagModule, SelectModule,
    ProductForm, CurrencyPipe,
  ],
  providers: [ConfirmationService, MessageService],
  template: `
    <p-toast></p-toast>
    <p-confirmDialog></p-confirmDialog>

    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-slate-800">Productos</h1>
      <button pButton label="Nuevo Producto" icon="pi pi-plus" (click)="openCreate()"></button>
    </div>

    <div class="flex gap-3 mb-4 flex-wrap">
      <input pInputText placeholder="Buscar..." [ngModel]="searchTerm()" (ngModelChange)="searchTerm.set($event)" class="w-64" />
      <p-select
        [options]="categoryOptions()"
        placeholder="Categoría"
        [ngModel]="selectedCategory()"
        (ngModelChange)="selectedCategory.set($event)"
        class="w-48"
      />
    </div>

    <p-table
      [value]="filteredProducts()"
      [rows]="10"
      [paginator]="true"
      [rowsPerPageOptions]="[5, 10, 20]"
      styleClass="!shadow-sm !border-0"
    >
      <ng-template #header>
        <tr>
          <th>Imagen</th>
          <th>Nombre</th>
          <th>Categoría</th>
          <th>Precio</th>
          <th>Stock</th>
          <th>Acciones</th>
        </tr>
      </ng-template>
      <ng-template #body let-p>
        <tr>
          <td>
            <img [src]="p.image" [alt]="p.name" class="w-10 h-10 rounded-lg object-cover" />
          </td>
          <td class="font-medium">{{ p.name }}</td>
          <td>
            <p-tag [value]="p.category" severity="info" />
          </td>
          <td>{{ p.price | currency }}</td>
          <td>
            <span
              class="inline-flex items-center gap-1"
              [class.text-red-600]="p.stock < 10"
              [class.font-bold]="p.stock < 10"
            >
              {{ p.stock }}
              @if (p.stock < 10) {
                <span class="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full">Stock bajo</span>
              }
            </span>
          </td>
          <td>
            <div class="flex gap-2">
              <button pButton icon="pi pi-pencil" severity="info" [text]="true" (click)="openEdit(p)"></button>
              <button pButton icon="pi pi-trash" severity="danger" [text]="true" (click)="confirmDelete(p)"></button>
            </div>
          </td>
        </tr>
      </ng-template>
    </p-table>

    <p-dialog
      [header]="editingProduct() ? 'Editar Producto' : 'Nuevo Producto'"
      [modal]="true"
      [(visible)]="dialogVisible"
      [style]="{ width: '500px' }"
    >
      <app-product-form
        [product]="editingProduct()"
        (saved)="onSaved($event)"
        (cancelled)="dialogVisible.set(false)"
      />
    </p-dialog>
  `,
})
export class Products {
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);

  private readonly data = httpResource<{ products: Product[] }>(() => '/db.json', {
    defaultValue: { products: [] },
  });

  protected readonly searchTerm = signal('');
  protected readonly selectedCategory = signal<string | null>(null);
  protected readonly dialogVisible = signal(false);
  protected readonly editingProduct = signal<Product | null>(null);

  protected readonly categoryOptions = computed(() => {
    const cats = new Set(this.data.value().products.map((p) => p.category));
    return Array.from(cats);
  });

  protected readonly filteredProducts = computed(() => {
    let products = [...this.data.value().products];
    const term = this.searchTerm().toLowerCase();
    if (term) products = products.filter((p) => p.name.toLowerCase().includes(term));
    if (this.selectedCategory()) products = products.filter((p) => p.category === this.selectedCategory());
    return products;
  });

  openCreate(): void {
    this.editingProduct.set(null);
    this.dialogVisible.set(true);
  }

  openEdit(product: Product): void {
    this.editingProduct.set(product);
    this.dialogVisible.set(true);
  }

  onSaved(product: Product): void {
    const products = this.data.value().products;
    const idx = products.findIndex((p) => p.id === product.id);
    if (idx >= 0) {
      products[idx] = product;
      this.messageService.add({ severity: 'success', summary: 'Actualizado', detail: 'Producto actualizado' });
    } else {
      const maxId = products.length > 0 ? Math.max(...products.map((p) => p.id)) : 0;
      products.push({ ...product, id: maxId + 1 });
      this.messageService.add({ severity: 'success', summary: 'Creado', detail: 'Producto creado' });
    }
    this.dialogVisible.set(false);
  }

  confirmDelete(product: Product): void {
    this.confirmationService.confirm({
      message: `¿Eliminar ${product.name}?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const products = this.data.value().products;
        const idx = products.findIndex((p) => p.id === product.id);
        if (idx >= 0) products.splice(idx, 1);
        this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Producto eliminado' });
      },
    });
  }
}
