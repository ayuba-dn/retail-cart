import { Product } from './product.model';

export interface GetProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}
