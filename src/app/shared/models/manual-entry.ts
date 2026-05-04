export interface IManualEntry {
  id: number;
  entryDate: string;
  accountId: number;
  amount: number;
}

export interface IManualEntryRes {
  totalCount: number;
  pageSize: number;
  page: number;
  data: IManualEntry[];
}

export interface IManualEntrySearchCriteria {
  fromDate?: string;
  toDate?: string;
  accountId?: number;
}
