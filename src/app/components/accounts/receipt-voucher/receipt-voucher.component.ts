import { Component, OnInit } from '@angular/core';
import { IClient } from 'src/app/shared/models/client';
import { ReceiptVoucherService } from './receipt-voucher.service';
import { IBank } from 'src/app/shared/models/bank';

@Component({
  selector: 'app-receipt-voucher',
  templateUrl: './receipt-voucher.component.html',
  styleUrls: ['./receipt-voucher.component.scss'],
})
export class ReceiptVoucherComponent implements OnInit {
  banks: IBank[] = [];
  clients: IClient[] = [];

  constructor(private receiptVoucherService: ReceiptVoucherService) {}

  ngOnInit(): void {
    this.receiptVoucherService
      .getBanks()
      .subscribe((banks) => (this.banks = banks));

    this.receiptVoucherService
      .getClients()
      .subscribe((clients) => (this.clients = clients.data));
  }
}
