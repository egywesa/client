import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Invoice } from 'src/app/shared/models/invoice';
import { environment } from 'src/environments/environment';
import { InvoiceService } from '../invoice.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


@Component({
  selector: 'app-invoice-notification-download',
  templateUrl: './invoice-notification-download.component.html',
  styleUrls: ['./invoice-notification-download.component.scss']
})
export class InvoiceNotificationDownloadComponent implements OnInit {

  invoice: Invoice;
  baseUrl = environment.baseUrl;

  constructor(private invoiceService: InvoiceService,
    private activatedRoute: ActivatedRoute) { }
  designnum: any;
  ngOnInit(): void {
    this.loadInvoice(+this.activatedRoute.snapshot.paramMap.get('id'));
    this.getdesign();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {

      // html2canvas(document.querySelector('#PdfDocument')).then((canvas) => {
      //   let base64image = canvas.toDataURL('image/jpeg');
      //   // let pdf = new jsPDF('p', 'px', [1140, 2100]);
      //   // pdf.addImage(base64image, 'JPEG', 15, 15, 1110, 2000);
      //   // pdf.save('document.pdf');
      // })

      var data = document.getElementById('PdfDocument');

      data.style.fontSize = "20.3px";
      data.style.paddingLeft = "50px";
      data.style.paddingRight = "50px";

      // Add Arabic font styles for better rendering
      const style = document.createElement('style');
      style.textContent = `
        * {
          font-family: 'Cairo', 'Arial', 'Tahoma', sans-serif !important;
          letter-spacing: 0 !important;
          word-spacing: 0 !important;
          text-rendering: optimizeLegibility !important;
          -webkit-font-smoothing: antialiased !important;
          -moz-osx-font-smoothing: grayscale !important;
        }
        
        table td, table th {
          font-family: 'Cairo', 'Arial', 'Tahoma', sans-serif !important;
          letter-spacing: 0 !important;
          word-spacing: 0 !important;
          text-rendering: optimizeLegibility !important;
          -webkit-font-smoothing: antialiased !important;
          -moz-osx-font-smoothing: grayscale !important;
        }
        
        .total-table td, .total-table th {
          font-family: 'Cairo', 'Arial', 'Tahoma', sans-serif !important;
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
          // Apply Arabic font styles to cloned document
          const clonedStyle = clonedDoc.createElement('style');
          clonedStyle.textContent = `
            * {
              font-family: 'Cairo', 'Arial', 'Tahoma', sans-serif !important;
              letter-spacing: 0 !important;
              word-spacing: 0 !important;
              text-rendering: optimizeLegibility !important;
              -webkit-font-smoothing: antialiased !important;
              -moz-osx-font-smoothing: grayscale !important;
            }
            
            table td, table th {
              font-family: 'Cairo', 'Arial', 'Tahoma', sans-serif !important;
              letter-spacing: 0 !important;
              word-spacing: 0 !important;
              text-rendering: optimizeLegibility !important;
              -webkit-font-smoothing: antialiased !important;
              -moz-osx-font-smoothing: grayscale !important;
            }
            
            .total-table td, .total-table th {
              font-family: 'Cairo', 'Arial', 'Tahoma', sans-serif !important;
              letter-spacing: 0 !important;
              word-spacing: 0 !important;
              text-rendering: optimizeLegibility !important;
              -webkit-font-smoothing: antialiased !important;
              -moz-osx-font-smoothing: grayscale !important;
            }
            
            /* Ensure proper Arabic text direction */
            [dir="rtl"] {
              direction: rtl !important;
              text-align: right !important;
            }
            
            /* Fix Arabic text rendering in tables */
            table {
              direction: rtl !important;
            }
            
            table td, table th {
              direction: rtl !important;
              text-align: right !important;
            }
            
            /* Additional Arabic text fixes */
            body {
              font-family: 'Cairo', 'Arial', 'Tahoma', sans-serif !important;
              direction: rtl !important;
              text-align: right !important;
            }
            
            /* Fix for Arabic text in cells */
            td, th {
              font-family: 'Cairo', 'Arial', 'Tahoma', sans-serif !important;
              direction: rtl !important;
              text-align: right !important;
              unicode-bidi: embed !important;
            }
          `;
          clonedDoc.head.appendChild(clonedStyle);
        }
      }).then(canvas => {
        // Few necessary setting options
        var imgWidth = 208;
        var pageHeight = 297;
        var imgHeight = canvas.height * imgWidth / canvas.width;
        var heightLeft = imgHeight;

        const contentDataURL = canvas.toDataURL('image/png');
        let pdf = new jsPDF('p', 'mm', 'a4');

        var position = 0;

        // Function to add a new page with the given image
        function addNewPage(imageData) {
          pdf.addPage();
          pdf.addImage(imageData, 'PNG', 0, position, imgWidth, imgHeight);

          // Update the heightLeft variable with the remaining height on the page
          heightLeft -= pageHeight;

          // If there is still content remaining, call the function recursively to add a new page
          if (heightLeft > 0) {
            position -= pageHeight; // Move to the top of the next page
            addNewPage(contentDataURL);
          } else {
            pdf.save('Inovice-' + `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}` + '.pdf'); // Generated PDF
          }
        }

        // Add the first image directly to the existing page
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);

        // Update the heightLeft variable with the remaining height on the page
        heightLeft -= pageHeight;

        // If there is still content remaining, call the function recursively to add a new page
        if (heightLeft > 0) {
          position -= pageHeight; // Move to the top of the next page
          addNewPage(contentDataURL);
        } else {
          pdf.save('Inovice-' + `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}` + '.pdf'); // Generated PDF
        }
      });
    }, 1500);
  }

  private loadInvoice(id) {
    this.invoiceService.getInvoiceWithNotification(id).subscribe(invoice => this.invoice = invoice);
  }

  getdesign() {
    this.invoiceService.getInvoicedesign().subscribe(res => {
      console.log(res)
      this.designnum = res
      if (this.designnum == '0') {
        this.designnum = '3';
      }
    })
  }


}
