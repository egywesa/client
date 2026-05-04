import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {Invoice} from "../../../../../shared/models/invoice";
import {CalculateService} from "../../calculate.service";
import {InvoiceService} from "../../invoice.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-third-design',
  templateUrl: './third-design.component.html',
  styleUrls: ['./third-design.component.scss']
})
export class ThirdDesignComponent implements OnInit {
  @Input('invoice') invoice: Invoice;
  @Input('baseUrl') baseUrl: string;
  @Input('isDownload') isDownload: boolean;
  @Input('isShow') isShow: boolean;
  qrCode: string;
  
  companyIdsWithAdvanceDiscount = [199, 39, 511, 283];
  isAdvanceDiscountCompany(id: number): boolean {
    return this.companyIdsWithAdvanceDiscount.includes(id);
  }

  constructor(public calculateService: CalculateService, private invoiceService: InvoiceService, public translate: TranslateService) { }

  ngOnInit(): void {
   // this.generateQrCode();
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
