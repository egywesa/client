export interface IJornalLine {
  id: number;
  accountId: number;
  accountCode: string;
  accountName: string;
  amount: number;
  description: string;
}

export interface IJournalEntry {
  id: number;
  entryDate: string;
  description: string;
  entryNumber: number;
  lines: IJornalLine[];
}

export interface IJournalEntrySearchCriteria {
  fromDate?: string;
  toDate?: string;
  accountId?: number;
  description?: string;
}

export interface IJournalEntryRes {
  page: number;
  pageSize: number;
  totalCount: number;
  data: IJournalEntry[];
}
