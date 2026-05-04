import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IChartOfAccount } from 'src/app/shared/models/accounts';
import {
  IManualEntry,
  IManualEntryRes,
} from 'src/app/shared/models/manual-entry';
import { ManualEntryService } from '../manual-entry.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { dateRangeValidator } from 'src/app/shared/validators/DateRang.validator';
import { REGEX } from 'src/app/utils/regex.constants';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.scss'],
})
export class EntryListComponent implements OnInit, OnDestroy {
  @Input() accounts: IChartOfAccount[] = [];
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator: any;
  dataSource = new MatTableDataSource<IManualEntry>([]);
  displayedColumns: string[] = [
    'id',
    'entryDate',
    'accountName',
    'amount',
    'actions',
  ];
  searchForm: FormGroup;
  modalForm: FormGroup;
  modalVisible: boolean = false;
  searched: boolean = false;

  // Pagination
  totalCount: number = 0;
  pageSize: number = 20;

  private destroy$ = new Subject<void>();

  constructor(
    private manualEntryService: ManualEntryService,
    private translate: TranslateService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {}

  private initSearchForm() {
    this.searchForm = this.fb.group(
      {
        fromDate: [''],
        toDate: [''],
        accountId: [null],
      },
      { validators: dateRangeValidator('fromDate', 'toDate') }
    );
  }

  private initModalForm() {
    this.modalForm = this.fb.group({
      id: [null],
      entryDate: ['', Validators.required],
      accountId: [null, Validators.required],
      amount: [
        null,
        [Validators.required, Validators.pattern(REGEX.positiveNegativeNumber)],
      ],
    });
  }

  ngOnInit(): void {
    this.initSearchForm();
    this.manualEntryService.fetchManualEntry();
    this.manualEntryService.manualEntry$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (entries) => {
          this.pageSize = entries.pageSize;
          this.totalCount = entries.totalCount;
          this.dataSource.data = entries.data;
        },
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  onPageChange(event: PageEvent) {
    this.manualEntryService.setActivePage(event.pageIndex + 1);
    if (this.searched) {
      this.manualEntryService.searchEntry(this.searchForm.value).subscribe();
    } else {
      this.manualEntryService.fetchManualEntry();
    }
  }

  onSearch() {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
    } else {
      if (this.paginator.pageIndex > 0) {
        this.paginator.firstPage(); // This will reset the page index to 0 and trigger onPageChange event which will handle the search to avoid double search request
      } else {
        this.manualEntryService.searchEntry(this.searchForm.value).subscribe();
      }
      this.searched = true;
    }
  }

  onDelete(entry: IManualEntry) {
    if (confirm(this.translate.instant('deleteConfirmation'))) {
      this.manualEntryService.deleteEntry(entry.id).subscribe({
        next: () => {
          this.toastr.success(this.translate.instant('deleteSuccess'));
        },
      });
    }
  }

  openModal(entry: IManualEntryRes) {
    this.initModalForm();
    this.modalForm.patchValue(entry);
    this.modalVisible = true;
  }

  saveModal(entry: IManualEntry) {
    if (this.modalForm.invalid) {
      this.modalForm.markAllAsTouched();
    } else {
      this.manualEntryService.editEntry(entry).subscribe({
        next: () => {
          this.closeModal();
          this.toastr.success(this.translate.instant('saveSucess'));
        },
      });
    }
  }

  closeModal() {
    this.modalVisible = false;
    this.modalForm.reset();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
