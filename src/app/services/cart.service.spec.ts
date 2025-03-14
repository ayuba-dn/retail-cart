import { inject, TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { CartItem } from '../models/cart-item.model';

describe('CartService', () => {
  let service: CartService;
  let mockCartItem: CartItem;
  let store: { [key: string]: string } = {};

  const localStorageMock = {
    getItem: (key: string): string | null => {
      return store[key] || null;
    },
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);

    // Replace the global localStorage with the mock
    spyOn(localStorage, 'getItem').and.callFake(localStorageMock.getItem);
    spyOn(localStorage, 'setItem').and.callFake(localStorageMock.setItem);
    spyOn(localStorage, 'removeItem').and.callFake(localStorageMock.removeItem);
    spyOn(localStorage, 'clear').and.callFake(localStorageMock.clear);

    localStorage.clear();
    mockCartItem = {
      name: 'Test Product',
      id: '1',
      price: 100,
      quantity: 1,
    };
  });

  afterAll(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add item to cart', () => {
    service.addItem(mockCartItem);
    service.getCartItems().subscribe((items) => {
      expect(items.length).toBe(1);
      expect(items[0]).toEqual(mockCartItem);
    });
  });

  it('should increase quantity if item already exists', () => {
    service.addItem(mockCartItem);
    service.addItem(mockCartItem);
    service.getCartItems().subscribe((items) => {
      expect(items.length).toBe(1);
      expect(items[0].quantity).toBe(2);
    });
  });

  it('should remove item from cart', () => {
    service.addItem(mockCartItem);
    service.removeItem(mockCartItem.id);
    service.getCartItems().subscribe((items) => {
      expect(items.length).toBe(0);
    });
  });

  it('should update item quantity', () => {
    service.addItem(mockCartItem);
    service.updateItemQuantity(mockCartItem.id, 5);
    service.getCartItems().subscribe((items) => {
      expect(items[0].quantity).toBe(5);
    });
  });

  it('should persist cart items in localStorage', () => {
    service.addItem(mockCartItem);
    const savedCart = localStorage.getItem('cartItems');
    expect(savedCart).toBeTruthy();
    expect(JSON.parse(savedCart!)).toEqual([mockCartItem]);
  });

  it('should load cart items from localStorage on initialization', () => {
    localStorage.setItem('cartItems', JSON.stringify([mockCartItem]));
    service = new CartService();
    service.getCartItems().subscribe((items) => {
      console.log(items);
      expect(items).toEqual([mockCartItem]);
    });
  });
});
