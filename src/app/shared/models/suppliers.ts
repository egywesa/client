export interface ISupplier {
  id: number;
  name: string;
  accountId: number;
  code: string;
  contactName: string;
  phone: string;
  email: string;
  address: string;
}

export interface ISuppliersSearchCriteria {
  name?: string;
  contactName?: string;
  phone?: string;
  address?: string;
}

export interface ISuppliersRes {
  totalCount: number;
  pageSize: number;
  page: number;
  data: ISupplier[];
}
