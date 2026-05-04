import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { AccountService } from '../components/account/account.service';
import { IProfile } from '../shared/models/user';
import { IJournalEntry } from '../shared/models/journal';
import { IPaymentVoucher } from '../shared/models/payment-voucher';
import {
  IAccountStatementRes,
  IBalanceSheetRes,
  IProfitAndLossRes,
} from '../shared/models/reports';
import { IReceiptVoucher } from '../shared/models/receipt-voucher';
import { IDocument } from '../shared/models/documents';

@Injectable({
  providedIn: 'root',
})
export class PrintService {
  private baseUrl = environment.baseUrl;
  private userProfile: IProfile;
  private lang = this.translate.currentLang || 'ar';
  private isRTL = ['ar'].includes(this.lang);
  private dir = this.isRTL ? 'rtl' : 'ltr';

  constructor(
    private translate: TranslateService,
    private accountService: AccountService
  ) {
    this.accountService.getProfile().subscribe((profile) => {
      this.userProfile = profile;
    });
  }

  printWindow(printContent: string) {
    const printWindow = window.open('', '', 'width=900,height=650');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();

      printWindow.onload = () => {
        const images = Array.from(printWindow.document.images);

        const waitForImages = images.map(
          (img) =>
            new Promise<void>((resolve) => {
              img.complete
                ? resolve()
                : (img.onload = img.onerror = () => resolve());
            })
        );

        Promise.all(waitForImages).then(() => {
          printWindow.focus();
          printWindow.print();
          printWindow.close();
        });
      };
    }
  }

  printJournalEntry(formValue: IJournalEntry) {
    const title = this.translate.instant('journal-entry.title');
    const dateLabel = this.translate.instant('journal-entry.entry-date');
    const descLabel = this.translate.instant('form-labels.description');
    const entryNumLabel = this.translate.instant('journal-entry.entry-number');
    const accountLabel = this.translate.instant('form-labels.account');
    const codeLabel = this.translate.instant('form-labels.code');
    const amountLabel = this.translate.instant('form-labels.amount');
    const descriptionLabel = this.translate.instant('form-labels.description');

    const printContent = `
      <html dir="${this.dir}" lang="${this.lang}">
        <head>
          <meta charset="utf-8" />
          <title>${title}</title>
          <style>
            body {
              font-family: "Tahoma", sans-serif;
              margin: 20px;
              direction: ${this.dir};
              color: #333;
              font-size: 13px;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 1px solid #000;
              padding-bottom: 10px;
              margin-bottom: 15px;
            }
            .header .company {
              text-align: ${this.isRTL ? 'right' : 'left'};
            }
            .header .company h2 {
              margin: 0;
              font-size: 20px;
              color: #2c3e50;
            }
            .header img {
              width: 200px;
              height: 100px;
              object-fit: contain;
            }
            .info {
              margin-bottom: 20px;
            }
            .info table {
              width: 100%;
              border-collapse: collapse;
            }
            .info td {
              padding: 6px 10px;
              border: 1px solid #ccc;
            }
            .info td.label {
              background: #f4f4f4;
              width: 25%;
            }
            .info td.desc {
              font-size: 12px;
            }
            table.data {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            table.data th, table.data td {
              border: 1px solid #444;
              padding: 8px;
              text-align: center;
            }
            table.data th {
              background-color: #212529;
              color: #fff;
              font-size: 14px;
            }
            table.data td {
              font-size: 12px;
              color: #333;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company">
              <h2>${
                this.isRTL
                  ? this.userProfile.companyNameAr
                  : this.userProfile.companyNameEn
              }</h2>
            </div>
            <img
              src="${this.baseUrl}${this.userProfile.logoLink}"
              style="width: 200px;"
              alt="Company Logo" />
          </div>

          <h2 style="text-align:center; margin:30px 0;">${title}</h2>

          <div class="info">
            <table>
              <tr>
                <td class="label">${dateLabel}</td>
                <td class="desc" colspan="3">${formValue.entryDate || ''}</td>
              </tr>
              <tr>
                <td class="label">${descLabel}</td>
                <td class="desc" colspan="3" style="text-align: justify;">
                  ${formValue.description || ''}
                </td>
              </tr>
              <tr>
                <td class="label">${entryNumLabel}</td>
                <td class="desc" colspan="3" style="text-align: justify;">
                  ${formValue.entryNumber || ''}
                </td>
              </tr>
            </table>
          </div>

          <table class="data">
            <thead>
              <tr>
                <th>${codeLabel}</th>
                <th>${accountLabel}</th>
                <th>${amountLabel}</th>
                <th>${descriptionLabel}</th>
              </tr>
            </thead>
            <tbody>
              ${formValue.lines
                .map(
                  (line: any) => `
                    <tr>
                      <td>${line.accountCode || ''}</td>
                      <td>${line.accountName || ''}</td>
                      <td>${line.amount || 0}</td>
                      <td>${line.description || ''}</td>
                    </tr>`
                )
                .join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    this.printWindow(printContent);
  }

  printPaymentVoucher(formValue: IPaymentVoucher) {
    const title = this.translate.instant('payment-voucher.title');
    const dateLabel = this.translate.instant('form-labels.date');
    const descLabel = this.translate.instant('form-labels.description');
    const beneficiaryLabel = this.translate.instant('form-labels.beneficiary');
    const accountLabel = this.translate.instant('form-labels.account');
    const amountLabel = this.translate.instant('form-labels.amount');
    const accountantSign = this.translate.instant(
      'payment-voucher.accountant-signature'
    );
    const receiverSign = this.translate.instant(
      'payment-voucher.recipient-signature'
    );

    const printContent = `
      <html dir="${this.dir}" lang="${this.lang}">
        <head>
          <meta charset="utf-8" />
          <title>${title}</title>
          <style>
            body {
              font-family: "Tahoma", sans-serif;
              margin: 20px;
              direction: ${this.dir};
              color: #333;
              font-size: 13px;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 1px solid #000;
              padding-bottom: 10px;
              margin-bottom: 15px;
            }
            .header .company {
              text-align: ${this.isRTL ? 'right' : 'left'};
            }
            .header .company h2 {
              margin: 0;
              font-size: 20px;
              color: #2c3e50;
            }
            .header img {
              width: 200px;
              height: 100px;
              object-fit: contain;
            }
            table.info {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 25px;
            }
            table.info td {
              border: 1px solid #999;
              padding: 8px 12px;
            }
            table.info td.label {
              background: #f4f4f4;
              width: 25%;
            }
            .signatures {
              display: flex;
              font-weight: bold;
              justify-content: space-between;
              margin-top: 40px;
            }
            .signatures div {
              text-align: center;
              flex: 1;
            }
            .signatures div span {
              display: block;
              margin-top: 40px;
              border-bottom: 1px solid #7e7e7e;
              padding-bottom: 10px;
              width: 60%;
              font-weight: normal;
              margin-left: auto;
              margin-right: auto;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company">
              <h2>${
                this.isRTL
                  ? this.userProfile.companyNameAr
                  : this.userProfile.companyNameEn
              }</h2>
            </div>
            <img
              src="${this.baseUrl}${this.userProfile.logoLink}"
              style="width: 200px;"
              alt="Company Logo" />
          </div>

          <h2 style="text-align:center; margin:30px 0;">${title}</h2>

          <div class="info">
            <table class="info">
              <tr>
                <td class="label">${dateLabel}</td>
                <td>${formValue.date || ''}</td>
              </tr>
              <tr>
                <td class="label">${beneficiaryLabel}</td>
                <td>${formValue.supplierName || ''}</td>
              </tr>
              <tr>
                <td class="label">${accountLabel}</td>
                <td>${formValue.bankName || ''}</td>
              </tr>
              <tr>
                <td class="label">${descLabel}</td>
                <td>${formValue.description || ''}</td>
              </tr>
              <tr>
                <td class="label">${amountLabel}</td>
                <td>${formValue.amount ?? 0}</td>
              </tr>
            </table>

            <p>
              *
              ${formValue.tafqit}
            </p>

            <div class="signatures">
              <div>
                ${accountantSign}
                <span></span>
              </div>
              <div>
                ${receiverSign}
                <span></span>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    this.printWindow(printContent);
  }

  printReceipVoucher(formValue: IReceiptVoucher) {
    const title = this.translate.instant('receipt-voucher.title');
    const dateLabel = this.translate.instant('form-labels.date');
    const descLabel = this.translate.instant('form-labels.description');
    const clientLabel = this.translate.instant('form-labels.client');
    const accountLabel = this.translate.instant('form-labels.account');
    const amountLabel = this.translate.instant('form-labels.amount');
    const accountantSign = this.translate.instant(
      'receipt-voucher.accountant-signature'
    );
    const receiverSign = this.translate.instant(
      'receipt-voucher.recipient-signature'
    );

    const printContent = `
      <html dir="${this.dir}" lang="${this.lang}">
        <head>
          <meta charset="utf-8" />
          <title>${title}</title>
          <style>
            body {
              font-family: "Tahoma", sans-serif;
              margin: 20px;
              direction: ${this.dir};
              color: #333;
              font-size: 13px;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 1px solid #000;
              padding-bottom: 10px;
              margin-bottom: 15px;
            }
            .header .company {
              text-align: ${this.isRTL ? 'right' : 'left'};
            }
            .header .company h2 {
              margin: 0;
              font-size: 20px;
              color: #2c3e50;
            }
            .header img {
              width: 200px;
              height: 100px;
              object-fit: contain;
            }
            table.info {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 25px;
            }
            table.info td {
              border: 1px solid #999;
              padding: 8px 12px;
            }
            table.info td.label {
              background: #f4f4f4;
              width: 25%;
            }
            .signatures {
              display: flex;
              font-weight: bold;
              justify-content: space-between;
              margin-top: 40px;
            }
            .signatures div {
              text-align: center;
              flex: 1;
            }
            .signatures div span {
              display: block;
              margin-top: 40px;
              border-bottom: 1px solid #7e7e7e;
              padding-bottom: 10px;
              width: 60%;
              font-weight: normal;
              margin-left: auto;
              margin-right: auto;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company">
              <h2>${
                this.isRTL
                  ? this.userProfile.companyNameAr
                  : this.userProfile.companyNameEn
              }</h2>
            </div>
            <img
              src="${this.baseUrl}${this.userProfile.logoLink}"
              style="width: 200px;"
              alt="Company Logo" />
          </div>

          <h2 style="text-align:center; margin:30px 0;">${title}</h2>

          <div class="info">
            <table class="info">
              <tr>
                <td class="label">${dateLabel}</td>
                <td>${formValue.date || ''}</td>
              </tr>
              <tr>
                <td class="label">${clientLabel}</td>
                <td>${formValue.clientName || ''}</td>
              </tr>
              <tr>
                <td class="label">${accountLabel}</td>
                <td>${formValue.bankName || ''}</td>
              </tr>
              <tr>
                <td class="label">${descLabel}</td>
                <td>${formValue.description || ''}</td>
              </tr>
              <tr>
                <td class="label">${amountLabel}</td>
                <td>${formValue.amount ?? 0}</td>
              </tr>
            </table>

            <p>
              *
              ${formValue.tafqit}
            </p>

            <div class="signatures">
              <div>
                ${accountantSign}
                <span></span>
              </div>
              <div>
                ${receiverSign}
                <span></span>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    this.printWindow(printContent);
  }

  printProfitAndLossReport(data: IProfitAndLossRes) {
    const title = this.translate.instant('reports.profit-and-loss');
    const report = this.translate.instant('reports.report');
    const revenuesLabel = this.translate.instant('reports.revenues');
    const expensesLabel = this.translate.instant('reports.expenses');
    const totalLabel = this.translate.instant('reports.total');
    const netProfitLabel = this.translate.instant('reports.net-profit');
    const accountLabel = this.translate.instant('form-labels.account');
    const amountLabel = this.translate.instant('form-labels.amount');
    const fromLabel = this.translate.instant('form-labels.from');
    const toLabel = this.translate.instant('form-labels.to');

    const printContent = `
    <html dir="${this.dir}" lang="${this.lang}">
      <head>
        <meta charset="utf-8" />
        <title>${title}</title>
        <style>
          body {
            font-family: Tahoma, sans-serif;
            margin: 20px;
            direction: ${this.dir};
            color: #333;
            font-size: 13px;
          }

          .report-title {
            text-align: center;
            margin-bottom: 20px;
          }

          .period {
            margin: 5px 0;
          }

          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #000;
            padding-bottom: 10px;
            margin-bottom: 15px;
          }

          .box {
            border: 1px solid #ccc;
            padding: 0 15px 15px 15px;
            margin-bottom: 25px;
            border-radius: 6px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }

          th, td {
            padding: 10px;
            text-align: ${this.isRTL ? 'right' : 'left'};
            border-bottom: 1px solid #ddd;
          }

          th {
            background-color: #f4f4f4;
          }

          .total-row {
            font-weight: bold;
          }

          .revenues h3 { color: #198754; }
          .expenses h3 { color: #dc3545; }

          .summary-cards {
            display: flex;
            justify-content: flex-start;
            margin-top: 40px;
            text-align: center;
          }

          .summary-card {
            border: 1px solid #dee2e6;
            border-radius: 8px;
            padding: 15px 30px;
            font-weight: bold;
          }

          .summary-card.revenue span { color: #198754; }
          .summary-card.expense span { color: #dc3545; }
          .summary-card.profit span { color: #0d6efd; }
        </style>
      </head>
      <body>
        <div class="report-title">
          ${
            this.isRTL
              ? `<h2>${report} ${title}</h2>`
              : `<h2>${title} ${report}</h2>`
          }
          <div class="period">
            <span>${fromLabel}</span>
            <strong style="margin: 0 5px">${data.from}</strong>
            <span>${toLabel}</span>
            <strong style="margin: 0 5px">${data.to}</strong>
          </div>
        </div>

        <div class="header">
          <div class="company">
            <h2>${
              this.isRTL
                ? this.userProfile.companyNameAr
                : this.userProfile.companyNameEn
            }</h2>
          </div>
          <img
            src="${this.baseUrl}${this.userProfile.logoLink}"
            style="width: 200px;"
            alt="Company Logo" />
        </div>

        <div class="box revenues">
          <h3>${revenuesLabel}</h3>
          <table>
            <thead>
              <tr>
                <th>${accountLabel}</th>
                <th>${amountLabel}</th>
              </tr>
            </thead>
            <tbody>
              ${data.revenues
                .map(
                  (row) => `
                  <tr>
                    <td>${row.account}</td>
                    <td>${row.total.toFixed(2)}</td>
                  </tr>
                `
                )
                .join('')}
              <tr class="total-row">
                <td>${totalLabel}</td>
                <td>${data.totalRevenue.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="box expenses">
          <h3>${expensesLabel}</h3>
          <table>
            <thead>
              <tr>
                <th>${accountLabel}</th>
                <th>${amountLabel}</th>
              </tr>
            </thead>
            <tbody>
              ${data.expenses
                .map(
                  (row) => `
                  <tr>
                    <td>${row.account}</td>
                    <td>${row.total.toFixed(2)}</td>
                  </tr>
                `
                )
                .join('')}
              <tr class="total-row">
                <td>${totalLabel}</td>
                <td>${data.totalExpense.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="summary-cards">
          <div class="summary-card revenue">
            ${revenuesLabel}<br/>
            <span>${data.totalRevenue.toFixed(2)}</span>
          </div>
          <div class="summary-card expense">
            ${expensesLabel}<br/>
            <span>${data.totalExpense.toFixed(2)}</span>
          </div>
          <div class="summary-card profit">
            ${netProfitLabel}<br/>
            <span>${data.netProfit.toFixed(2)}</span>
          </div>
        </div>
      </body>
    </html>
  `;

    this.printWindow(printContent);
  }

  printBalanceSheetReport(data: IBalanceSheetRes) {
    const title = this.translate.instant('reports.balance-sheet');
    const report = this.translate.instant('reports.report');
    const fromLabel = this.translate.instant('form-labels.from');
    const toLabel = this.translate.instant('form-labels.to');
    const accountLabel = this.translate.instant('form-labels.account');
    const openingBalanceLabel = this.translate.instant(
      'reports.opening-balance'
    );
    const periodTotalLabel = this.translate.instant('reports.period-total');
    const finalBalanceLabel = this.translate.instant('reports.final-balance');
    const totalLabel = this.translate.instant('reports.total');
    const totalAssetsLabel = this.translate.instant('reports.total-assets');
    const totalLiabilitiesLabel = this.translate.instant(
      'reports.total-liabilities'
    );
    const netPositionLabel = this.translate.instant(
      'reports.total-net-position'
    );

    const printContent = `
    <html dir="${this.dir}" lang="${this.lang}">
      <head>
        <meta charset="utf-8" />
        <title>${title}</title>
        <style>
          body {
            font-family: Tahoma, sans-serif;
            margin: 20px;
            direction: ${this.dir};
            color: #333;
            font-size: 13px;
          }

          .report-title {
            text-align: center;
            margin-bottom: 20px;
          }

          .period {
            margin: 5px 0;
          }

          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #000;
            padding-bottom: 10px;
            margin-bottom: 15px;
          }

          .box {
            border: 1px solid #ccc;
            padding: 15px;
            margin-bottom: 25px;
            border-radius: 6px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
          }

          th, td {
            padding: 10px;
            text-align: ${this.isRTL ? 'right' : 'left'};
            border-bottom: 1px solid #ddd;
          }

          th {
            background-color: #f4f4f4;
          }

          .total-row {
            font-weight: bold;
          }

          .group-total { color: #007bff; }
          .assets span { color: #198754; }
          .liabilities span { color: #dc3545; }
          .net span { color: #0d6efd; }

          .summary {
            display: flex;
            justify-content: flex-start;
            margin-top: 40px;
            text-align: center;
          }

          .summary .item {
            border: 1px solid #dee2e6;
            border-radius: 8px;
            padding: 15px 30px;
            font-weight: bold;
          }

          .summary .item span {
            display: block;
            margin-top: 5px;
            font-size: 15px;
          }

        </style>
      </head>
      <body>
        <div class="report-title">
          ${
            this.isRTL
              ? `<h2>${report} ${title}</h2>`
              : `<h2>${title} ${report}</h2>`
          }
          <div class="period">
            <span>${fromLabel}</span>
            <strong style="margin: 0 5px">${data.from}</strong>
            <span>${toLabel}</span>
            <strong style="margin: 0 5px">${data.to}</strong>
          </div>
        </div>

        <div class="header">
          <div class="company">
            <h2>${
              this.isRTL
                ? this.userProfile.companyNameAr
                : this.userProfile.companyNameEn
            }</h2>
          </div>
          <img
            src="${this.baseUrl}${this.userProfile.logoLink}"
            style="width: 200px;"
            alt="Company Logo" />
        </div>

        ${data.groups
          .map(
            (group) => `
              <div class="box">
                <h3>${group.group}</h3>
                <table>
                  <thead>
                    <tr>
                      <th>${accountLabel}</th>
                      <th>${openingBalanceLabel}</th>
                      <th>${periodTotalLabel}</th>
                      <th>${finalBalanceLabel}</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${group.accounts
                      .map(
                        (acc) => `
                        <tr>
                          <td>${acc.name}</td>
                          <td>${acc.openingBalance.toFixed(2)}</td>
                          <td>${acc.periodTotal.toFixed(2)}</td>
                          <td>${acc.finalBalance.toFixed(2)}</td>
                        </tr>
                      `
                      )
                      .join('')}
                    <tr class="total-row group-total">
                      <td colspan="3">${totalLabel}</td>
                      <td>${group.total.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            `
          )
          .join('')}

        <div class="summary">
          <div class="item assets">
            ${totalAssetsLabel}
            <span>${data.totalAssets.toFixed(2)}</span>
          </div>
          <div class="item liabilities">
            ${totalLiabilitiesLabel}
            <span>${data.totalLiabilities.toFixed(2)}</span>
          </div>
          <div class="item net">
            ${netPositionLabel}
            <span>${data.netPosition.toFixed(2)}</span>
          </div>
        </div>
      </body>
    </html>
  `;

    this.printWindow(printContent);
  }

  printDetailedAccountStatementReport(data: IAccountStatementRes) {
    const title = this.translate.instant('reports.account-statement');
    const report = this.translate.instant('reports.report');
    const fromLabel = this.translate.instant('form-labels.from');
    const toLabel = this.translate.instant('form-labels.to');
    const accountLabel = this.translate.instant('form-labels.account');
    const openingBalanceLabel = this.translate.instant(
      'reports.opening-balance'
    );
    const finalBalanceLabel = this.translate.instant('reports.final-balance');
    const manualBalanceLabel = this.translate.instant('reports.manual-balance');
    const dateLabel = this.translate.instant('form-labels.date');
    const journalLabel = this.translate.instant('form-labels.journal');
    const descriptionLabel = this.translate.instant('form-labels.description');
    const amountLabel = this.translate.instant('form-labels.amount');
    const balanceLabel = this.translate.instant('form-labels.balance');
    const periodTotalLabel = this.translate.instant('reports.period-total');

    const printContent = `
  <html dir="${this.dir}" lang="${this.lang}">
    <head>
      <meta charset="utf-8" />
      <title>${title}</title>
      <style>
        body {
          font-family: Tahoma, sans-serif;
          margin: 20px;
          direction: ${this.dir};
          color: #333;
          font-size: 13px;
        }

        .report-title {
          text-align: center;
          margin-bottom: 20px;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #000;
          padding-bottom: 10px;
          margin-bottom: 15px;
        }

        .summary {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border: 1px solid #ccc;
          padding: 15px;
          border-radius: 6px;
          margin-bottom: 20px;
        }

        .summary-box {
          text-align: center;
        }

        .summary-box strong {
          display: block;
          font-size: 15px;
        }

        .summary-box h5 {
          margin: 0;
        }

        .box {
          border: 1px solid #ccc;
          padding: 15px;
          border-radius: 6px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          text-align: center;
        }

        th, td {
          padding: 10px;
          border: 1px solid #ddd;
        }

        th {
          background-color: #f4f4f4;
        }

        .total-row {
          font-weight: bold;
          background-color: #f9f9f9;
        }

        .text-primary { color: #007bff; }
        .text-success { color: #28a745; }
        .text-secondary { color: #6c757d; }
      </style>
    </head>
    <body>
      <div class="report-title">
        ${
          this.isRTL
            ? `<h2>${report} ${title}</h2>`
            : `<h2>${title} ${report}</h2>`
        }
        <div>
          <span>${fromLabel}</span>
          <strong style="margin: 0 5px">${data.from}</strong>
          <span>${toLabel}</span>
          <strong style="margin: 0 5px">${data.to}</strong>
        </div>
      </div>

      <div class="header">
        <div class="company">
          <h2>${
            this.isRTL
              ? this.userProfile.companyNameAr
              : this.userProfile.companyNameEn
          }</h2>
        </div>
        <img
          src="${this.baseUrl}${this.userProfile.logoLink}"
          style="width: 200px;"
          alt="Company Logo" />
      </div>

      <div class="summary">
        <div class="summary-box">
          <small>${accountLabel}</small>
          <strong>${data.account}</strong>
        </div>
        <div class="summary-box">
          <small>${openingBalanceLabel}</small>
          <h5 class="text-primary">${data.openingBalance}</h5>
        </div>
        <div class="summary-box">
          <small>${finalBalanceLabel}</small>
          <h5 class="text-success">${data.finalBalance}</h5>
        </div>
        <div class="summary-box">
          <small>${manualBalanceLabel}</small>
          <h5 class="text-secondary">${data.totals.manualBalance}</h5>
        </div>
      </div>

      <div class="box">
        <table>
          <thead>
            <tr>
              <th>${dateLabel}</th>
              <th>${journalLabel}</th>
              <th>${descriptionLabel}</th>
              <th>${amountLabel}</th>
              <th>${balanceLabel}</th>
            </tr>
          </thead>
          <tbody>
            ${data.transactions
              .map(
                (trx) => `
                <tr>
                  <td>${trx.date}</td>
                  <td>${trx.journalEntryId}</td>
                  <td>${trx.description}</td>
                  <td>${trx.amount}</td>
                  <td>${trx.balanceAfter}</td>
                </tr>
              `
              )
              .join('')}
            <tr class="total-row">
              <td colspan="3">${periodTotalLabel}</td>
              <td>${data.totals.periodTotal}</td>
              <td>${data.finalBalance}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </body>
  </html>
  `;

    this.printWindow(printContent);
  }

  printGroupedAccountStatementReport(data: IAccountStatementRes) {
    const title = this.translate.instant('reports.account-statement');
    const report = this.translate.instant('reports.report');
    const fromLabel = this.translate.instant('form-labels.from');
    const toLabel = this.translate.instant('form-labels.to');
    const accountLabel = this.translate.instant('form-labels.account');
    const openingBalanceLabel = this.translate.instant(
      'reports.opening-balance'
    );
    const finalBalanceLabel = this.translate.instant('reports.final-balance');
    const manualBalanceLabel = this.translate.instant('reports.manual-balance');
    const periodTotalLabel = this.translate.instant('reports.period-total');
    const dateLabel = this.translate.instant('form-labels.date');
    const journalLabel = this.translate.instant('form-labels.journal');
    const descriptionLabel = this.translate.instant('form-labels.description');
    const amountLabel = this.translate.instant('form-labels.amount');

    const printContent = `
  <html dir="${this.dir}" lang="${this.lang}">
    <head>
      <meta charset="utf-8" />
      <title>${title}</title>
      <style>
        body {
          font-family: Tahoma, sans-serif;
          margin: 20px;
          direction: ${this.dir};
          color: #333;
          font-size: 13px;
        }

        .report-title {
          text-align: center;
          margin-bottom: 20px;
        }

        .period {
          margin: 5px 0;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #000;
          padding-bottom: 10px;
          margin-bottom: 20px;
        }

        .account {
          margin-bottom: 20px;
        }

        .account h3 {
          margin: 0;
        }

        .summary {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border: 1px solid #dee2e6;
          padding: 15px;
          border-radius: 6px;
          margin-bottom: 20px;
        }

        .summary div {
          text-align: center;
          flex: 1;
        }

        .summary small {
          display: block;
          color: #6c757d;
        }

        .summary h5 {
          margin: 5px 0;
          font-size: 16px;
        }

        .summary .text-primary { color: #007bff; }
        .summary .text-success { color: #28a745; }
        .summary .text-secondary { color: #6c757d; }

        .box {
          border: 1px solid #ccc;
          padding: 15px;
          margin-bottom: 25px;
          border-radius: 6px;
        }

        .box h3 {
          margin-top: 0;
          color: #6c757d;
          margin-bottom: 10px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th, td {
          padding: 10px;
          text-align: ${this.isRTL ? 'right' : 'left'};
          border-bottom: 1px solid #ddd;
        }

        th {
          background-color: #f8f9fa;
        }

        .total-row {
          font-weight: bold;
          background-color: #f4f4f4;
          color: #007bff;
        }
      </style>
    </head>
    <body>
      <div class="report-title">
        ${
          this.isRTL
            ? `<h2>${report} ${title}</h2>`
            : `<h2>${title} ${report}</h2>`
        }
        <div class="period">
          <span>${fromLabel}</span>
          <strong style="margin: 0 5px">${data.from}</strong>
          <span>${toLabel}</span>
          <strong style="margin: 0 5px">${data.to}</strong>
        </div>
      </div>

      <div class="header">
        <div class="company">
          <h2>${
            this.isRTL
              ? this.userProfile.companyNameAr
              : this.userProfile.companyNameEn
          }</h2>
        </div>
        <img
          src="${this.baseUrl}${this.userProfile.logoLink}"
          style="width: 180px;"
          alt="Company Logo" />
      </div>

      <div class="account">
        <small>${accountLabel}</small>
        <h3>${data.account}</h3>
      </div>
      <div class="summary">
        <div>
          <small>${openingBalanceLabel}</small>
          <h5 class="text-primary">${data.openingBalance}</h5>
        </div>
        <div>
          <small>${finalBalanceLabel}</small>
          <h5 class="text-success">${data.finalBalance}</h5>
        </div>
        <div>
          <small>${manualBalanceLabel}</small>
          <h5 class="text-secondary">${data.totals.manualBalance}</h5>
        </div>
        <div>
          <small>${periodTotalLabel}</small>
          <h5 class="text-secondary">${data.totals.periodTotal}</h5>
        </div>
      </div>

      ${data.grouped
        .map(
          (item) => `
          <div class="box">
            <h3>${item.accountName}</h3>
            <table>
              <thead>
                <tr>
                  <th>${dateLabel}</th>
                  <th>${journalLabel}</th>
                  <th>${descriptionLabel}</th>
                  <th>${amountLabel}</th>
                </tr>
              </thead>
              <tbody>
                ${item.transactions
                  .map(
                    (trx) => `
                    <tr>
                      <td>${trx.date}</td>
                      <td>${trx.journalEntryId}</td>
                      <td>${trx.description}</td>
                      <td>${trx.amount}</td>
                    </tr>
                  `
                  )
                  .join('')}
                <tr class="total-row">
                  <td colspan="3">${periodTotalLabel}</td>
                  <td>${item.total}</td>
                </tr>
              </tbody>
            </table>
          </div>
        `
        )
        .join('')}
    </body>
  </html>
  `;

    this.printWindow(printContent);
  }

  printQuotationDocument(data: IDocument) {
    const priceOfferLabel = this.translate.instant(
      'form-labels.type-quotation'
    );
    const clientLabel = this.translate.instant('documents.to-gentelmen');
    const taxNumberLabel = this.translate.instant('form-labels.tax-number');
    const welcomeLabel = this.translate.instant('documents.welcome');

    const colIndex = '#';
    const colDescription = this.translate.instant('form-labels.description');
    const colQty = this.translate.instant('form-labels.quantity');
    const colUnitPrice = this.translate.instant('form-labels.unit-price');
    const colDiscount = this.translate.instant('form-labels.discount');
    const colTotal = this.translate.instant('reports.total');

    const totalAfterDiscountLabel = this.translate.instant(
      'documents.total-after-discount'
    );
    const termsAndNotesLabel = this.translate.instant(
      'documents.terms-and-notes'
    );
    const complaintsLabel = this.translate.instant('documents.complaints');
    const signatureLabel = this.translate.instant('documents.signature');
    const approvedLabel = this.translate.instant('documents.approved');

    const printContent = `
    <html dir="${this.dir}" lang="${this.lang}">
      <head>
        <meta charset="utf-8" />
        <style>
          @page { size: A4; margin: 0; }
          body {
            font-family: 'Segoe UI', Tahoma, sans-serif;
            margin: 0; padding: 0;
            direction: ${this.dir};
            color: #333;
          }
          .page-container {
            padding: 40px;
            position: relative;
            min-height: 297mm;
            box-sizing: border-box;
          }
          .top-red-line {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 8px;
            background: #c0392b;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-top: 30px;
            margin-bottom: 50px;
          }
          .company-meta {
            text-align: center;
          }
          .logo-placeholder {
            width: 200px;
          }
          .company-name {
            font-weight: bold;
            font-size: 16px;
            margin: 5px 0;
            color: #1a237e;
          }
          .tax-no { font-size: 13px; color: #546e7a; }

          .offer-info { text-align: ${this.isRTL ? 'right' : 'left'}; }
          .offer-title {
            color: #c0392b; font-size: 45px; margin: 0; font-weight: 900;
          }
          .date-value { font-size: 18px; margin-top: 10px; font-weight: bold; color: #37474f; }

          .client-section { margin-bottom: 30px; font-size: 16px; text-align: center; color: #263238; }

          table {
            width: 100%; border-collapse: collapse; margin-top: 20px;
          }
          th {
            background-color: #c0392b; color: white;
            padding: 12px 8px; font-size: 14px;
          }
          td {
            padding: 12px 8px; border-bottom: 1px solid #eee;
            text-align: center; font-size: 13px;
          }

          .grand-total {
            text-align: ${this.isRTL ? 'left' : 'right'};
            margin-top: 30px;
          }
          .grand-total .total-label { margin: 15px 0; font-size: 15px; font-weight: bold; }
          .grand-total .total-amount {
            padding: 12px 25px;
            font-weight: bold;
            font-size: 17px;
            border: 1px solid #eee;
            display: inline-block;
          }

          .terms { margin-top: 40px; font-size: 13px; }
          .terms-title { color: #c0392b; font-weight: bold; margin-bottom: 5px;
          padding-bottom: 4px; border-bottom: 1px solid #c0392b; display: inline-block; }
          .terms p, .intro { white-space: pre-wrap; }

          .footer-parallel {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #f0f0f0;
          }
          .contact-side { flex: 1; font-size: 12px; }
          .signature-side { flex: 1; text-align: center; }
          .sig-line { margin-top: 40px; border-top: 1px dashed #333; width: 150px; margin-right: auto; margin-left: auto; }
        </style>
      </head>
      <body>
        <div class="page-container">
          <div class="top-red-line"></div>

          <div class="header">
            <div class="offer-info">
              <h1 class="offer-title">${priceOfferLabel}</h1>
              <div class="date-value">${data.documentDate}</div>
              <strong>${clientLabel}: ${data.clientName}</strong>
            </div>

            <div class="company-meta">
              <div class="logo-placeholder">
                <img
                  src="${this.baseUrl}${this.userProfile.logoLink}"
                  style="max-width:100%" alt="Logo"
                />
              </div>
              <div class="company-name">${
                this.isRTL
                  ? this.userProfile.companyNameAr
                  : this.userProfile.companyNameEn
              }</div>
              <div class="tax-no">
                ${taxNumberLabel}: ${this.userProfile.vat}
              </div>
            </div>
          </div>

          <div class="client-section">
            <p style="font-weight: bold;">${welcomeLabel}</p>
            <p class="intro">${data.introduction}</p>
          </div>

          <table>
            <thead>
              <tr>
                <th>${colIndex}</th>
                <th>${colDescription}</th>
                <th>${colQty}</th>
                <th>${colUnitPrice}</th>
                <th>${colDiscount}</th>
                <th>${colTotal}</th>
              </tr>
            </thead>
            <tbody>
              ${data.lines
                .map(
                  (line, i) => `
                <tr>
                  <td>${i + 1}</td>
                  <td style="text-align:right">${line.description}</td>
                  <td>${line.quantity}</td>
                  <td>${line.unitPrice}</td>
                  <td>${line.discount}%</td>
                  <td>${line.totalWithTaxAndDiscount}</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>

          <div class="grand-total">
            <div class="total-label">${totalAfterDiscountLabel}</div>
            <div class="total-amount">
              ${data.grandTotal}
              <br/>
              <span style="font-size: 12px; font-weight: normal;">${
                data.grandTotalTafqit
              }</span>
            </div>
          </div>

          <div class="terms">
            <div class="terms-title">${termsAndNotesLabel}:</div>
            <p>${data.subject}</p>
          </div>

          <div class="footer-parallel">
            <div class="contact-side">
              <div style="color:#c0392b; font-weight:bold; margin-bottom:8px">
                ${complaintsLabel}
              </div>
              <div>${
                this.isRTL
                  ? this.userProfile.companyAddressAr
                  : this.userProfile.companyAddressEn
              }</div>
              <div>${this.userProfile.phoneNumber}</div>
              <div>${this.userProfile.email}</div>
            </div>

            <div class="signature-side">
              <div>${signatureLabel}</div>
              <div style="margin-top:10px; font-weight:bold">${approvedLabel}</div>
              <div class="sig-line"></div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
    this.printWindow(printContent);
  }

  printContractDocument(data: IDocument) {
    const priceOfferLabel = this.translate.instant('form-labels.type-contract');
    const contractNumberLabel = this.translate.instant(
      'form-labels.contract-number'
    );
    const taxNumberLabel = this.translate.instant('form-labels.tax-number');
    const welcomeLabel = this.translate.instant('documents.welcome');

    const colIndex = '#';
    const colDescription = this.translate.instant('form-labels.description');
    const colQty = this.translate.instant('form-labels.quantity');
    const colUnitPrice = this.translate.instant('form-labels.unit-price');
    const colDiscount = this.translate.instant('form-labels.discount');
    const colTotal = this.translate.instant('reports.total');

    const totalAfterDiscountLabel = this.translate.instant(
      'documents.total-after-discount'
    );
    const termsAndNotesLabel = this.translate.instant(
      'documents.terms-and-notes'
    );
    const complaintsLabel = this.translate.instant('documents.complaints');
    const partOneLabel = this.translate.instant('documents.part-one');
    const partTwoLabel = this.translate.instant('documents.part-two');

    const printContent = `
    <html dir="${this.dir}" lang="${this.lang}">
      <head>
        <meta charset="utf-8" />
        <style>
          @page { size: A4; margin: 0; }
          body {
            font-family: 'Segoe UI', Tahoma, sans-serif;
            margin: 0; padding: 0;
            direction: ${this.dir};
            color: #263238;
          }
          .page-container {
            padding: 40px;
            position: relative;
            min-height: 297mm;
            box-sizing: border-box;
          }
          .top-red-line {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 6px;
            background: #1a237e;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-top: 30px;
            margin-bottom: 50px;
          }
          .company-meta {
            text-align: center;
          }
          .logo-placeholder {
            width: 200px;
          }
          .company-name {
            font-weight: bold;
            font-size: 16px;
            margin: 5px 0;
            color: #1a237e;
          }
          .tax-no { font-size: 13px; color: #546e7a; }

          .offer-info { text-align: ${this.isRTL ? 'right' : 'left'}; }
          .offer-title {
            color: #1a237e; font-size: 45px; margin: 0; font-weight: 900;
            letter-spacing: -1px;
          }
          .date-value { font-size: 18px; margin-top: 10px; font-weight: bold; color: #37474f; }

          .client-section { margin-bottom: 30px; font-size: 16px; text-align: center; color: #263238; }

          table {
            width: 100%; border-collapse: collapse; margin-top: 20px;
            border: 1px solid #cfd8dc;
          }
          th {
            background-color: #f8f9fa; color: #1a237e;
            padding: 12px 8px; font-size: 14px;
            border-bottom: 1px solid #1a237e;
          }
          td {
            padding: 12px 8px; border-bottom: 1px solid #cfd8dc;
            text-align: center; font-size: 13px;
          }

          .grand-total {
            text-align: ${this.isRTL ? 'left' : 'right'};
            margin-top: 30px;
          }
          .grand-total .total-label { margin-bottom: 10px; font-size: 15px; color: #546e7a; font-weight: bold; }
          .grand-total .total-amount {
            padding: 12px 25px;
            font-weight: bold;
            font-size: 17px;
            border: 1px solid #1a237e;
            display: inline-block;
            background-color: #f1f3f4;
            color: #1a237e;
          }

          .terms { margin-top: 40px; font-size: 13px; }
          .terms-title {
            color: #1a237e; font-weight: bold; margin-bottom: 8px;
            padding-bottom: 4px; border-bottom: 1px solid #1a237e; display: inline-block;
          }
          .terms p, .intro { white-space: pre-wrap; color: #455a64; line-height: 1.6; }

          .footer-parallel {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #cfd8dc;
          }
          .contact-side { flex: 1; font-size: 12px; color: #546e7a; }

          .signatures-footer {
            margin-top: 60px;
            display: flex;
            justify-content: space-between;
          }
          .sig-box { flex: 1; text-align: center; }
          .sig-title { font-weight: bold; color: #1a237e; margin-bottom: 40px; }
          .sig-space {
            border-bottom: 1px solid #90a4ae;
            width: 70%;
            margin-left: auto;
            margin-right: auto;
          }
        </style>
      </head>
      <body>
        <div class="page-container">
          <div class="top-red-line"></div>

          <div class="header">
            <div class="offer-info">
              <h1 class="offer-title">${priceOfferLabel}</h1>
              <div class="date-value">${data.documentDate}</div>
              <div style="margin-top: 5px; color: #546e7a;">
                <strong>${contractNumberLabel}: ${data.displayNumber}</strong>
              </div>
            </div>

            <div class="company-meta">
              <div class="logo-placeholder">
                <img
                  src="${this.baseUrl}${this.userProfile.logoLink}"
                  style="max-width:100%" alt="Logo"
                />
              </div>
              <div class="company-name">${
                this.isRTL
                  ? this.userProfile.companyNameAr
                  : this.userProfile.companyNameEn
              }</div>
              <div class="tax-no">
                ${taxNumberLabel}: ${this.userProfile.vat}
              </div>
            </div>
          </div>

          <div class="client-section">
            <p style="font-weight: bold;">${welcomeLabel}</p>
            <p class="intro">${data.introduction}</p>
          </div>

          <table>
            <thead>
              <tr>
                <th>${colIndex}</th>
                <th>${colDescription}</th>
                <th>${colQty}</th>
                <th>${colUnitPrice}</th>
                <th>${colDiscount}</th>
                <th>${colTotal}</th>
              </tr>
            </thead>
            <tbody>
              ${data.lines
                .map(
                  (line, i) => `
                <tr>
                  <td>${i + 1}</td>
                  <td style="text-align:right; font-weight: 500;">${
                    line.description
                  }</td>
                  <td>${line.quantity}</td>
                  <td>${line.unitPrice}</td>
                  <td>${line.discount}%</td>
                  <td>${line.totalWithTaxAndDiscount}</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>

          <div class="grand-total">
            <div class="total-label">${totalAfterDiscountLabel}</div>
            <div class="total-amount">
              ${data.grandTotal}
              <br/>
              <span style="font-size: 12px; font-weight: normal;">${
                data.grandTotalTafqit
              }</span>
            </div>
          </div>

          <div class="terms">
            <div class="terms-title">${termsAndNotesLabel}:</div>
            <p>${data.subject}</p>
          </div>

          <div class="footer-parallel">
            <div class="contact-side">
              <div style="color:#1a237e; font-weight:bold; margin-bottom:8px">
                ${complaintsLabel}
              </div>
              <div>${
                this.isRTL
                  ? this.userProfile.companyAddressAr
                  : this.userProfile.companyAddressEn
              }</div>
              <div>${this.userProfile.phoneNumber}</div>
              <div>${this.userProfile.email}</div>
            </div>
          </div>

          <div class="signatures-footer">
            <div class="sig-box">
              <div class="sig-title">
                ${partOneLabel}
                <div style="font-size: 13px; margin-top: 5px; color: #546e7a;">
                  ${
                    this.isRTL
                      ? this.userProfile.companyNameAr
                      : this.userProfile.companyAddressEn
                  }
                </div>
              </div>
              <div class="sig-space"></div>
            </div>

            <div class="sig-box">
              <div class="sig-title">
                ${partTwoLabel}
                <div style="font-size: 13px; margin-top: 5px; color: #546e7a;">
                  ${data.clientName}
                </div>
              </div>
              <div class="sig-space"></div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
    this.printWindow(printContent);
  }
}
