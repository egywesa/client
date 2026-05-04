export interface IPaymentVoucher {
  id: number;
  supplierId: number;
  supplierName: string;
  bankId: number;
  bankName: string;
  amount: number;
  date: string;
  description: string;
  tafqit: string;
}

export interface IPaymentVoucherRes {
  totalCount: number;
  pageSize: number;
  page: number;
  data: IPaymentVoucher[];
}

export interface IPaymentVoucherSearchCriteria {
  fromDate?: string;
  toDate?: string;
  supplierId?: number;
  bankId?: number;
  description?: number;
}
