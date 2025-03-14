import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GetProductsResponse } from '../models/get-products-response.model';
import { LoggingService } from './logging.service';
import { EventCode } from '../models/event-code.enum';

const API_URL = 'https://dummyjson.com/products?limit=9'; // Todo: This should be extracted from the environment variables

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private searchProductsSubject = new Subject<string>();
  searchProducts$ = this.searchProductsSubject.asObservable();
  constructor(
    private http: HttpClient,
    private loggingService: LoggingService
  ) {}

  public getProducts(): Observable<GetProductsResponse> {
    return this.http.get<GetProductsResponse>(API_URL).pipe(
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
