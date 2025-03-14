import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarComponent } from './navbar.component';
import { LoggingService } from '../../services/logging.service';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { of } from 'rxjs';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  const loggingServiceMock: jasmine.SpyObj<LoggingService> =
    jasmine.createSpyObj('LoggingService', ['logSuccess']);

  const cartServiceMock: jasmine.SpyObj<CartService> = jasmine.createSpyObj(
    'CartService',
    ['getCartItems']
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
    cartServiceMock.getCartItems.and.returnValue(of([]));
    fixture.detectChanges();
    component.cartItems.subscribe((items) => {
      expect(items).toEqual([]);
    });
  });
});
