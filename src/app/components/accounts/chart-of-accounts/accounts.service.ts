import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IChartOfAccount } from 'src/app/shared/models/accounts';

@Injectable({
  providedIn: 'root',
})
export class AccountsService {
  baseUrl = environment.baseUrl;
  private accountsSubject = new BehaviorSubject<IChartOfAccount[]>([]);
  accounts$ = this.accountsSubject.asObservable();

  constructor(private http: HttpClient) {}

  fetchAccounts() {
    return this.http
      .get<IChartOfAccount[]>(this.baseUrl + 'api/ChartOfAccount/hierarchy')
      .subscribe({
        next: (data) => this.accountsSubject.next(data),
      });
  }

  addAccount(account: IChartOfAccount) {
    const { name, openingBalance, currentBalance, type, parentId } = account;
    const payload = { name, openingBalance, currentBalance, type, parentId };

    return this.http
      .post<IChartOfAccount>(this.baseUrl + 'api/ChartOfAccount', payload)
      .pipe(tap(() => this.fetchAccounts()));
  }

  updateAccount(account: IChartOfAccount) {
    const { name, openingBalance, currentBalance, type, parentId } = account;
    const payload = { name, openingBalance, currentBalance, type, parentId };
    return this.http
      .put<IChartOfAccount>(
        `${this.baseUrl}api/ChartOfAccount/${account.id}`,
        payload
      )
      .pipe(tap(() => this.fetchAccounts()));
  }

  deleteAccount(id: number) {
    return this.http
      .delete(`${this.baseUrl}api/ChartOfAccount/${id}`)
      .pipe(tap(() => this.fetchAccounts()));
  }
}
