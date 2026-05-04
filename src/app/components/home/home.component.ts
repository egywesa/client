import { Component, OnInit } from '@angular/core';
import {HomeService} from "./home.service";
import {IInvoice} from "../../shared/models/invoice";
import {IPayment, IPaymentOut} from "../../shared/models/payment";
import {PriceService} from "../admin/price/price.service";
import {AccountService} from "../account/account.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private homeService: HomeService, private priceService: PriceService,
              public accountService: AccountService) { }
  totalNormalInvoices = 0;
  totalSimpleInvoices = 0;
  totalCredit = 0;
  totalDebit = 0;
  recentInvoices: IInvoice[] = [];
  currentPayment: IPaymentOut;

  ngOnInit(): void {
    this.loadHomeStatistics();
    this.loadCurrentPrice();
  }

  loadHomeStatistics() {
    this.homeService.loadStatistics().subscribe(response => {
      this.totalNormalInvoices = response["totalNormalInvoices"];
      this.totalSimpleInvoices = response["totalSimpleInvoices"];
      this.totalCredit = response["totalCredit"];
      this.totalDebit = response["totalDebit"];
      this.recentInvoices = response["recentInvoices"];
    });
  }

  //  getTotal(invoice: IInvoice): number {
  //    if (invoice.invoiceType == 1 && invoice.shortOrLong == 0) {
  //     return invoice.total;
  //  } else {
  //    let total = 0;
  //    invoice.invoiceItems?.reduce((accumulator, obj) => {
  //      return total += (obj.unitPrice * obj.quantity) + ((obj.tax.taxValue * (obj.unitPrice * obj.quantity)) / 100);
  //     }, 0);

  //     return total;
  //   }
  //  }

  private loadCurrentPrice() {
    this.priceService.getCurrentPrice().subscribe(payment => {
      this.currentPayment = payment;
    });
  }

}
