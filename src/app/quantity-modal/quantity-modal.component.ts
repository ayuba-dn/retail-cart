import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-quantity-modal',
  templateUrl: './quantity-modal.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class QuantityModalComponent {
  @Input() quantity: number = 1;

  constructor(public activeModal: NgbActiveModal) {}
  handleAddToCart() {
    this.activeModal.close(this.quantity);
  }
}
