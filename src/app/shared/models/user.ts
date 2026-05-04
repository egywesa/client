import { ICompany, ICompanyToShow } from './company';

export interface IUserResponse {
  email: string;
  expiresOn: Date;
  isAuthenticated: boolean;
  roles: string[];
  token: string;
  username: string;
  refreshToken: string;
  refreshTokenExpiration: Date;
  firstName: string;
  lastName: string;
}

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  company: ICompanyToShow;
}

export interface IProfile {
  allowZatacForm: any;
  firstName: string;
  lastName: string;
  email: string;
  companyNameAr: string;
  companyNameEn: string;
  companyAddressAr: string;
  companyAddressEn: string;
  phoneNumber: string;
  commercialRegNumber: string;
  tin: string;
  vat: string;
  invoiceLast: number;
  // bankName: string,
  // bankAccountName: string,
  // accountNumber: string,
  // ibanNumber: string,
  // swift: string,
  // currency: string,
  logoLink: string;
  signatureLink: string;
  haveInvoices: boolean;
}
