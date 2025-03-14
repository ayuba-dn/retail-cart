import { TestBed } from '@angular/core/testing';

import { ProductService } from './product.service';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';

describe('ProductService', () => {
  let service: ProductService;
  let httpClientMock: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'HttpClient',
    ['get']
  );
  httpClientMock.get.and.returnValue(of([]));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: HttpClient,
          useValue: httpClientMock,
        },
      ],
    });
    service = TestBed.inject(ProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('function getProducts should return an observable', () => {
    const result = service.getProducts();
    expect(result).toBeInstanceOf(Observable);
  });

  //test for error handling
  it('function getProducts should return an error if the http request fails', () => {
    const fetchProductsError =
      'Failed to fetch products. Please try again later.';
    httpClientMock.get.and.returnValue(
      throwError(() => new Error(fetchProductsError))
    );
    service.getProducts().subscribe({
      error: (error) => expect(error.message).toBe(fetchProductsError),
    });
  });
});
