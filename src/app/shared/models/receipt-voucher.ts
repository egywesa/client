export interface IReceiptVoucher {
  id: number;
  clientId: number;
  clientName: string;
  bankId: number;
  bankName: string;
  amount: number;
  date: string;
  description: string;
  tafqit: string;
}

export interface IReceiptVoucherRes {
  totalCount: number;
  pageSize: number;
  page: number;
  data: IReceiptVoucher[];
}

export interface IReceiptVoucherSearchCriteria {
  fromDate?: string;
  toDate?: string;
  clientId?: number;
  bankId?: number;
  description?: number;
}
