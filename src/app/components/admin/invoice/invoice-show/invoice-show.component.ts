import {AfterViewInit, Component, OnInit} from '@angular/core';
import {InvoiceService} from "../invoice.service";
import {ActivatedRoute} from "@angular/router";
import {DiscountType, IInvoice, Invoice, InvoiceItem, PendingMoneyType} from "../../../../shared/models/invoice";
import {environment} from "../../../../../environments/environment";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-invoice-show',
  templateUrl: './invoice-show.component.html',
  styleUrls: ['./invoice-show.component.scss']
})
export class InvoiceShowComponent implements OnInit  {
  invoice: Invoice;
  baseUrl = environment.baseUrl;
  id:any;
  designnum:any;

  constructor(private invoiceService: InvoiceService,
              private activatedRoute: ActivatedRoute,
              public translate: TranslateService) { }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');

    this.loadInvoice(this.id);
   this.getdesign();
  }

  private loadInvoice(id) {
    this.invoiceService.getInvoice(id).subscribe(invoice => this.invoice = invoice);
  }
  getdesign(){
    this.invoiceService.getInvoicedesign().subscribe(res=>{

      this.designnum = res;

      if(this.designnum == '0'){
        this.designnum='3';
      }
    })
  }
}
