import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent {
  @Output() addToCart = new EventEmitter<Product>();
  @Input() product!: Product;

  emitAddToCart(): void {
    this.addToCart.emit(this.product);
  }
}
