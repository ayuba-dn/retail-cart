import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductComponent } from './product.component';
import { Product } from '../../models/product.model'; // Import the Product model

describe('ProductComponent', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;

  // Define a mock product
  const mockProduct: Product = {
    id: 1,
    title: 'Test Product',
    price: 100,
    description: 'A test product description',
    category: 'Test Category',
    rating: 4.5,
    thumbnail: 'test-image.jpg',
    // Add other fields as necessary
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

  // Add more tests as needed
});
