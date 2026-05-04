import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, tap } from 'rxjs';
import {
  IPaymentVoucher,
  IPaymentVoucherRes,
  IPaymentVoucherSearchCriteria,
} from 'src/app/shared/models/payment-voucher';
import { IBank } from 'src/app/shared/models/bank';
import { ISuppliersRes } from 'src/app/shared/models/suppliers';
import { IFileRes } from 'src/app/shared/models/file';

@Injectable({
  providedIn: 'root',
})
export class PaymentVoucherService {
  baseUrl = environment.baseUrl;
  vouchersObject = new BehaviorSubject<IPaymentVoucherRes>({
    data: [],
    totalCount: 0,
    page: 1,
    pageSize: 20,
  });
  vouchers$ = this.vouchersObject.asObservable();
  activePage: number = 1;

  constructor(private http: HttpClient) {}

  setActivePage(page: number) {
    this.activePage = page;
  }

  // =================== LOOKUPS ===================
  getBanks() {
    return this.http.get<IBank[]>(this.baseUrl + 'api/Banks/Lookup');
  }

  getSuppliers() {
    return this.http.get<ISuppliersRes>(
      this.baseUrl + 'api/PromissoryNotes/SuppliersLookup'
    );
  }

  // =================== FETCH ===================
  fetchPaymentVouchers() {
    const url = `${this.baseUrl}api/PromissoryNotes?page=${this.activePage}&pageSize=20`;

    this.http.get<IPaymentVoucherRes>(url, { responseType: 'json' }).subscribe({
      next: (data) => this.vouchersObject.next(data),
      error: (err) => this.handleError(err, 'fetching payment vouchers')
    });
  }

  // =================== CREATE ===================
  addVoucher(voucher: IPaymentVoucher) {
    return this.http
      .post<IPaymentVoucher>(this.baseUrl + 'api/PromissoryNotes', voucher)
      .pipe(tap(() => this.fetchPaymentVouchers()));
  }

  // =================== UPDATE ===================
  editVoucher(voucher: IPaymentVoucher) {
    const { id, ...payload } = voucher;
    return this.http
      .put<IPaymentVoucher>(
        `${this.baseUrl}api/PromissoryNotes/${voucher.id}`,
        payload
      )
      .pipe(tap(() => this.fetchPaymentVouchers()));
  }

  // =================== DELETE ===================
  deleteVoucher(id: number) {
    return this.http
      .delete<IPaymentVoucherRes>(`${this.baseUrl}api/PromissoryNotes/${id}`)
      .pipe(tap(() => this.fetchPaymentVouchers()));
  }

  // =================== SEARCH ===================
  searchVouchers(searchCriteria: IPaymentVoucherSearchCriteria) {
    return this.http
      .get<IPaymentVoucherRes>(`${this.baseUrl}api/PromissoryNotes/Search`, {
        params: {
          fromDate: searchCriteria.fromDate || '',
          toDate: searchCriteria.toDate || '',
          supplierId: searchCriteria.supplierId || '',
          bankId: searchCriteria.bankId || '',
          description: searchCriteria.description || '',
          page: this.activePage,
        },
      })
      .pipe(tap((data) => this.vouchersObject.next(data)));
  }

  // =================== EXPORT ===================
  exportPaymentVouchers(searchCriteria: IPaymentVoucherSearchCriteria) {
    return this.http.get<IFileRes>(
      `${this.baseUrl}api/PromissoryNotes/Export`,
      {
        params: {
          fromDate: searchCriteria.fromDate || '',
          toDate: searchCriteria.toDate || '',
          supplierId: searchCriteria.supplierId || '',
          bankId: searchCriteria.bankId || '',
          description: searchCriteria.description || '',
        },
      }
    );
  }

  // =================== ERROR HANDLER ===================
  private handleError(err: any, context: string) {
    console.error(`Error ${context}:`, err);

    if (err.status === 401) {
      alert('Unauthorized. Please login again.');
    } else if (err.status === 404) {
      alert('Endpoint not found. Check the URL.');
    } else {
      alert(`An error occurred while ${context}.`);
    }
  }
}
