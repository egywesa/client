import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {environment} from "../../../../environments/environment";
import {PriceService} from "../price/price.service";
import {IPrice} from "../../../shared/models/price";
import {PaymentService} from "../after-payment-success/payment.service";
import {IPayment} from "../../../shared/models/payment";
import {AccountService} from "../../account/account.service";

@Component({
  selector: 'app-renew-payment',
  templateUrl: './renew-payment.component.html',
  styleUrls: ['./renew-payment.component.scss']
})
export class RenewPaymentComponent implements OnInit {
  baseUrl = environment.baseUrl;
  prices: IPrice[] = [];
  currentPayment: IPayment;

  constructor(private priceService: PriceService, private paymentService: PaymentService,
              public accountService: AccountService) { }

  ngOnInit(): void {
    this.initializePrices();
    this.loadCurrentPrice();
  }

  redirectToPaymentForm(amount: number) {
    this.paymentService.redirectToPaymentForm(amount).subscribe(response => {
      window.location.href = response["redirectLink"];
    });
  }

  private initializePrices() {
    this.priceService.getPrices().subscribe(prices => {
      console.log(prices)
      this.prices = prices
    });
  }

  private loadCurrentPrice() {
    this.priceService.getCurrentPrice().subscribe(payment => {
      this.currentPayment = payment;
    });
  }
}
