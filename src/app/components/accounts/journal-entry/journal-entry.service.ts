import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  IJournalEntry,
  IJournalEntryRes,
  IJournalEntrySearchCriteria,
} from 'src/app/shared/models/journal';
import { BehaviorSubject, tap } from 'rxjs';
import { IFileRes } from 'src/app/shared/models/file';
import { IChartOfAccount } from 'src/app/shared/models/accounts';

@Injectable({
  providedIn: 'root',
})
export class JournalEntryService {
  baseUrl = environment.baseUrl;
  journalEntriesObject = new BehaviorSubject<IJournalEntryRes>({
    data: [],
    totalCount: 0,
    page: 1,
    pageSize: 20,
  });
  journalEntries$ = this.journalEntriesObject.asObservable();
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

  fetchJournalEntries() {
    this.http
      .get<IJournalEntryRes>(
        `${this.baseUrl}api/JournalEntry?page=${this.activePage}`
      )
      .subscribe((res) => this.journalEntriesObject.next(res));
  }

  addEntry(entry: IJournalEntry) {
    return this.http
      .post<IJournalEntry>(this.baseUrl + 'api/JournalEntry', entry)
      .pipe(tap(() => this.fetchJournalEntries()));
  }

  editEntry(entry: IJournalEntry) {
    const { id, ...payload } = entry;
    return this.http
      .put<IJournalEntry>(
        `${this.baseUrl}api/JournalEntry/${entry.id}`,
        payload
      )
      .pipe(tap(() => this.fetchJournalEntries()));
  }

  deleteEntry(id: number) {
    return this.http
      .delete<IJournalEntry>(`${this.baseUrl}api/JournalEntry/${id}`)
      .pipe(tap(() => this.fetchJournalEntries()));
  }

  searchEntry(searchCriteria: IJournalEntrySearchCriteria) {
    return this.http
      .get<IJournalEntryRes>(`${this.baseUrl}api/JournalEntry/Search`, {
        params: {
          fromDate: searchCriteria.fromDate || '',
          toDate: searchCriteria.toDate || '',
          accountId: searchCriteria.accountId || '',
          page: this.activePage,
        },
      })
      .pipe(tap((data) => this.journalEntriesObject.next(data)));
  }

  exportJournalEntries(searchCriteria: IJournalEntrySearchCriteria) {
    return this.http.get<IFileRes>(`${this.baseUrl}api/JournalEntry/Export`, {
      params: {
        fromDate: searchCriteria.fromDate || '',
        toDate: searchCriteria.toDate || '',
        accountId: searchCriteria.accountId || '',
      },
    });
  }
}
