import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarComponent } from './navbar.component';
import { LoggingService } from '../../services/logging.service';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../services/cart-service.service';
import { of } from 'rxjs';
import { CartItem } from '../../models/cart-item.model';

const mockCartItems: CartItem[] = [
  {
    id: '1',
    name: 'Test Product',
    price: 100,
    quantity: 1,
  },
  {
    id: '2',
    name: 'Test Product 2',
    price: 200,
    quantity: 2,
  },
];
describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  let loggingServiceMock: jasmine.SpyObj<LoggingService> = jasmine.createSpyObj(
    'LoggingService',
    ['logSuccess']
  );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        { provide: LoggingService, useValue: loggingServiceMock },
        { provide: ActivatedRoute, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show cart items', () => {
    const cartServiceMock: jasmine.SpyObj<CartService> = jasmine.createSpyObj(
      'CartService',
      ['getCartItems']
    );
    cartServiceMock.getCartItems.and.returnValue(of([]));
    component.cartItems.subscribe((items) => {
      expect(items).toEqual([]);
    });
  });
});
