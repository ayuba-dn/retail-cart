import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  FormControl,
  FormsModule,
  Validators,
} from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { RouterLink } from '@angular/router';
import { EventCode } from '../../models/event-code.enum';
import { LoggingService } from '../../services/logging.service';
import { Observable, Subject } from 'rxjs';
import { CartItem } from '../../models/cart-item.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnDestroy, OnInit {
  cartService = inject(CartService);
  loggingService = inject(LoggingService);

  cartForm: FormGroup;
  discountForm: FormGroup;
  grandTotal = 0;
  discountError: string | null = null;
  discountSuccessMessage: string | null = null;
  discountApplied = false;
  couponCodesApplied = new Map<string, boolean>();

  cartItems: Observable<CartItem[]> = this.cartService.getCartItems();
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder) {
    this.cartForm = this.fb.group({});
    this.discountForm = this.fb.group({
      discountCode: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.cartItems.subscribe((items) => {
      this.grandTotal = items.reduce(
        (total: number, item: CartItem) => total + item.price * item.quantity,
        0
      );
      items.forEach((item) => {
        const control = this.fb.control(item.quantity);
        control.valueChanges
          .pipe(debounceTime(300), takeUntil(this.destroy$))
          .subscribe((quantity) => {
            if (typeof quantity === 'number') {
              this.cartService.updateItemQuantity(item.id, quantity);
            }
          });
        this.cartForm.addControl(item.id, control);
      });
    });

    const storedDiscountCode = localStorage.getItem('discountCode');
    if (storedDiscountCode && this.isValidDiscountCode(storedDiscountCode)) {
      this.discountForm.get('discountCode')?.setValue(storedDiscountCode);
      this.applyValidDiscount();
    }

    this.discountForm.get('discountCode')?.valueChanges.subscribe(() => {
      this.clearError();
      if (this.discountApplied) {
        this.discountApplied = false;
      }
    });
  }

  removeItem(itemId: string) {
    this.cartService.removeItem(itemId);
    this.cartForm.removeControl(itemId);
    this.loggingService.logSuccess(
      `Item removed from cart`,
      EventCode.CART_REMOVE
    );
  }

  getFormControl(itemId: string): FormControl {
    return this.cartForm.get(itemId) as FormControl;
  }

  applyDiscount() {
    const discountCode = this.discountForm.get('discountCode')?.value;
    if (this.isValidDiscountCode(discountCode)) {
      if (!this.couponCodesApplied.has(discountCode)) {
        this.applyValidDiscount();
        this.saveAppliedDiscount(discountCode);
        this.couponCodesApplied.set(discountCode, true);
      } else {
        this.discountError = 'Coupon code already applied';
      }
    } else {
      this.handleInvalidDiscount();
    }
  }

  private isValidDiscountCode(code: string): boolean {
    return code === 'SAVE10';
  }

  private applyValidDiscount() {
    const originalTotal = this.grandTotal;
    this.grandTotal *= 0.9;
    this.discountApplied = true;
    const discountPercentage = this.calculateDiscountPercentage(originalTotal);
    this.discountSuccessMessage = `${discountPercentage}% Discount applied`;
    this.loggingService.logSuccess(
      `Discount applied: SAVE10`,
      EventCode.DISCOUNT_APPLIED
    );
  }

  private calculateDiscountPercentage(originalTotal: number): string {
    const discountPercentage =
      ((originalTotal - this.grandTotal) / originalTotal) * 100;
    return discountPercentage.toFixed(2);
  }

  private handleInvalidDiscount() {
    this.discountForm.reset();
    this.discountError = 'Invalid discount code';
    this.discountSuccessMessage = null;
  }

  private saveAppliedDiscount(discountCode: string) {
    localStorage.setItem('discountCode', discountCode);
  }

  clearError() {
    this.discountError = null;
  }

  cancelDiscount() {
    this.discountForm.reset();
    this.discountApplied = false;
    this.discountSuccessMessage = null;
    this.discountError = null;
    localStorage.removeItem('discountCode');
    this.loggingService.logSuccess(
      'Discount cancelled',
      EventCode.DISCOUNT_CANCELLED
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
