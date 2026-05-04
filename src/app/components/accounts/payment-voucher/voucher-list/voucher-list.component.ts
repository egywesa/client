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
import {
  IPaymentVoucher,
  IPaymentVoucherRes,
} from 'src/app/shared/models/payment-voucher';
import { ISupplier } from 'src/app/shared/models/suppliers';
import { PaymentVoucherService } from '../payment-voucher.service';
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
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-voucher-list',
  templateUrl: './voucher-list.component.html',
  styleUrls: ['./voucher-list.component.scss'],
})
export class VoucherListComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() banks: IBank[] = [];
  @Input() suppliers: ISupplier[] = [];
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator: any;
  dataSource = new MatTableDataSource<IPaymentVoucher>([]);
  displayedColumns: string[] = [
    'id',
    'date',
    'supplierName',
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
    private paymentVoucherService: PaymentVoucherService,
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
        supplierId: [null],
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
      supplierId: [null, Validators.required],
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
    this.paymentVoucherService.fetchPaymentVouchers();
    this.paymentVoucherService.vouchers$
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
    this.paymentVoucherService.setActivePage(event.pageIndex + 1);
    if (this.searched) {
      this.paymentVoucherService
        .searchVouchers(this.searchForm.value)
        .subscribe();
    } else {
      this.paymentVoucherService.fetchPaymentVouchers();
    }
  }

  onSearch() {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
    } else {
      if (this.paginator.pageIndex > 0) {
        this.paginator.firstPage(); // This will reset the page index to 0 and trigger onPageChange event which will handle the search to avoid double search request
      } else {
        this.paymentVoucherService
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
      this.paymentVoucherService
        .exportPaymentVouchers(this.searchForm.value)
        .subscribe({
          next: (data) => {
            this.searchForm.reset();
            this.searched = false;
            this.fileService.downloadFile(
              data,
              this.translate.instant('payment-voucher.title'),
              FileType.EXCEL
            );
          },
        });
    }
  }

  onPrintVoucher(voucher: IPaymentVoucher) {
    this.printService.printPaymentVoucher(voucher);
  }

  onDelete(voucher: IPaymentVoucher) {
    if (confirm(this.translate.instant('deleteConfirmation'))) {
      this.paymentVoucherService.deleteVoucher(voucher.id).subscribe({
        next: () => {
          this.toastr.success(this.translate.instant('deleteSuccess'));
        },
      });
    }
  }

  openModal(voucher: IPaymentVoucherRes) {
    this.initModalForm();
    this.modalForm.patchValue(voucher);
    this.modalVisible = true;
  }

  saveModal(voucher: IPaymentVoucher) {
    if (this.modalForm.invalid) {
      this.modalForm.markAllAsTouched();
    } else {
      this.paymentVoucherService.editVoucher(voucher).subscribe({
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
