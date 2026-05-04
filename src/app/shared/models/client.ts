export interface IClient {
  id: number;
  name: string;
  administratorName: string;
  address: string;
  email: string;
  phone: string;
  tin: string;
  clientNum: string;
  qbId: number;
  qbUserId: number;
  xeroId: number;
  xeroUserId: number;
  companyId: number;
  companyName: string;
}

export interface IClientToShow {
  id: number;
  nameAr: string;
  nameEn: string;
  administratorNameAr: string;
  administratorNameEn: string;
  addressAr: string;
  addressEn: string;
  email: string;
  phone: string;
  tin: string;
  clientNum: string;
  qbId: number;
  qbUserId: number;
  xeroId: number;
  xeroUserId: number;
  companyId: number;
  companyNameAr: string;
  companyNameEn: string;
}

export interface IClientEditOrCreate {
  id: number;
  nameAr: string;
  nameEn: string;
  administratorNameAr: string;
  administratorNameEn: string;
  addressAr: string;
  addressEn: string;
  email: string;
  phone: string;
  tin: string;
  clientNum: string;
  companyId: number;
}

export interface IClientRes {
  totalCount: number;
  data: IClient[];
}
