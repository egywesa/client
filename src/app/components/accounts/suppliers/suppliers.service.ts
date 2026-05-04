import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { IFileRes } from 'src/app/shared/models/file';
import {
  ISupplier,
  ISuppliersRes,
  ISuppliersSearchCriteria,
} from 'src/app/shared/models/suppliers';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SuppliersService {
  private baseUrl = environment.baseUrl;
  private suppliersObject = new BehaviorSubject<ISuppliersRes>({
    data: [],
    totalCount: 0,
    page: 1,
    pageSize: 20,
  });
  suppliers$ = this.suppliersObject.asObservable();
  activePage: number = 1;

  constructor(private http: HttpClient) {}

  setActivePage(page: number) {
    this.activePage = page;
  }

  fetchSuppliers() {
    return this.http
      .get<ISuppliersRes>(
        `${this.baseUrl}api/Suppliers?page=${this.activePage}`
      )
      .subscribe((suppliers: ISuppliersRes) => {
        this.suppliersObject.next(suppliers);
      });
  }

  addSupplier(supplier: ISupplier) {
    return this.http
      .post<ISupplier>(this.baseUrl + 'api/Suppliers', supplier)
      .pipe(tap(() => this.fetchSuppliers()));
  }

  editSupplier(supplier: ISupplier) {
    const { id, ...payload } = supplier;
    return this.http
      .put<ISupplier>(`${this.baseUrl}api/Suppliers/${supplier.id}`, payload)
      .pipe(tap(() => this.fetchSuppliers()));
  }

  deleteSupplier(id: number) {
    return this.http
      .delete<ISupplier>(`${this.baseUrl}api/Suppliers/${id}`)
      .pipe(tap(() => this.fetchSuppliers()));
  }

  searchSuppliers(searchCriteria: ISuppliersSearchCriteria) {
    return this.http
      .get<ISuppliersRes>(`${this.baseUrl}api/Suppliers/Search`, {
        params: {
          name: searchCriteria.name || '',
          contactName: searchCriteria.contactName || '',
          phone: searchCriteria.phone || '',
          address: searchCriteria.address || '',
          page: this.activePage,
        },
      })
      .pipe(tap((suppliers) => this.suppliersObject.next(suppliers)));
  }

  exportSuppliers(searchCriteria: ISuppliersSearchCriteria) {
    return this.http.get<IFileRes>(`${this.baseUrl}api/Suppliers/Export`, {
      params: {
        name: searchCriteria.name || '',
        contactName: searchCriteria.contactName || '',
        phone: searchCriteria.phone || '',
        address: searchCriteria.address || '',
      },
    });
  }
}
