import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { IClient } from 'src/app/shared/models/client';
import {
  IDocument,
  IDocumentRes,
  IDocumentSearchForm,
} from 'src/app/shared/models/documents';
import { ITax } from 'src/app/shared/models/tax';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DocumentsService {
  baseUrl = environment.baseUrl;
  documentsSubject = new BehaviorSubject<IDocumentRes>({
    items: [],
    totalCount: 0,
    page: 1,
    pageSize: 20,
  });
  documents$ = this.documentsSubject.asObservable();
  activePage: number = 1;

  constructor(private http: HttpClient) {}

  setActivePage(page: number) {
    this.activePage = page;
  }

  getClients() {
    return this.http.get<IClient[]>(this.baseUrl + 'api/Clients/Lookup');
  }

  getTaxis() {
    return this.http.get<ITax[]>(this.baseUrl + 'api/Taxis');
  }

  fetchDocuments(searchForm?: IDocumentSearchForm) {
    return this.http
      .get<IDocumentRes>(`${this.baseUrl}api/Documents`, {
        params: {
          page: this.activePage,
          type: searchForm?.documentType || '',
          clientId: searchForm?.clientId || '',
          search: searchForm?.search || '',
        },
      })
      .subscribe((data) => this.documentsSubject.next(data));
  }

  addDocument(document: IDocument) {
    return this.http
      .post(`${this.baseUrl}api/Documents`, document)
      .pipe(tap(() => this.fetchDocuments()));
  }

  editDocument(document: IDocument) {
    const { id, ...payload } = document;
    return this.http
      .put(`${this.baseUrl}api/Documents/${document.id}`, payload)
      .pipe(tap(() => this.fetchDocuments()));
  }

  deleteDocument(id: number) {
    return this.http
      .delete(`${this.baseUrl}api/Documents/${id}`)
      .pipe(tap(() => this.fetchDocuments()));
  }
}
