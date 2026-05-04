import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileType } from 'src/app/shared/models/file';
import { IAccountStatementRes } from 'src/app/shared/models/reports';
import { ReportsService } from '../reports.service';
import { FileService } from 'src/app/services/file.service';
import { PrintService } from 'src/app/services/print.service';
import { TranslateService } from '@ngx-translate/core';
import { dateRangeValidator } from 'src/app/shared/validators/DateRang.validator';
import { IChartOfAccount } from 'src/app/shared/models/accounts';

@Component({
  selector: 'app-account-statement',
  templateUrl: './account-statement.component.html',
  styleUrls: ['./account-statement.component.scss'],
})
export class AccountStatementComponent implements OnInit {
  accountStatementReport: IAccountStatementRes;
  searchForm: FormGroup;
  fileTypeOptions = FileType;
  accounts: IChartOfAccount[];

  constructor(
    private ReportsService: ReportsService,
    private fb: FormBuilder,
    private fileService: FileService,
    private printService: PrintService,
    private translate: TranslateService
  ) {}

  private initSearchForm() {
    this.searchForm = this.fb.group(
      {
        fromDate: ['', Validators.required],
        toDate: ['', Validators.required],
        accountId: [null, Validators.required],
      },
      { validators: dateRangeValidator('fromDate', 'toDate') }
    );
  }

  ngOnInit(): void {
    this.initSearchForm();
    this.ReportsService.getAccounts().subscribe({
      next: (accounts) => (this.accounts = accounts),
    });
  }

  onSearch() {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
    } else {
      this.ReportsService.searchAccountStatementReport(
        this.searchForm.value
      ).subscribe({
        next: (report) => (this.accountStatementReport = report),
      });
    }
  }

  onExport(fileType: FileType) {
    this.ReportsService.exportAccountStatement(
      this.searchForm.value,
      fileType
    ).subscribe({
      next: (data) =>
        this.fileService.downloadFile(
          data,
          this.translate.instant('reports.account-statement'),
          fileType
        ),
    });
  }

  onPrint() {
    if (this.accountStatementReport) {
      if (this.accountStatementReport.mode === 'Detailed') {
        this.printService.printDetailedAccountStatementReport(
          this.accountStatementReport
        );
      } else {
        this.printService.printGroupedAccountStatementReport(
          this.accountStatementReport
        );
      }
    }
  }
}
