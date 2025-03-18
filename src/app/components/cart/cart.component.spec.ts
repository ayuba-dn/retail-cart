import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartComponent } from './cart.component';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';

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
      imports: [CartComponent, ReactiveFormsModule],
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
      expect(items).toEqual([]);
    });
  });

  it('should call cartService.removeItem', () => {
    component.removeItem('1');
    expect(cartServiceMock.removeItem).toHaveBeenCalledWith('1');
  });

  it('should apply discount if coupon code SAVE10', () => {
    component.discountForm.get('discountCode')?.setValue('SAVE10');
    component.grandTotal = 100;
    component.applyDiscount();
    expect(component.grandTotal).toEqual(90);
    expect(component.discountSuccessMessage).toContain(
      '10.00% Discount applied'
    );
  });

  it('should not apply discount if coupon code is not SAVE10', () => {
    component.discountForm.get('discountCode')?.setValue('WRONGCODE');
    component.grandTotal = 100;
    component.applyDiscount();
    expect(component.grandTotal).toEqual(100);
    expect(component.discountError).toEqual('Invalid discount code');
  });

  it('should reset discount', () => {
    component.discountForm.get('discountCode')?.setValue('SAVE10');
    component.cancelDiscount();
    expect(component.discountForm.get('discountCode')?.value).toEqual(null);
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

  it('should not apply the same coupon code twice', () => {
    component.discountForm.get('discountCode')?.setValue('SAVE10');
    component.applyDiscount();
    component.applyDiscount(); // Try to apply again
    expect(component.discountError).toEqual('Coupon code already applied');
  });
});
