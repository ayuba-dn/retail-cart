import { TestBed } from '@angular/core/testing';

import { API_URL, ProductService } from './product.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

describe('ProductService', () => {
  let service: ProductService;
  let httpClientMock: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'HttpClient',
    ['get']
  );

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: HttpClient,
          useValue: httpClientMock,
        },
        {
          provide: API_URL,
          useValue: 'https://fakestoreapi.com/products',
        },
      ],
    });
    service = TestBed.inject(ProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
