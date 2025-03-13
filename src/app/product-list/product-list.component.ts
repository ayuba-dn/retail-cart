import { Component, inject } from '@angular/core';
import { ProductComponent } from '../product/product.component';
import { API_URL, ProductService } from '../services/product.service';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart-service.service';
import { Product } from '../models/product.model';
import { QuantityModalComponent } from '../quantity-modal/quantity-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoggingService } from '../services/logging.service';
import { EventCode } from '../models/event-code.enum';
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ProductComponent, CommonModule],
  providers: [
    { provide: API_URL, useValue: 'https://dummyjson.com/products' },
    ProductService,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent {
  products = this.productService.productSignal;

  constructor(private productService: ProductService) {}
  cartService = inject(CartService);
  modalService = inject(NgbModal);
  loggingService = inject(LoggingService);

  cartItems = this.cartService.getCartItems();

  handleAddToCart(product: Product) {
    const modalRef = this.modalService.open(QuantityModalComponent, {
      backdrop: false,
    });
    modalRef.componentInstance.quantity = 1; // Default quantity

    modalRef.result
      .then((quantity) => {
        if (quantity) {
          this.cartService.addItem({
            id: product.id.toString(),
            name: product.title,
            price: product.price,
            quantity: quantity,
          });
          this.loggingService.logSuccess(
            `Added ${quantity} ${product.title} to cart`,
            EventCode.CART_ADD
          );
        }
      })
      .catch((err) => {
        this.loggingService.logError(err, EventCode.CART_ADD);
      });
  }
}
