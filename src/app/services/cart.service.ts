import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/cart-item.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>(this.cartItems);

  constructor() {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
      this.cartSubject.next(this.cartItems);
    }
  }

  getCartItems() {
    return this.cartSubject.asObservable();
  }

  private saveCart() {
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  addItem(item: CartItem) {
    const existingItem = this.cartItems.find(
      (cartItem) => cartItem.id === item.id
    );
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      this.cartItems.push(item);
    }
    this.cartSubject.next(this.cartItems);
    this.saveCart();
  }

  removeItem(itemId: string) {
    this.cartItems = this.cartItems.filter((item) => item.id !== itemId);
    this.cartSubject.next(this.cartItems);
    this.saveCart();
  }

  updateItemQuantity(itemId: string, quantity: number) {
    const item = this.cartItems.find((cartItem) => cartItem.id === itemId);
    if (item) {
      item.quantity = quantity;
      this.cartSubject.next(this.cartItems);
      this.saveCart();
    }
  }
}
