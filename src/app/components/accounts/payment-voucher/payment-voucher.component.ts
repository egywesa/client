import { Component, OnInit } from '@angular/core';
import { ISupplier } from 'src/app/shared/models/suppliers';
import { PaymentVoucherService } from './payment-voucher.service';
import { IBank } from 'src/app/shared/models/bank';

@Component({
  selector: 'app-payment-voucher',
  templateUrl: './payment-voucher.component.html',
  styleUrls: ['./payment-voucher.component.scss'],
})
export class PaymentVoucherComponent implements OnInit {
  banks: IBank[] = [];
  suppliers: ISupplier[] = [];

  constructor(private paymentVoucherService: PaymentVoucherService) {}

  ngOnInit(): void {
    this.paymentVoucherService
      .getBanks()
      .subscribe((banks) => (this.banks = banks));

    this.paymentVoucherService
      .getSuppliers()
      .subscribe((suppliers) => (this.suppliers = suppliers.data));
  }
}
