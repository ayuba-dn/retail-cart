import { Inject, Injectable, InjectionToken, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GetProductsResponse } from '../models/get-products-response.model';
import { LoggingService } from './logging.service';
import { EventCode } from '../models/event-code.enum';
export const API_URL = new InjectionToken<string>('API_URL');

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(
    private http: HttpClient,
    private loggingService: LoggingService,
    @Inject(API_URL) private apiUrl: string
  ) {}

  public getProducts(): Observable<GetProductsResponse> {
    return this.http.get<GetProductsResponse>(this.apiUrl).pipe(
      catchError((error: HttpErrorResponse) => {
        this.loggingService.logError(
          error.message,
          EventCode.PRODUCT_FETCH_FAILURE
        );
        return throwError(
          () => new Error('Failed to fetch products. Please try again later.')
        );
      })
    );
  }
}
