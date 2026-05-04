export interface IDocumentLine {
  id: number;
  documentId: number;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxPercent: number;
  total: number;
  taxAmount: number;
  totalWithTaxAndDiscount: number;
}

export interface IDocument {
  id: number;
  displayNumber: string;
  documentType: number;
  documentDate: string;
  subject: string;
  introduction: string;
  clientName: string;
  userFullName: string;
  clientId: number;
  grandTotal: number;
  grandTotalTafqit: string;
  lines: IDocumentLine[];
}

export interface IDocumentSearchForm {
  documentType: number;
  clientId: number;
  search: string;
}

export interface IDocumentRes {
  items: IDocument[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface IDocumentType {
  value: number;
  label: string;
}
