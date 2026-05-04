import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { IChartOfAccount } from 'src/app/shared/models/accounts';
import {
  IManualEntry,
  IManualEntryRes,
  IManualEntrySearchCriteria,
} from 'src/app/shared/models/manual-entry';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ManualEntryService {
  baseUrl = environment.baseUrl;
  maunalEntryObject = new BehaviorSubject<IManualEntryRes>({
    data: [],
    totalCount: 0,
    page: 1,
    pageSize: 20,
  });
  manualEntry$ = this.maunalEntryObject.asObservable();
  activePage: number = 1;

  constructor(private http: HttpClient) {}

  setActivePage(page: number) {
    this.activePage = page;
  }

  getAccounts() {
    return this.http.get<IChartOfAccount[]>(
      this.baseUrl + 'api/ChartOfAccount/LookupAccount'
    );
  }

  fetchManualEntry() {
    this.http
      .get<IManualEntryRes>(
        `${this.baseUrl}api/ManualBalanceEntries?page=${this.activePage}`
      )
      .subscribe((data) => this.maunalEntryObject.next(data));
  }

  addEntry(entry: IManualEntry) {
    return this.http
      .post<IManualEntry>(
        this.baseUrl + 'api/ManualBalanceEntries/Create',
        entry
      )
      .pipe(tap(() => this.fetchManualEntry()));
  }

  editEntry(entry: IManualEntry) {
    const { id, ...payload } = entry;
    return this.http
      .put<IManualEntry>(
        `${this.baseUrl}api/ManualBalanceEntries/Update/${entry.id}`,
        payload
      )
      .pipe(tap(() => this.fetchManualEntry()));
  }

  deleteEntry(id: number) {
    return this.http
      .delete<IManualEntryRes>(`${this.baseUrl}api/ManualBalanceEntries/${id}`)
      .pipe(tap(() => this.fetchManualEntry()));
  }

  searchEntry(searchCriteria: IManualEntrySearchCriteria) {
    return this.http
      .get<IManualEntryRes>(`${this.baseUrl}api/ManualBalanceEntries/Search`, {
        params: {
          fromDate: searchCriteria.fromDate || '',
          toDate: searchCriteria.toDate || '',
          accountId: searchCriteria.accountId || '',
          page: this.activePage,
        },
      })
      .pipe(tap((data) => this.maunalEntryObject.next(data)));
  }
}
