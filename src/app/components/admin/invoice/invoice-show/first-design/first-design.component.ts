import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {IInvoice, Invoice} from "../../../../../shared/models/invoice";
import {CalculateService} from "../../calculate.service";
import { InvoiceService } from '../../invoice.service';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-first-design',
  templateUrl: './first-design.component.html',
  styleUrls: ['./first-design.component.scss']
})
export class FirstDesignComponent implements OnInit {
  @Input('invoice') invoice: Invoice;
  @Input('baseUrl') baseUrl: string;
  @Input('isDownload') isDownload: boolean;
  @Input('isShow') isShow: boolean;
  qrCode: string;

  constructor(public calculateService: CalculateService, private invoiceService: InvoiceService, public translate: TranslateService) { }

  ngOnInit(): void {
 
  }
companyIdsWithAdvanceDiscount = [199, 39, 511, 283];
isAdvanceDiscountCompany(id: number): boolean {
  return this.companyIdsWithAdvanceDiscount.includes(id);
}
  ngAfterViewInit(): void {
    if (!this.isDownload && !this.isShow) {
      this.printInvoice();
      }
      
    }

  printInvoice() {
    setTimeout(function () {
      window.print();
    }, 2500);
  }
}


