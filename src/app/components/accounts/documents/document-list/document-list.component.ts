import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {
  IDocument,
  IDocumentLine,
  IDocumentType,
} from 'src/app/shared/models/documents';
import { ITax } from 'src/app/shared/models/tax';
import { DocumentsService } from '../documents.service';
import { IClient } from 'src/app/shared/models/client';
import { Subject, takeUntil } from 'rxjs';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PrintService } from 'src/app/services/print.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss'],
})
export class DocumentListComponent implements OnInit, AfterViewInit {
  @Input() clients: IClient[] = [];
  @Input() taxis: ITax[] = [];
  @Input() documentTypes: IDocumentType[] = [];
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator: any;
  dataSource = new MatTableDataSource<IDocument>([]);
  displayedColumns: string[] = [
    'id',
    'displayNumber',
    'documentType',
    'documentDate',
    'clientName',
    'actions',
  ];
  searchForm: FormGroup;
  modalForm: FormGroup;
  modalVisible: boolean = false;
  searched: boolean = false;
  lineForm: FormGroup;
  lineItems: IDocumentLine[] = [];

  // Pagination
  totalCount: number = 0;
  pageSize: number = 20;

  private destroy$ = new Subject<void>();

  constructor(
    private documentService: DocumentsService,
    private translate: TranslateService,
    private fb: FormBuilder,
    private printService: PrintService,
    private toastr: ToastrService
  ) {}

  private initSearchForm() {
    this.searchForm = this.fb.group({
      documentType: [null],
      clientId: [null],
      search: [''],
    });
  }

  private initModalForm() {
    this.modalForm = this.fb.group({
      id: [null],
      documentType: [null, Validators.required],
      clientId: [null, Validators.required],
      subject: ['', Validators.required],
      introduction: [''],
    });
  }

  private initLineForm() {
    this.lineForm = this.fb.group({
      id: [''],
      description: ['', Validators.required],
      quantity: ['', Validators.required],
      unitPrice: ['', Validators.required],
      discount: ['', Validators.required],
      taxId: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.initSearchForm();
    this.documentService.fetchDocuments();
    this.documentService.documents$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.dataSource.data = res.items;
        this.totalCount = res.totalCount;
        this.pageSize = res.pageSize;
      },
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  onPageChange(event: PageEvent) {
    this.documentService.setActivePage(event.pageIndex + 1);
    if (this.searched) {
      this.documentService.fetchDocuments(this.searchForm.value);
    } else {
      this.documentService.fetchDocuments();
    }
  }

  getDocumentType(typeValue: number): string {
    const docType = this.documentTypes.find((dt) => dt.value === typeValue);
    return docType ? docType.label : '';
  }

  onSearch() {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
    } else {
      if (this.paginator.pageIndex > 0) {
        this.paginator.firstPage(); // This will reset the page index to 0 and trigger onPageChange event which will handle the search to avoid double search request
      } else {
        this.documentService.fetchDocuments(this.searchForm.value);
        this.searched = true;
      }
    }
  }

  onDelete(document: IDocument) {
    if (confirm(this.translate.instant('deleteConfirmation'))) {
      this.documentService.deleteDocument(document.id).subscribe({
        next: () => {
          this.toastr.success(this.translate.instant('deleteSuccess'));
        },
      });
    }
  }

  getTaxPercent(id: number): string {
    const tax = this.taxis.find((t) => t.id === id);
    return tax ? tax.taxName : '';
  }

  addLine(line: IDocumentLine) {
    if (this.lineForm.invalid) {
      this.lineForm.markAllAsTouched();
    } else {
      this.lineItems.push(line);
      this.lineForm.reset({ taxPercent: null });
    }
  }

  editLine(line: IDocumentLine) {
    this.removeLine(line.id);
    this.lineForm.patchValue(line);
  }

  removeLine(id: number): void {
    this.lineItems = this.lineItems.filter((l) => l.id !== id);
  }

  openModal(document: IDocument) {
    this.initModalForm();
    this.initLineForm();
    this.lineItems = structuredClone(document.lines);
    this.modalVisible = true;
    this.modalForm.patchValue(document);
  }

  saveDocumentChanges(document: IDocument) {
    if (this.modalForm.invalid) {
      this.modalForm.markAllAsTouched();
    } else {
      const documentData = {
        ...this.modalForm.value,
        lines: this.lineItems,
      };
      this.documentService.editDocument(documentData).subscribe({
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

  onPrintdocument(document: IDocument) {
    if (document.documentType === 1) {
      this.printService.printQuotationDocument(document);
    } else if (document.documentType === 2) {
      this.printService.printContractDocument(document);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
