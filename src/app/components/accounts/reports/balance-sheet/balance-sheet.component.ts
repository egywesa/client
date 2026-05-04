import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../reports.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileType } from 'src/app/shared/models/file';
import { FileService } from 'src/app/services/file.service';
import { TranslateService } from '@ngx-translate/core';
import { IBalanceSheetRes } from 'src/app/shared/models/reports';
import { PrintService } from 'src/app/services/print.service';
import { dateRangeValidator } from 'src/app/shared/validators/DateRang.validator';

@Component({
  selector: 'app-balance-sheet',
  templateUrl: './balance-sheet.component.html',
  styleUrls: ['./balance-sheet.component.scss'],
})
export class BalanceSheetComponent implements OnInit {
  balanceSheetReport: IBalanceSheetRes;
  searchForm: FormGroup;
  fileTypeOptions = FileType;

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
      },
      { validators: dateRangeValidator('fromDate', 'toDate') }
    );
  }

  ngOnInit(): void {
    this.initSearchForm();
  }

  onSearch() {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
    } else {
      this.ReportsService.searchBalanceSheet(this.searchForm.value).subscribe({
        next: (data) => (this.balanceSheetReport = data),
      });
    }
  }

  onExport(fileType: FileType) {
    this.ReportsService.exportBalanceSheet(
      this.searchForm.value,
      fileType
    ).subscribe({
      next: (data) =>
        this.fileService.downloadFile(
          data,
          this.translate.instant('reports.balance-sheet'),
          fileType
        ),
    });
  }

  onPrint() {
    if (this.balanceSheetReport) {
      this.printService.printBalanceSheetReport(this.balanceSheetReport);
    }
  }
}
