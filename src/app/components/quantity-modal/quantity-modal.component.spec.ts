import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuantityModalComponent } from './quantity-modal.component';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

describe('QuantityModalComponent', () => {
  let component: QuantityModalComponent;
  let fixture: ComponentFixture<QuantityModalComponent>;
  let modalServiceMock: jasmine.SpyObj<NgbModal> = jasmine.createSpyObj(
    'NgbModal',
    ['open']
  );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuantityModalComponent],
      providers: [
        { provide: NgbModal, useValue: modalServiceMock },
        NgbActiveModal,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(QuantityModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('handleAddToCart should call active modal close method', () => {
    const mockActiveModal = jasmine.createSpyObj('NgbActiveModal', ['close']);
    component.activeModal = mockActiveModal;
    component.handleAddToCart();
    expect(mockActiveModal.close).toHaveBeenCalledWith(1);
  });
});
