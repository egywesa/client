import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IChartOfAccount } from 'src/app/shared/models/accounts';
import { IFileRes, FileType } from 'src/app/shared/models/file';
import {
  IAccountStatementReportSearchCriteria,
  IAccountStatementRes,
  IBalanceSheetReportSearchCriteria,
  IBalanceSheetRes,
  IProfitAndLossReportSearchCriteria,
  IProfitAndLossRes,
} from 'src/app/shared/models/reports';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getAccounts() {
    return this.http.get<IChartOfAccount[]>(
      this.baseUrl + 'api/Reports/LookupAccount'
    );
  }

  searchProfitAndLoss(searchCriteria: IProfitAndLossReportSearchCriteria) {
    return this.http.get<IProfitAndLossRes>(
      `${this.baseUrl}api/Reports/ProfitAndLoss`,
      {
        params: {
          fromDate: searchCriteria.fromDate || '',
          toDate: searchCriteria.toDate || '',
        },
      }
    );
  }

  exportProfitAndLoss(
    searchCriteria: IProfitAndLossReportSearchCriteria,
    type: FileType
  ) {
    return this.http.get<IFileRes>(
      `${this.baseUrl}api/Reports/ProfitAndLoss${type}`,
      {
        params: {
          fromDate: searchCriteria.fromDate || '',
          toDate: searchCriteria.toDate || '',
        },
      }
    );
  }

  searchBalanceSheet(searchCriteria: IBalanceSheetReportSearchCriteria) {
    return this.http.get<IBalanceSheetRes>(
      `${this.baseUrl}api/Reports/BalanceSheet`,
      {
        params: {
          fromDate: searchCriteria.fromDate || '',
          toDate: searchCriteria.toDate || '',
        },
      }
    );
  }

  exportBalanceSheet(
    searchCriteria: IBalanceSheetReportSearchCriteria,
    type: FileType
  ) {
    return this.http.get<IFileRes>(
      `${this.baseUrl}api/Reports/BalanceSheet${type}`,
      {
        params: {
          fromDate: searchCriteria.fromDate || '',
          toDate: searchCriteria.toDate || '',
        },
      }
    );
  }

  searchAccountStatementReport(
    searchCriteria: IAccountStatementReportSearchCriteria
  ) {
    return this.http.get<IAccountStatementRes>(
      `${this.baseUrl}api/Reports/AccountStatement`,
      {
        params: {
          fromDate: searchCriteria.fromDate || '',
          toDate: searchCriteria.toDate || '',
          accountId: searchCriteria.accountId,
        },
      }
    );
  }

  exportAccountStatement(
    searchCriteria: IAccountStatementReportSearchCriteria,
    type: FileType
  ) {
    return this.http.get<IFileRes>(
      `${this.baseUrl}api/Reports/AccountStatement${type}`,
      {
        params: {
          fromDate: searchCriteria.fromDate || '',
          toDate: searchCriteria.toDate || '',
          accountId: searchCriteria.accountId || '',
        },
      }
    );
  }
}
