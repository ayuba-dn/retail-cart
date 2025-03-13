import { Inject, Injectable, InjectionToken, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Product } from '../models/product.model';

export const API_URL = new InjectionToken<string>('API_URL');

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  readonly productSignal = signal<Product[]>([]);

  constructor(
    private http: HttpClient,
    @Inject(API_URL) private apiUrl: string
  ) {
    this.loadProducts();
  }

  private loadProducts() {
    this.http
      .get<{ products: Product[] }>(this.apiUrl)
      .pipe(
        tap((data) => {
          console.log('data is>>>', data);
          this.productSignal.set(data.products);
        })
      )
      .subscribe();
  }
}
