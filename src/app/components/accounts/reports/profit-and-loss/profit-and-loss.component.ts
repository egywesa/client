import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReportsService } from '../reports.service';
import { FileService } from 'src/app/services/file.service';
import { TranslateService } from '@ngx-translate/core';
import { FileType } from 'src/app/shared/models/file';
import { IProfitAndLossRes } from 'src/app/shared/models/reports';
import { PrintService } from 'src/app/services/print.service';
import { dateRangeValidator } from 'src/app/shared/validators/DateRang.validator';

@Component({
  selector: 'app-profit-and-loss',
  templateUrl: './profit-and-loss.component.html',
  styleUrls: ['./profit-and-loss.component.scss'],
})
export class ProfitAndLossComponent implements OnInit {
  profitAndLossReport: IProfitAndLossRes;
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
      this.ReportsService.searchProfitAndLoss(this.searchForm.value).subscribe({
        next: (report) => (this.profitAndLossReport = report),
      });
    }
  }

  onExport(fileType: FileType) {
    this.ReportsService.exportProfitAndLoss(
      this.searchForm.value,
      fileType
    ).subscribe({
      next: (data) =>
        this.fileService.downloadFile(
          data,
          this.translate.instant('reports.profit-and-loss'),
          fileType
        ),
    });
  }

  onPrint() {
    if (this.profitAndLossReport) {
      this.printService.printProfitAndLossReport(this.profitAndLossReport);
    }
  }
}
