import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Invoice } from 'src/app/shared/models/invoice';
import { environment } from 'src/environments/environment';
import { CalculateService } from '../../calculate.service';
import { InvoiceService } from '../../invoice.service';

@Component({
  selector: 'app-printdraft',
  templateUrl: './printdraft.component.html',
  styleUrls: ['./printdraft.component.scss']
})
export class PrintdraftComponent implements OnInit {
  invoice: Invoice;
  baseUrl = environment.baseUrl;

  constructor(private invoiceService: InvoiceService, public calculateService: CalculateService,
    private activatedRoute: ActivatedRoute,
    private renderer: Renderer2,
    private el: ElementRef) { }
  id: any;
  designnum: any;
  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    console.log(this.activatedRoute.snapshot.paramMap.get('id'))
    this.loadInvoice(this.id);

  }
  ngAfterViewInit(): void {
  //  setTimeout(function () {

    //   const element = document.getElementById('PdfDocument');
    //   console.log("element")
    //   console.log(element)
    //   const iframe = document.body.appendChild(document.createElement("iframe"));
    //   iframe.style.display = "none";
    //   const idoc = iframe.contentDocument;

    //   if (idoc != null) {
    //     idoc.head.innerHTML = document.head.innerHTML;
    //     idoc.body.appendChild(element.cloneNode(true));

    //     const pageStyles = window.getComputedStyle(document.body);

    //     const style = document.createElement('style');
    //     style.textContent = pageStyles.cssText;
    //     idoc.head.appendChild(style);

    //     const breakRule = `@media print {
    //   .print-section {
    //     page-break-before: always;
    //   }
    // }`;

    //     style.textContent += breakRule;

    //     window.setTimeout(() => {
    //       iframe.contentWindow?.print();
    //       document.body.removeChild(iframe);
    //     }, 500);
    //   }
    //   // Handle the load event
    //   console.log('Page loaded');

    // }, 500);

this.printInvoice()
    }
  
  private loadInvoice(id) {
    this.invoiceService.getInvoice(id).subscribe(invoice => {
      this.invoice = invoice;
      if (this.invoice.isDraft) {
        const billElement = this.el.nativeElement.querySelector('.bill');
        if (billElement) {
          this.renderer.addClass(billElement, 'is-draft');
        }
      }
    });
  }
  printInvoice() {
    setTimeout(function () {
      window.print();
    }, 1000);
  }

}
