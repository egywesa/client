import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IChartOfAccount } from 'src/app/shared/models/accounts';
import { IJournalEntry } from 'src/app/shared/models/journal';
import { JournalEntryService } from '../journal-entry.service';
import { TranslateService } from '@ngx-translate/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PrintService } from 'src/app/services/print.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { FileService } from 'src/app/services/file.service';
import { FileType } from 'src/app/shared/models/file';
import { dateRangeValidator } from 'src/app/shared/validators/DateRang.validator';
import { REGEX } from 'src/app/utils/regex.constants';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-journal-list',
  templateUrl: './journal-list.component.html',
  styleUrls: ['./journal-list.component.scss'],
})
export class JournalListComponent implements OnInit, OnDestroy {
  @Input() accounts: IChartOfAccount[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  journalForm: FormGroup;
  searchForm: FormGroup;
  journalEntries: IJournalEntry[] = [];
  modalVisible: boolean = false;
  searched: boolean = false;

  // Pagination
  totalCount: number = 0;
  pageSize: number = 20;

  private destroy$ = new Subject<void>();

  constructor(
    private journalService: JournalEntryService,
    private fb: FormBuilder,
    private translate: TranslateService,
    private printService: PrintService,
    private fileService: FileService,
    private toastr: ToastrService
  ) {}

  private initModalForm() {
    this.journalForm = this.fb.group({
      id: [''],
      entryDate: ['', Validators.required],
      description: [''],
      lines: this.fb.array([]),
    });
  }

  private initSearchForm() {
    this.searchForm = this.fb.group(
      {
        fromDate: [''],
        toDate: [''],
        accountId: [null],
        description: [''],
      },
      { validators: dateRangeValidator('fromDate', 'toDate') }
    );
  }

  ngOnInit(): void {
    this.initSearchForm();
    this.journalService.fetchJournalEntries();
    this.journalService.journalEntries$
      .pipe(takeUntil(this.destroy$))
      .subscribe((entries) => {
        this.journalEntries = entries.data;
        this.totalCount = entries.totalCount;
        this.pageSize = entries.pageSize;
      });
  }

  onPageChange(event: PageEvent) {
    this.journalService.setActivePage(event.pageIndex + 1);
    if (this.searched) {
      this.journalService.searchEntry(this.searchForm.value).subscribe();
    } else {
      this.journalService.fetchJournalEntries();
    }
  }

  get lineItems() {
    return this.journalForm.get('lines') as FormArray;
  }

  addLine() {
    const line = this.fb.group({
      accountId: [null, Validators.required],
      amount: [
        null,
        [Validators.required, Validators.pattern(REGEX.positiveNegativeNumber)],
      ],
      description: [''],
    });

    this.lineItems.push(line);
  }

  removeLine(index: number): void {
    this.lineItems.removeAt(index);
  }

  onDelete(entry: IJournalEntry) {
    if (confirm(this.translate.instant('deleteConfirmation'))) {
      this.journalService.deleteEntry(entry.id).subscribe({
        next: () => {
          this.toastr.success(this.translate.instant('deleteSuccess'));
        },
      });
    }
  }

  openModal(entry: IJournalEntry) {
    this.initModalForm();
    this.journalForm.patchValue(entry);

    entry.lines.forEach((line) => {
      this.lineItems.push(
        this.fb.group({
          accountId: [line.accountId, Validators.required],
          amount: [
            line.amount,
            [
              Validators.required,
              Validators.pattern(REGEX.positiveNegativeNumber),
            ],
          ],
          description: [line.description],
        })
      );
    });

    this.modalVisible = true;
  }

  saveModal(entry: IJournalEntry) {
    if (this.journalForm.invalid) {
      this.journalForm.markAllAsTouched();
    } else {
      this.journalService.editEntry(entry).subscribe({
        next: () => {
          this.closeModal();
          this.toastr.success(this.translate.instant('saveSucess'));
        },
      });
    }
  }

  closeModal() {
    this.modalVisible = false;
    this.journalForm.reset();
  }

  printEntry(entry: IJournalEntry) {
    this.printService.printJournalEntry(entry);
  }

  onSearch() {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
    } else {
      if (this.paginator.pageIndex > 0) {
        this.paginator.firstPage(); // This will reset the page index to 0 and trigger onPageChange event which will handle the search to avoid double search request
      } else {
        this.journalService.searchEntry(this.searchForm.value).subscribe();
      }
      this.searched = true;
    }
  }

  onExportToExcel() {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
    } else {
      this.journalService
        .exportJournalEntries(this.searchForm.value)
        .subscribe({
          next: (data) => {
            this.searched = false;
            this.searchForm.reset();
            this.fileService.downloadFile(
              data,
              this.translate.instant('journal-entry.title'),
              FileType.EXCEL
            );
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
