import { Component, OnInit } from '@angular/core';
import { DocumentsService } from './documents.service';
import { IClient } from 'src/app/shared/models/client';
import { TranslateService } from '@ngx-translate/core';
import { ITax } from 'src/app/shared/models/tax';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss'],
})
export class DocumentsComponent implements OnInit {
  clients: IClient[] = [];
  taxis: ITax[] = [];
  documentTypeOptions = [
    {
      label: this.translate.instant('form-labels.type-quotation'),
      value: 1,
    },
    {
      label: this.translate.instant('form-labels.type-contract'),
      value: 2,
    },
  ];

  constructor(
    private documentsService: DocumentsService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.documentsService
      .getClients()
      .subscribe((clients) => (this.clients = clients));

    this.documentsService.getTaxis().subscribe((taxis) => (this.taxis = taxis));
  }
}
