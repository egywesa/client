import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { SuppliersService } from '../suppliers.service';
import { MatTableDataSource } from '@angular/material/table';
import { ISupplier } from 'src/app/shared/models/suppliers';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { whitespaceValidator } from 'src/app/shared/validators/whitespace.validator';
import { FileService } from 'src/app/services/file.service';
import { FileType } from 'src/app/shared/models/file';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.scss'],
})
export class SupplierListComponent implements OnInit, AfterViewInit, OnDestroy {
  dataSource = new MatTableDataSource<ISupplier>([]);
  displayedColumns: string[] = [
    'code',
    'name',
    'contactName',
    'phone',
    'email',
    'address',
    'actions',
  ];
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator: any;
  modalForm: FormGroup;
  searchForm: FormGroup;
  modalVisible: boolean = false;
  searched: boolean = false;

  // Pagination
  totalCount: number = 0;
  pageSize: number = 20;

  private destroy$ = new Subject<void>();

  constructor(
    private suppliersService: SuppliersService,
    private translate: TranslateService,
    private fb: FormBuilder,
    private fileService: FileService,
    private toastr: ToastrService
  ) {}

  private initSearchForm() {
    this.searchForm = this.fb.group({
      name: [''],
      contactName: [''],
      phone: [''],
      address: [''],
    });
  }

  private initModalForm() {
    this.modalForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required, whitespaceValidator]],
      contactName: [''],
      phone: [''],
      email: [''],
      address: [''],
    });
  }

  ngOnInit(): void {
    this.initSearchForm();
    this.suppliersService.fetchSuppliers();
    this.suppliersService.suppliers$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (suppliers) => {
        this.pageSize = suppliers.pageSize;
        this.totalCount = suppliers.totalCount;
        this.dataSource.data = suppliers.data;
      },
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  onPageChange(event: PageEvent) {
    this.suppliersService.setActivePage(event.pageIndex + 1);
    if (this.searched) {
      this.suppliersService.searchSuppliers(this.searchForm.value).subscribe();
    } else {
      this.suppliersService.fetchSuppliers();
    }
  }

  onDelete(supplier: ISupplier) {
    if (confirm(this.translate.instant('deleteConfirmation'))) {
      this.suppliersService.deleteSupplier(supplier.id).subscribe({
        next: () => {
          this.toastr.success(this.translate.instant('deleteSuccess'));
        },
      });
    }
  }

  openModal(supplier: ISupplier) {
    this.initModalForm();
    this.modalForm.patchValue(supplier);
    this.modalVisible = true;
  }

  saveModal(supplier: ISupplier) {
    if (this.modalForm.invalid) {
      this.modalForm.markAllAsTouched();
    } else {
      this.suppliersService.editSupplier(supplier).subscribe({
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

  onSearch() {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
    } else {
      if (this.paginator.pageIndex > 0) {
        this.paginator.firstPage(); // This will reset the page index to 0 and trigger onPageChange event which will handle the search to avoid double search request
      } else {
        this.suppliersService
          .searchSuppliers(this.searchForm.value)
          .subscribe();
      }
      this.searched = true;
    }
  }

  onExportToExcel() {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
    } else {
      this.suppliersService.exportSuppliers(this.searchForm.value).subscribe({
        next: (data) => {
          this.searchForm.reset();
          this.searched = false;
          this.fileService.downloadFile(
            data,
            this.translate.instant('suppliers.title'),
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
