import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import jsPDF from 'jspdf';
import { Invoice } from 'src/app/shared/models/invoice';
import { environment } from 'src/environments/environment';
import { InvoiceService } from '../invoice.service';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-invoice-download',
  templateUrl: './invoice-download.component.html',
  styleUrls: ['./invoice-download.component.scss']
})
export class InvoiceDownloadComponent implements OnInit {
  invoice: Invoice;
  baseUrl = environment.baseUrl;

  constructor(
    private invoiceService: InvoiceService,
    private activatedRoute: ActivatedRoute
  ) { }

  id: any;
  designnum: any;

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.loadInvoice(this.id);
    this.getdesign();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const data = document.getElementById('PdfDocument');
      if (!data) return;

      // Apply print styles
      const style = document.createElement('style');
      style.textContent = `
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .table-head {
            background-color: #14678f !important;
            color: white !important;
          }
          .total-label {
            background-color: #f8f9fa !important;
          }
          .total-table tr:last-child td {
            background-color: #f8f9fa !important;
          }
        }

        /* Fix Arabic text rendering */
        * {
          font-family: 'XB Riyaz', Arial, sans-serif !important;
          letter-spacing: 0 !important;
          word-spacing: 0 !important;
          text-rendering: optimizeLegibility !important;
          -webkit-font-smoothing: antialiased !important;
          -moz-osx-font-smoothing: grayscale !important;
        }

        /* Fix table text */
        table td, table th {
          font-family: 'XB Riyaz', Arial, sans-serif !important;
          letter-spacing: 0 !important;
          word-spacing: 0 !important;
          text-rendering: optimizeLegibility !important;
          -webkit-font-smoothing: antialiased !important;
          -moz-osx-font-smoothing: grayscale !important;
        }

        /* Fix total table text */
        .total-table td, .total-table th {
          font-family: 'XB Riyaz', Arial, sans-serif !important;
          letter-spacing: 0 !important;
          word-spacing: 0 !important;
          text-rendering: optimizeLegibility !important;
          -webkit-font-smoothing: antialiased !important;
          -moz-osx-font-smoothing: grayscale !important;
        }
      `;
      data.appendChild(style);

      const date = new Date();

      html2canvas(data, {
        scale: 2,
        logging: false,
        allowTaint: true,
        useCORS: true,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
          // Apply print styles to cloned document
          const clonedStyle = clonedDoc.createElement('style');
          clonedStyle.textContent = `
            @media print {
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              .table-head {
                background-color: #14678f !important;
                color: white !important;
              }
              .total-label {
                background-color: #f8f9fa !important;
              }
              .total-table tr:last-child td {
                background-color: #f8f9fa !important;
              }
            }

            /* Fix Arabic text rendering */
            * {
              font-family: 'XB Riyaz', Arial, sans-serif !important;
              letter-spacing: 0 !important;
              word-spacing: 0 !important;
              text-rendering: optimizeLegibility !important;
              -webkit-font-smoothing: antialiased !important;
              -moz-osx-font-smoothing: grayscale !important;
            }

            /* Fix table text */
            table td, table th {
              font-family: 'XB Riyaz', Arial, sans-serif !important;
              letter-spacing: 0 !important;
              word-spacing: 0 !important;
              text-rendering: optimizeLegibility !important;
              -webkit-font-smoothing: antialiased !important;
              -moz-osx-font-smoothing: grayscale !important;
            }

            /* Fix total table text */
            .total-table td, .total-table th {
              font-family: 'XB Riyaz', Arial, sans-serif !important;
              letter-spacing: 0 !important;
              word-spacing: 0 !important;
              text-rendering: optimizeLegibility !important;
              -webkit-font-smoothing: antialiased !important;
              -moz-osx-font-smoothing: grayscale !important;
            }
          `;
          clonedDoc.head.appendChild(clonedStyle);
        }
      }).then(canvas => {
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        const contentDataURL = canvas.toDataURL('image/png', 1.0);
        const pdf = new jsPDF('p', 'mm', 'a4', true);

        // Add first page
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pageHeight;

        // Add additional pages if needed
        while (heightLeft > 0) {
          position = -pageHeight;
          pdf.addPage();
          pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
          heightLeft -= pageHeight;
        }

        // Save the PDF
        pdf.save(`Invoice-${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}.pdf`);
      });
    }, 1000);
  }

  private loadInvoice(id) {
    this.invoiceService.getInvoice(id).subscribe(invoice => this.invoice = invoice);
  }

  getdesign() {
    this.invoiceService.getInvoicedesign().subscribe(res => {
      this.designnum = res;
      if (this.designnum == '0') {
        this.designnum = '3';
      }
    });
  }
}
