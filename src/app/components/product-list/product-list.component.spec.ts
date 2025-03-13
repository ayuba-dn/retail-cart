import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../services/product.service';
import { LoggingService } from '../../services/logging.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CartService } from '../../services/cart-service.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { GetProductsResponse } from '../../models/get-products-response.model';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productServiceMock: jasmine.SpyObj<ProductService> = jasmine.createSpyObj(
    'ProductService',
    ['getProducts']
  );
  let cartServiceMock: jasmine.SpyObj<CartService> = jasmine.createSpyObj(
    'CartService',
    ['getCartItems', 'addItem']
  );
  let loggingServiceMock: jasmine.SpyObj<LoggingService> = jasmine.createSpyObj(
    'LoggingService',
    ['logSuccess']
  );
  let modalServiceMock: jasmine.SpyObj<NgbModal> = jasmine.createSpyObj(
    'NgbModal',
    ['open']
  );

  const mockModalRef: Partial<NgbModalRef> = {
    componentInstance: {
      quantity: 1,
    },
    result: Promise.resolve(1),
  };

  modalServiceMock.open.and.returnValue(mockModalRef as NgbModalRef);

  let httpClientMock: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'HttpClient',
    ['get']
  );

  const mockProducts: GetProductsResponse = {
    products: [
      {
        id: 1,
        title: 'Test Product',
        price: 100,
        description: 'Test Description',
        category: 'Test Category',
        thumbnail: 'test-image.jpg',
        rating: 4.5,
      },
    ],
    total: 1,
    skip: 0,
    limit: 1,
  };

  httpClientMock.get.and.returnValue(of(mockProducts));
  cartServiceMock.getCartItems.and.returnValue(of([]));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductListComponent],
      providers: [
        { provide: ProductService, useValue: productServiceMock },
        { provide: LoggingService, useValue: loggingServiceMock },
        { provide: NgbModal, useValue: modalServiceMock },
        { provide: CartService, useValue: cartServiceMock },
        { provide: ActivatedRoute, useValue: {} },
        {
          provide: HttpClient,
          useValue: httpClientMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch products', () => {
    productServiceMock.getProducts.and.returnValue(of(mockProducts));
    component.ngOnInit();
    expect(component.products).toEqual(mockProducts.products);
  });
});
