import { Component, OnInit,Input, Renderer2, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Invoice } from 'src/app/shared/models/invoice';
import { environment } from 'src/environments/environment';
import { InvoiceService } from '../../invoice.service';
import { CalculateService } from '../../calculate.service';

@Component({
  selector: 'app-showdraft',
  templateUrl: './showdraft.component.html',
  styleUrls: ['./showdraft.component.scss']
})
export class ShowdraftComponent implements OnInit {
  invoice: Invoice;
  baseUrl = environment.baseUrl;
 
  @Input('isDownload') isDownload: boolean;
  @Input('isShow') isShow: boolean;
  constructor(private invoiceService: InvoiceService,public calculateService: CalculateService,
    private activatedRoute: ActivatedRoute,
    private renderer: Renderer2,
    private el: ElementRef) { }
id:any;
  ngOnInit(): void {
    this.id=this.activatedRoute.snapshot.paramMap.get('id');
    console.log(this.activatedRoute.snapshot.paramMap.get('id'))
    this.loadInvoice(this.id);

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
  

  ngAfterViewInit(): void {
    if (!this.isDownload && !this.isShow) {
     // this.printInvoice();
      }
      
    }

  printInvoice() {
    setTimeout(function () {
      window.print();
    }, 2500);
  }

}
