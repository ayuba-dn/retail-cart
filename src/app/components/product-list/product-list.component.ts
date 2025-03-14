import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ProductComponent } from '../product/product.component';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { QuantityModalComponent } from '../quantity-modal/quantity-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoggingService } from '../../services/logging.service';
import { EventCode } from '../../models/event-code.enum';
import { GetProductsResponse } from '../../models/get-products-response.model';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ProductComponent, CommonModule, ReactiveFormsModule],
  providers: [ProductService],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  productsLoading = true;
  products: Product[] = [];
  filteredProducts: Product[] = [];
  cartService = inject(CartService);
  modalService = inject(NgbModal);
  loggingService = inject(LoggingService);
  productService = inject(ProductService);
  errorFetchingProducts: string | null = null;
  cartItems = this.cartService.getCartItems();
  searchForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      searchQuery: [''],
    });
  }

  ngOnInit(): void {
    this.productService
      .getProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: GetProductsResponse) => {
          this.products = response.products;
          this.filteredProducts = this.products;
          this.loggingService.logSuccess(
            'Products fetched successfully',
            EventCode.PRODUCT_FETCH_SUCCESS
          );
          this.productsLoading = false;
        },
        error: () => {
          this.errorFetchingProducts =
            'There was an error fetching the products. Please try again later.';
          this.productsLoading = false;
        },
      });

    this.searchForm
      .get('searchQuery')
      ?.valueChanges.pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe((query) => {
        this.filterProducts(query);
      });
  }

  filterProducts(query: string): void {
    this.filteredProducts = this.products.filter((product) =>
      product.title.toLowerCase().includes(query.toLowerCase())
    );
  }

  trackByProductId(index: number, product: Product): number {
    return product.id;
  }

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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
