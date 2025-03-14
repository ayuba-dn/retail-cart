import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../services/product.service';
import { LoggingService } from '../../services/logging.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CartService } from '../../services/cart.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { GetProductsResponse } from '../../models/get-products-response.model';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  const productServiceMock: jasmine.SpyObj<ProductService> = jasmine.createSpyObj(
    'ProductService',
    ['getProducts']
  );
  const cartServiceMock: jasmine.SpyObj<CartService> = jasmine.createSpyObj(
    'CartService',
    ['getCartItems', 'addItem']
  );
  const loggingServiceMock: jasmine.SpyObj<LoggingService> = jasmine.createSpyObj(
    'LoggingService',
    ['logSuccess', 'logError']
  );
  const modalServiceMock: jasmine.SpyObj<NgbModal> = jasmine.createSpyObj(
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

  const httpClientMock: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
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

  it('should filter products', () => {
    component.filterProducts('Test');
    expect(component.filteredProducts).toEqual(mockProducts.products);
  });

  it('should track product by id', () => {
    const product = mockProducts.products[0];
    const index = 0;
    const result = component.trackByProductId(index, product);
    expect(result).toEqual(product.id);
  });

  it('should handle add to cart', () => {
    const product = mockProducts.products[0];
    component.handleAddToCart(product);
    expect(modalServiceMock.open).toHaveBeenCalled();
  });

  it('should handle search', () => {
    component.searchForm.setValue({ searchQuery: 'Test' });
    component.filterProducts('Test');
    expect(component.filteredProducts).toEqual(mockProducts.products);
  });

  it('should handle product fetching error', () => {
    productServiceMock.getProducts.and.returnValue(
      throwError(() => new Error())
    );

    component.productService.getProducts().subscribe({
      error: () => {
        expect(component.errorFetchingProducts).toBe(
          'There was an error fetching the products. Please try again later.'
        );
        expect(component.productsLoading).toBeFalse();
      },
    });
  });

  it('should unsubscribe from all subscriptions when destroyed', () => {
    const spy = spyOn(component['destroy$'], 'next');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });

  it('filterProducts should be called when searchForm value changes', async () => {
    const spy = spyOn(component, 'filterProducts');
    component.searchForm.setValue({ searchQuery: 'Test' });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    expect(spy).toHaveBeenCalledWith('Test');
  });
});
