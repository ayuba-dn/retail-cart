import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  FormControl,
  FormsModule,
} from '@angular/forms';
import { CartService } from '../../services/cart-service.service';
import { debounceTime } from 'rxjs/operators';
import { RouterLink } from '@angular/router';
import { EventCode } from '../../models/event-code.enum';
import { LoggingService } from '../../services/logging.service';
import { Observable } from 'rxjs';
import { CartItem } from '../../models/cart-item.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  cartService = inject(CartService);
  loggingService = inject(LoggingService);
  cartItems: Observable<CartItem[]> = this.cartService.getCartItems();
  cartForm: FormGroup;
  grandTotal: number = 0;
  discountCode: string = '';
  discountError: string | null = null;
  discountApplied: boolean = false;

  constructor(private fb: FormBuilder) {
    this.cartForm = this.fb.group({});
    this.cartItems.subscribe((items) => {
      this.grandTotal = items.reduce(
        (total: number, item: any) => total + item.price * item.quantity,
        0
      );
      items.forEach((item) => {
        const control = this.fb.control(item.quantity);
        control.valueChanges.pipe(debounceTime(300)).subscribe((quantity) => {
          if (typeof quantity === 'number') {
            this.cartService.updateItemQuantity(item.id, quantity);
          }
        });
        this.cartForm.addControl(item.id, control);
      });
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
    if (this.discountCode === 'SAVE10') {
      this.grandTotal *= 0.9;
      this.discountApplied = true;
      this.loggingService.logSuccess(
        `Discount applied: ${this.discountCode}`,
        EventCode.DISCOUNT_APPLIED
      );
    } else {
      this.discountError = 'Invalid discount code';
    }
  }

  resetDiscount() {
    this.discountCode = '';
    this.discountApplied = false;
    this.discountError = null;
    this.loggingService.logSuccess(`Discount reset`, EventCode.DISCOUNT_RESET);
  }
}
