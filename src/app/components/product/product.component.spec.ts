import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductComponent } from './product.component';
import { Product } from '../../models/product.model'; // Import the Product model

describe('ProductComponent', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;

  const mockProduct: Product = {
    id: 1,
    title: 'Test Product',
    price: 100,
    description: 'A test product description',
    category: 'Test Category',
    rating: 4.5,
    thumbnail: 'test-image.jpg',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;

    // Set the mock product as the input
    component.product = mockProduct;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('emitAddToCart should emit addToCart event with current product', () => {
    const spy = spyOn(component.addToCart, 'emit');
    component.emitAddToCart();
    expect(spy).toHaveBeenCalledWith(mockProduct);
  });
});
