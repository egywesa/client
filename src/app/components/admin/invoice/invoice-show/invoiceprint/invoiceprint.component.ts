import {Component, ElementRef, EventEmitter, OnInit, Output, Renderer2, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Invoice } from 'src/app/shared/models/invoice';
import { environment } from 'src/environments/environment';
import { InvoiceService } from '../../invoice.service';

@Component({
  selector: 'app-invoiceprint',
  templateUrl: './invoiceprint.component.html',
  styleUrls: ['./invoiceprint.component.scss']
})
export class InvoiceprintComponent implements OnInit {
  invoice: Invoice;
  baseUrl = environment.baseUrl;
  @ViewChild('pdfDocument', { static: true }) pdfDocument: ElementRef;

  constructor(private invoiceService: InvoiceService,
    private activatedRoute: ActivatedRoute,
    private renderer: Renderer2) { }
  id: any;
  designnum: any;
  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.loadInvoice(this.id);
    this.getdesign();
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

  printInvoice() {
    // Get the currently displayed design component
    let designElement: HTMLElement | null = null;
    
    if (this.designnum === '2') {
      designElement = document.querySelector('app-first-design');
    } else if (this.designnum === '4') {
      designElement = document.querySelector('app-second-design');
    } else if (this.designnum === '3') {
      designElement = document.querySelector('app-third-design');
    } else if (this.designnum === '1') {
      designElement = document.querySelector('app-sample-design');
    }

    if (!designElement) {
      console.error('Design element not found');
      return;
    }

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      console.error('Could not open print window');
      return;
    }

    // Get all stylesheets from the current document
    const styleSheets = Array.from(document.styleSheets);
    let stylesText = '';

    styleSheets.forEach(sheet => {
      try {
        const rules = Array.from(sheet.cssRules || sheet.rules);
        rules.forEach(rule => {
          stylesText += rule.cssText + '\n';
        });
      } catch (e) {
        if (sheet.href) {
          stylesText += `@import url("${sheet.href}");\n`;
        }
      }
    });

    // Create print-specific styles for A4 size
    const printStyles = `
      @page {
        size: A4;
        margin: 0;
      }

      @media print {
        html, body, .print-container, .bill, app-sample-design, app-first-design, app-second-design, app-third-design {
          width: 100% !important;
          min-height: 297mm !important;
          margin: 0 !important;
          padding: 0 !important;
          max-width: none !important;
          box-sizing: border-box !important;
          background: white !important;
        }
        
        body, .bill, .print-container {
          min-height: 297mm !important;
          height: auto !important;
          border: none !important;
        }

        /* Remove margin:auto from all elements */
        * {
          margin-left: 0 !important;
          margin-right: 0 !important;
        }

        /* Remove any fixed height or max-width from tables and containers */
        table, .res-table, .invoice-details, .client-table, .products-table, .totals-table, .bank-details-table {
          width: 100% !important;
          max-width: none !important;
          height: auto !important;
          min-height: 0 !important;
          margin: 0 !important;
        }

        /* Optional: add a border for debugging, remove after testing */
        /* .print-container { border: 2px dashed red !important; } */

        * {
          box-sizing: border-box !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        .print-container {
          width: 210mm !important;
          min-height: 100vh !important;
          padding: 15mm !important;
          margin: 0 !important;
          background: white !important;
          font-size: 14px !important;
          line-height: 1.8 !important;
          font-weight: 700 !important;
          -webkit-font-smoothing: antialiased !important;
          -moz-osx-font-smoothing: grayscale !important;
          text-rendering: optimizeLegibility !important;
        }

        /* Sample Design Specific Styles */
        app-sample-design {
          display: block !important;
          padding: 0 !important;
          margin: 0 !important;
        }

        app-sample-design table {
          margin: 4mm 0 !important;
          width: 100% !important;
          border-collapse: collapse !important;
        }

        app-sample-design td {
          padding: 3mm !important;
          line-height: 1.4 !important;
        }

        app-sample-design .table-head {
          background-color: #FFFFFF !important;
          color: black !important;
          font-weight: bold !important;
          border: 1px solid #000 !important;
        }

        app-sample-design .product-table {
          margin-top: 6mm !important;
        }

        app-sample-design .product-table td {
          padding: 3mm !important;
          border: 1px solid #000 !important;
        }

        app-sample-design .total-table {
          margin-top: 6mm !important;
        }

        app-sample-design .total-table td {
          padding: 3mm 6mm !important;
        }

        app-sample-design .header-section {
          margin-bottom: 8mm !important;
        }

        app-sample-design .company-info {
          margin-bottom: 6mm !important;
        }

        app-sample-design h1, 
        app-sample-design h2, 
        app-sample-design h3 {
          margin: 3mm 0 !important;
          line-height: 1.4 !important;
        }

        /* General table styles */
        table {
          width: 100% !important;
          max-width: 100% !important;
          border-collapse: separate !important;
          border-spacing: 0 !important;
          page-break-inside: auto !important;
          margin-bottom: 3mm !important;
        }

        tr {
          page-break-inside: avoid !important;
          page-break-after: auto !important;
        }

        td {
          padding: 2.5mm !important;
          vertical-align: middle !important;
          font-size: 13pt !important;
          font-weight: 700 !important;
          -webkit-font-smoothing: antialiased !important;
          -moz-osx-font-smoothing: grayscale !important;
        }

        /* Enhanced number formatting for all designs */
        .number, 
        .number2, 
        td[style*="text-align: center"],
        .product-cell,
        .total-value,
        [class*="total"],
        [class*="amount"],
        [class*="price"],
        [class*="quantity"],
        [class*="qty"],
        [class*="discount"],
        [class*="tax"],
        [class*="vat"] {
          font-family: 'Courier New', monospace !important;
          text-align: center !important;
          white-space: nowrap !important;
          font-weight: 800 !important;
          font-size: 14pt !important;
          letter-spacing: 0.5px !important;
          padding: 3.5mm 2.5mm !important;
          -webkit-font-smoothing: antialiased !important;
          -moz-osx-font-smoothing: grayscale !important;
          text-rendering: optimizeLegibility !important;
          text-shadow: 0 0 0.5px currentColor !important;
        }

        /* Product table specific styles */
        .product-table td,
        table[class*="product"] td {
          border: 1px solid #dee2e6 !important;
          padding: 2.5mm !important;
        }

        .product-table td:not(:nth-child(2)),
        table[class*="product"] td:not(:nth-child(2)) {
          text-align: center !important;
        }

        /* Totals table specific styles */
        .total-table td,
        table[class*="total"] td,
        [class*="amount-cell"],
        .total-discount-table td {
          padding: 3mm 6mm !important;
          border: 1px solid #dee2e6 !important;
        }

        .total-table td:last-child,
        table[class*="total"] td:last-child,
        [class*="amount-cell"],
        .total-discount-value {
          text-align: center !important;
          font-weight: 800 !important;
          font-family: 'Courier New', monospace !important;
          font-size: 14pt !important;
          letter-spacing: 0.5px !important;
          background-color: #cbe9f2 !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          -webkit-font-smoothing: antialiased !important;
          -moz-osx-font-smoothing: grayscale !important;
          text-rendering: optimizeLegibility !important;
          text-shadow: 0 0 0.5px currentColor !important;
        }

        .total-discount-header {
          background-color: #14678f !important;
          color: white !important;
          font-weight: bold !important;
          text-align: center !important;
          font-size: 12pt !important;
          padding: 4mm 2mm !important;
          min-width: 150px !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        .total-discount-table {
          margin-top: 3mm !important;
          margin-bottom: 3mm !important;
        }

        /* Headers */
        .table-head {
          background-color: ${this.designnum === '3' ? 'transparent' : '#14678f'} !important;
          color: ${this.designnum === '3' ? 'black' : 'white'} !important;
          font-weight: bold !important;
          text-align: center !important;
          padding: 2.5mm !important;
          border: ${this.designnum === '3' ? '1px solid #000' : 'none'} !important;
        }

        /* Third design specific styles */
        app-third-design .header-section,
        app-third-design .header-section table,
        app-third-design .header-section tr,
        app-third-design .header-section td {
          border: none !important;
          border-collapse: collapse !important;
          border-spacing: 0 !important;
          box-shadow: none !important;
          outline: none !important;
        }

        app-third-design .table-one {
          border: none !important;
          background: none !important;
          margin: 0 !important;
          padding: 0 !important;
          border-collapse: collapse !important;
          border-spacing: 0 !important;
        }

        app-third-design .table-one tr,
        app-third-design .table-one td {
          border: none !important;
          border-collapse: collapse !important;
          border-spacing: 0 !important;
          background: none !important;
          box-shadow: none !important;
          outline: none !important;
        }

        app-third-design .table-one td {
          vertical-align: top !important;
          padding: 5px !important;
        }

        app-third-design .invoice-details table,
        app-third-design .invoice-details tr,
        app-third-design .invoice-details td {
          border: none !important;
          border-collapse: collapse !important;
          border-spacing: 0 !important;
          background: none !important;
          box-shadow: none !important;
          outline: none !important;
        }

        app-third-design .invoice-details {
          margin-top: 3mm !important;
          margin-bottom: 3mm !important;
        }

        app-third-design .invoice-details table {
          width: 100% !important;
          font-size: 14px !important;
          line-height: 1.4 !important;
          table-layout: fixed !important;
          font-weight: 600 !important;
          margin-bottom: 3mm !important;
        }

        app-third-design .invoice-details td {
          padding: 5px !important;
        }

        /* Hide any extra tables in the header section */
        app-third-design table.table-one:not(:first-of-type) {
          display: none !important;
        }

        /* Ensure header elements are properly displayed */
        app-third-design .header-section {
          margin-bottom: 4mm !important;
        }

        app-third-design .company-info {
          margin-bottom: 4mm !important;
        }

        app-third-design .invoice-title {
          flex: 1 !important;
          text-align: center !important;
        }

        app-third-design .logo-container {
          flex: 1 !important;
          text-align: left !important;
        }

        app-third-design .company-logo {
          max-width: 200px !important;
          max-height: 100px !important;
        }

        app-third-design h1,
        app-third-design h3 {
          margin: 4mm 0 !important;
          line-height: 1.1 !important;
          font-weight: 700 !important;
        }

        app-third-design .qr-code-container {
          margin: 0 auto !important;
          text-align: center !important;
        }

        img {
          display: block !important;
          max-width: 100% !important;
          max-height: 50mm !important;
          object-fit: contain !important;
        }

        .qr-code-container {
          width: 35mm !important;
          height: 35mm !important;
        }

        .qr-code-container img,
        .qr-code-container canvas {
          width: 35mm !important;
          height: 35mm !important;
        }

        .header-section {
          margin-bottom: 4mm !important;
        }

        .res-table {
          margin-bottom: 4mm !important;
        }

        .multiline-cell {
          white-space: pre-line !important;
        }

        [dir="rtl"] {
          text-align: right !important;
        }

        [dir="ltr"] {
          text-align: left !important;
        }

        /* Currency and decimal alignment */
        [class*="currency"],
        [class*="amount"],
        [class*="price"],
        [class*="total"] {
          font-variant-numeric: tabular-nums !important;
        }
      }
    `;

    // Get computed styles of the design element
    const computedStyles = window.getComputedStyle(designElement);
    const elementStyles = `
      .print-container {
        font-family: ${computedStyles.fontFamily};
        direction: ${computedStyles.direction};
        text-align: ${computedStyles.textAlign};
        color: ${computedStyles.color};
        background-color: white;
      }
    `;

    // Write the content to the new window
    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="${computedStyles.direction}">
        <head>
          <meta charset="utf-8">
          <title>Print Invoice</title>
          <style>
            ${stylesText}
            ${elementStyles}
            ${printStyles}
          </style>
        </head>
        <body>
          <div class="print-container">
            ${designElement.outerHTML}
          </div>
          <script>
            window.onload = function() {
              // Force repaint to ensure proper rendering
              document.body.offsetHeight;
              // Wait a bit for fonts and images to load
              setTimeout(function() {
                window.print();
                setTimeout(function() {
                  window.close();
                }, 500);
      }, 1000);
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  }
}