import {Component, OnInit} from '@angular/core';
import {InvoiceService} from "../invoice.service";
import {ActivatedRoute} from "@angular/router";
import {DiscountType, IInvoice, Invoice, InvoiceItem, PendingMoneyType} from "../../../../shared/models/invoice";
import {environment} from "../../../../../environments/environment";

@Component({
  selector: 'app-invoice-show',
  templateUrl: './invoice-notification-show.component.html',
  styleUrls: ['./invoice-notification-show.component.scss']
})
export class InvoiceNotificationShowComponent implements OnInit {
  invoice: Invoice;
  baseUrl = environment.baseUrl;

  constructor(private invoiceService: InvoiceService,
    private activatedRoute: ActivatedRoute) { }
    designnum:any;
  ngOnInit(): void {
    this.loadInvoice(+this.activatedRoute.snapshot.paramMap.get('id'));
    this.getdesign();
  }

  ngAfterViewInit(): void {
    // setTimeout(function () {
    //
    //   const element = document.getElementById('PdfDocument');
    //   console.log("element")
    //   console.log(element)
    //   const iframe = document.body.appendChild(document.createElement("iframe"));
    //   iframe.style.display = "none";
    //   const idoc = iframe.contentDocument;
    //
    //   if (idoc != null) {
    //     idoc.head.innerHTML = document.head.innerHTML;
    //     idoc.body.appendChild(element.cloneNode(true));
    //
    //     const pageStyles = window.getComputedStyle(document.body);
    //
    //     const style = document.createElement('style');
    //     style.textContent = pageStyles.cssText;
    //     idoc.head.appendChild(style);
    //
    //     const breakRule = `@media print {
    //   .print-section {
    //     page-break-before: always;
    //   }
    // }`;
    //
    //     style.textContent += breakRule;
    //
    //     window.setTimeout(() => {
    //       iframe.contentWindow?.print();
    //       document.body.removeChild(iframe);
    //     }, 500);
    //   }
    //   // Handle the load event
    //   console.log('Page loaded');
    //
    // }, 500);
}

  private loadInvoice(id) {
      this.invoiceService.getInvoiceWithNotification(id).subscribe(invoice => this.invoice = invoice);

      console.log(this.invoice);
  }
  getdesign(){
    this.invoiceService.getInvoicedesign().subscribe(res=>{
      console.log(res)
      this.designnum=res
      if(this.designnum=='0'){
        this.designnum='3';
      }
    })
  }
}
