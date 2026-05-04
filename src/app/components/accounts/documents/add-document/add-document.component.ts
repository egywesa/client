import { Component, Input, OnInit } from '@angular/core';
import { IClient } from 'src/app/shared/models/client';
import { DocumentsService } from '../documents.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { IDocumentLine, IDocumentType } from 'src/app/shared/models/documents';
import { ITax } from 'src/app/shared/models/tax';

@Component({
  selector: 'app-add-document',
  templateUrl: './add-document.component.html',
  styleUrls: ['./add-document.component.scss'],
})
export class AddDocumentComponent implements OnInit {
  @Input() clients: IClient[] = [];
  @Input() taxis: ITax[] = [];
  @Input() documentTypes: IDocumentType[] = [];
  documentForm: FormGroup;
  lineForm: FormGroup;
  lineItems: IDocumentLine[] = [];

  constructor(
    private documentsService: DocumentsService,
    private translate: TranslateService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {}

  private initDocumentForm() {
    this.documentForm = this.fb.group({
      documentType: [null, Validators.required],
      clientId: [null, Validators.required],
      subject: ['', Validators.required],
      introduction: [''],
    });
  }

  private initLineForm() {
    this.lineForm = this.fb.group({
      description: ['', Validators.required],
      quantity: ['', Validators.required],
      unitPrice: ['', Validators.required],
      discount: ['', Validators.required],
      taxId: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.initDocumentForm();
    this.initLineForm();
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

  editLine(index: number, line: IDocumentLine) {
    this.lineItems.splice(index, 1);
    this.lineForm.patchValue(line);
  }

  removeLine(index: number): void {
    this.lineItems.splice(index, 1);
  }

  resetDocumentForm() {
    this.documentForm.reset({
      documentType: null,
      clientId: null,
    });
  }

  saveDocument() {
    if (this.documentForm.invalid) {
      this.documentForm.markAllAsTouched();
    } else {
      const documentData = {
        ...this.documentForm.value,
        lines: this.lineItems,
      };
      this.documentsService.addDocument(documentData).subscribe({
        next: () => {
          this.toastr.success(this.translate.instant('saveSucess'));
          this.resetDocumentForm();
          this.lineForm.reset({ taxPercent: null });
          this.lineItems = [];
        },
      });
    }
  }
}
