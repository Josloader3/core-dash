import { Component, input, output, effect } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { Product } from '../../../shared/models/product.model';

@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule, InputNumberModule, SelectModule, TextareaModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium">Nombre</label>
        <input pInputText formControlName="name" />
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium">Imagen (URL)</label>
        <input pInputText formControlName="image" />
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium">Categoría</label>
        <p-select formControlName="category" [options]="categories" class="w-full" />
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium">Precio</label>
        <p-inputNumber formControlName="price" [min]="0" [max]="999999" class="w-full" />
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium">Stock</label>
        <p-inputNumber formControlName="stock" [min]="0" class="w-full" />
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium">Descripción</label>
        <textarea pTextarea formControlName="description" rows="3"></textarea>
      </div>
      <div class="flex justify-end gap-2 mt-2">
        <button pButton label="Cancelar" severity="secondary" [text]="true" (click)="cancelled.emit()" type="button"></button>
        <button pButton label="Guardar" type="submit" [disabled]="form.invalid"></button>
      </div>
    </form>
  `,
})
export class ProductForm {
  readonly product = input<Product | null>(null);
  readonly saved = output<Product>();
  readonly cancelled = output<void>();

  protected readonly categories = ['Electrónica', 'Ropa', 'Hogar', 'Deportes', 'Libros', 'Juguetes'];

  protected readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    image: new FormControl('https://placehold.co/100x100?text=Product', { nonNullable: true }),
    category: new FormControl('Electrónica', { nonNullable: true, validators: [Validators.required] }),
    price: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
    stock: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
    description: new FormControl('', { nonNullable: true }),
  });

  constructor() {
    effect(() => {
      const p = this.product();
      if (p) {
        this.form.patchValue({
          name: p.name, image: p.image, category: p.category,
          price: p.price, stock: p.stock, description: p.description ?? '',
        });
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const p = this.product();
    this.saved.emit({
      id: p?.id ?? 0,
      ...this.form.getRawValue(),
      createdAt: p?.createdAt ?? new Date().toISOString(),
    } as Product);
  }
}
