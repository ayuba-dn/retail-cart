import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartComponent } from './cart.component';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { of } from 'rxjs';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  const cartServiceMock: jasmine.SpyObj<CartService> = jasmine.createSpyObj(
    'CartService',
    ['getCartItems', 'removeItem']
  );
  cartServiceMock.getCartItems.and.returnValue(of([]));
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartComponent],
      providers: [
        { provide: ActivatedRoute, useValue: {} },
        {
          provide: CartService,
          useValue: cartServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show cart items', () => {
    component.cartItems.subscribe((items) => {
      console.log(items);
      expect(items).toEqual([]);
    });
  });

  it('should call cartService.removeItem', () => {
    component.removeItem('1');
    expect(cartServiceMock.removeItem).toHaveBeenCalledWith('1');
  });

  it('discount should be applied if coupon code SAVE10', () => {
    component.discountCode = 'SAVE10';
    component.grandTotal = 100;
    component.applyDiscount();
    expect(component.grandTotal).toEqual(90);
  });

  it('discount should not be applied if coupon code is not SAVE10', () => {
    component.discountCode = 'WRONGCODE';
    component.grandTotal = 100;
    component.applyDiscount();
    expect(component.grandTotal).toEqual(100);
  });

  it('should reset discount', () => {
    component.discountCode = 'SAVE10';
    component.resetDiscount();
    expect(component.discountCode).toEqual('');
    expect(component.discountApplied).toEqual(false);
    expect(component.discountError).toEqual(null);
  });

  it('should unsubscribe from all subscriptions when destroyed', () => {
    const spy = spyOn(component['destroy$'], 'next');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });

  it('getFormControl should return the correct form control', () => {
    const formControl = component.getFormControl('1');
    expect(formControl).toBeDefined();
  });

  it('formControl should be created for each cart item', () => {
    component.cartItems = of([
      { id: '1', name: 'Test Product', price: 100, quantity: 1 },
    ]);
    component.ngOnInit();
    expect(component.cartForm.contains('1')).toBeTruthy();
  });
});
