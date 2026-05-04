import { Component, Input, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Invoice } from "../../../../../shared/models/invoice";
import { CalculateService } from "../../calculate.service";
import { InvoiceService } from "../../invoice.service";
import { TranslateService } from "@ngx-translate/core";
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-sample-design',
  templateUrl: './sample-design.component.html',
  styleUrls: ['./sample-design.component.scss']
})
export class SampleDesignComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input('invoice') invoice: Invoice;
  @Input('baseUrl') baseUrl: string;
  @Input('isDownload') isDownload: boolean;
  @Input('isShow') isShow: boolean;
  
  private destroy$ = new Subject<void>();
  isLoading = false;
  error: string | null = null;

  constructor(
    public calculateService: CalculateService,
    private invoiceService: InvoiceService,
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.validateInputs();
    this.setupLanguageChangeListener();
  }

  private validateInputs(): void {
    if (!this.invoice) {
      this.error = this.translate.instant('error.invoiceRequired');
      return;
    }

    if (!this.baseUrl) {
      this.error = this.translate.instant('error.baseUrlRequired');
      return;
    }
  }

  private setupLanguageChangeListener(): void {
    this.translate.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        // Handle any language-specific updates here
      });
  }

  ngAfterViewInit(): void {
    if (!this.isDownload && !this.isShow) {
      this.printInvoice();
    }
  }

  printInvoice(): void {
    // Add a small delay to ensure all content is loaded
    setTimeout(() => {
      try {
        window.print();
      } catch (error) {
        console.error('Print error:', error);
        this.error = this.translate.instant('error.printFailed');
      }
    }, 2500);
  }

  // Helper method to format currency values
  formatCurrency(value: number, currency: string): string {
    return `${value.toFixed(2)} ${currency}`;
  }

  // Helper method to convert USD to SAR
  convertToSAR(value: number): number {
    return value * 3.7575;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
