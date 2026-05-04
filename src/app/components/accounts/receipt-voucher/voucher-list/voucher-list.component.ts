import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IBank } from 'src/app/shared/models/bank';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TranslateService } from '@ngx-translate/core';
import { PrintService } from 'src/app/services/print.service';
import { FileService } from 'src/app/services/file.service';
import { FileType } from 'src/app/shared/models/file';
import { dateRangeValidator } from 'src/app/shared/validators/DateRang.validator';
import { REGEX } from 'src/app/utils/regex.constants';
import { ToastrService } from 'ngx-toastr';
import { ReceiptVoucherService } from '../receipt-voucher.service';
import { IClient } from 'src/app/shared/models/client';
import {
  IReceiptVoucher,
  IReceiptVoucherRes,
} from 'src/app/shared/models/receipt-voucher';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-receipt-voucher-list',
  templateUrl: './voucher-list.component.html',
  styleUrls: ['./voucher-list.component.scss'],
})
export class ReceiptVoucherListComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @Input() banks: IBank[] = [];
  @Input() clients: IClient[] = [];
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator: any;
  dataSource = new MatTableDataSource<IReceiptVoucher>([]);
  displayedColumns: string[] = [
    'id',
    'date',
    'clientName',
    'bankName',
    'amount',
    'description',
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
    private receiptVoucherService: ReceiptVoucherService,
    private translate: TranslateService,
    private fb: FormBuilder,
    private printService: PrintService,
    private fileService: FileService,
    private toastr: ToastrService
  ) {}

  private initSearchForm() {
    this.searchForm = this.fb.group(
      {
        fromDate: [''],
        toDate: [''],
        clientId: [null],
        bankId: [null],
        description: [''],
      },
      { validators: dateRangeValidator('fromDate', 'toDate') }
    );
  }

  private initModalForm() {
    this.modalForm = this.fb.group({
      id: [null],
      date: ['', Validators.required],
      clientId: [null, Validators.required],
      bankId: [null, Validators.required],
      amount: [
        null,
        [Validators.required, Validators.pattern(REGEX.positiveNegativeNumber)],
      ],
      description: [''],
    });
  }

  ngOnInit(): void {
    this.initSearchForm();
    this.receiptVoucherService.fetchReceiptVouchers();
    this.receiptVoucherService.vouchers$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (vouchers) => {
          this.pageSize = vouchers.pageSize;
          this.totalCount = vouchers.totalCount;
          this.dataSource.data = vouchers.data;
        },
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  onPageChange(event: PageEvent) {
    this.receiptVoucherService.setActivePage(event.pageIndex + 1);
    if (this.searched) {
      this.receiptVoucherService
        .searchVouchers(this.searchForm.value)
        .subscribe();
    } else {
      this.receiptVoucherService.fetchReceiptVouchers();
    }
  }

  onSearch() {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
    } else {
      if (this.paginator.pageIndex > 0) {
        this.paginator.firstPage(); // This will reset the page index to 0 and trigger onPageChange event which will handle the search to avoid double search request
      } else {
        this.receiptVoucherService
          .searchVouchers(this.searchForm.value)
          .subscribe();
      }
      this.searched = true;
    }
  }

  onExportToExcel() {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
    } else {
      this.receiptVoucherService
        .exportReceiptVouchers(this.searchForm.value)
        .subscribe({
          next: (data) => {
            this.searchForm.reset();
            this.searched = false;
            this.fileService.downloadFile(
              data,
              this.translate.instant('receipt-voucher.title'),
              FileType.EXCEL
            );
          },
        });
    }
  }

  onPrintVoucher(voucher: IReceiptVoucher) {
    this.printService.printReceipVoucher(voucher);
  }

  onDelete(voucher: IReceiptVoucher) {
    if (confirm(this.translate.instant('deleteConfirmation'))) {
      this.receiptVoucherService.deleteVoucher(voucher.id).subscribe({
        next: () => {
          this.toastr.success(this.translate.instant('deleteSuccess'));
        },
      });
    }
  }

  openModal(voucher: IReceiptVoucherRes) {
    this.initModalForm();
    this.modalForm.patchValue(voucher);
    this.modalVisible = true;
  }

  saveModal(voucher: IReceiptVoucher) {
    if (this.modalForm.invalid) {
      this.modalForm.markAllAsTouched();
    } else {
      this.receiptVoucherService.editVoucher(voucher).subscribe({
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
