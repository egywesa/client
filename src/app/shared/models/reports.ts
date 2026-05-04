export interface IProfitAndLossReportSearchCriteria {
  fromDate?: string;
  toDate?: string;
}

export interface IBalanceSheetReportSearchCriteria {
  fromDate?: string;
  toDate?: string;
}

export interface IAccountStatementReportSearchCriteria {
  fromDate?: string;
  toDate?: string;
  accountId: number;
}

export interface IProfitAndLossAccount {
  account: string;
  total: number;
}

export interface IProfitAndLossRes {
  from: string;
  to: string;
  revenues: IProfitAndLossAccount[];
  expenses: IProfitAndLossAccount[];
  totalRevenue: number;
  totalExpense: number;
  netProfit: number;
}

export interface IBalanceAccount {
  name: string;
  openingBalance: number;
  periodTotal: number;
  finalBalance: number;
}

export interface IBalanceGroup {
  group: string;
  accounts: IBalanceAccount[];
  total: number;
}

export interface IBalanceSheetRes {
  from: string;
  to: string;
  groups: IBalanceGroup[];
  totalAssets: number;
  totalLiabilities: number;
  netPosition: number;
}

interface Transaction {
  date: string;
  journalEntryId: number;
  description: string;
  amount: number;
  balanceAfter?: number;
}

interface GroupItem {
  accountId: number;
  accountName: string;
  total: number;
  manualBalance: number;
  transactions: Transaction[];
}

interface Totals {
  periodTotal: number;
  manualBalance: number;
}

export interface IAccountStatementRes {
  mode: 'Grouped' | 'Detailed';
  account: string;
  from: string;
  to: string;
  openingBalance: number;
  transactions?: Transaction[];
  grouped?: GroupItem[];
  totals: Totals;
  finalBalance: number;
}
