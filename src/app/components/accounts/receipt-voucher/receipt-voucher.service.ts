import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, tap } from 'rxjs';
import {
  IReceiptVoucher,
  IReceiptVoucherRes,
  IReceiptVoucherSearchCriteria,
} from 'src/app/shared/models/receipt-voucher';
import { IBank } from 'src/app/shared/models/bank';
import { IFileRes } from 'src/app/shared/models/file';
import { IClientRes } from 'src/app/shared/models/client';

@Injectable({
  providedIn: 'root',
})
export class ReceiptVoucherService {
  baseUrl = environment.baseUrl;
  vouchersObject = new BehaviorSubject<IReceiptVoucherRes>({
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

  getBanks() {
    return this.http.get<IBank[]>(this.baseUrl + 'api/Banks/Lookup');
  }

  getClients() {
    return this.http.get<IClientRes>(
      this.baseUrl + 'api/ReceiptVouchers/ClientsLookup'
    );
  }

  fetchReceiptVouchers() {
    this.http
      .get<IReceiptVoucherRes>(
        `${this.baseUrl}api/ReceiptVouchers?page=${this.activePage}`
      )
      .subscribe((data) => this.vouchersObject.next(data));
  }

  addVoucher(voucher: IReceiptVoucher) {
    return this.http
      .post<IReceiptVoucher>(this.baseUrl + 'api/ReceiptVouchers', voucher)
      .pipe(tap(() => this.fetchReceiptVouchers()));
  }

  editVoucher(voucher: IReceiptVoucher) {
    const { id, ...payload } = voucher;
    return this.http
      .put<IReceiptVoucher>(
        `${this.baseUrl}api/ReceiptVouchers/${voucher.id}`,
        payload
      )
      .pipe(tap(() => this.fetchReceiptVouchers()));
  }

  deleteVoucher(id: number) {
    return this.http
      .delete<IReceiptVoucherRes>(`${this.baseUrl}api/ReceiptVouchers/${id}`)
      .pipe(tap(() => this.fetchReceiptVouchers()));
  }

  searchVouchers(searchCriteria: IReceiptVoucherSearchCriteria) {
    return this.http
      .get<IReceiptVoucherRes>(`${this.baseUrl}api/ReceiptVouchers/Search`, {
        params: {
          fromDate: searchCriteria.fromDate || '',
          toDate: searchCriteria.toDate || '',
          clientId: searchCriteria.clientId || '',
          bankId: searchCriteria.bankId || '',
          description: searchCriteria.description || '',
          page: this.activePage,
        },
      })
      .pipe(tap((data) => this.vouchersObject.next(data)));
  }

  exportReceiptVouchers(searchCriteria: IReceiptVoucherSearchCriteria) {
    return this.http.get<IFileRes>(
      `${this.baseUrl}api/ReceiptVouchers/Export`,
      {
        params: {
          fromDate: searchCriteria.fromDate || '',
          toDate: searchCriteria.toDate || '',
          clientId: searchCriteria.clientId || '',
          bankId: searchCriteria.bankId || '',
          description: searchCriteria.description || '',
        },
      }
    );
  }
}
