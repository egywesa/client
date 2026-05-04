import {IUser} from "./user";
import {IBank} from "./bank";
import {ITax} from "./tax";
import {IClient, IClientToShow} from "./client";
import {IBranch} from "./branch";
import {IAdditionalContact, IAdditionalContactToShow} from "./additional-contact";


export interface ExportInvoicesRequest {
  invoicesIds: number[];
  n: number;
  d1?: string;
  d2?: string;
}
export interface IInvoice {
  id: number,
  language: string,
  invoiceType: InvoiceType,
  shortOrLong: ShortOrLong,
  clientId: number,
  date: Date,
  dateOfSupply: Date,
  notes: string,
  discount: number,
  discountType: DiscountType,
  taxId: number,
  total: number,
  branchId: number,
  bankId: number,
  additionalContactId: number,
  hasPendingMoney: boolean,
  pendingMoney: number,
  pendingMoneyType: PendingMoneyType,
  calculatePendingMoneyAfterTax: boolean,
  invoiceItems: InvoiceItem[],
  user: IUser,
  bank: IBank,
  tax: ITax,
  client: IClientToShow,
  branch: IBranch,
  additionalContact: IAdditionalContactToShow,
  invoiceNum: string,
  isDraft: boolean,
  invoiceNotification: InvoiceNotification,
  zatcaVerified : boolean,
  hasInvoiceNotifications : boolean,
  googleGenerateQrCode:string;
}

export class Invoice implements IInvoice {
  id: number;
  language: string;
  invoiceType: InvoiceType;
  poNumberNum:PoNumberNum;
  shortOrLong: ShortOrLong;
  clientId: number;
  date: Date;
  dateOfSupply: Date;
  notes: string;
  discount: number;
  PoNumber:string;
  discountType: DiscountType;
  taxId: number;
  total: number;
  branchId: number;
  bankId: number;
  additionalContactId: number;
  hasPendingMoney: boolean;
  pendingMoney: number;
  pendingMoneyType: PendingMoneyType;
  calculatePendingMoneyAfterTax: boolean;
  invoiceItems: InvoiceItem[];
  user: IUser;
  bank: IBank;
  tax: ITax;
  client: IClientToShow;
  branch: IBranch;
  additionalContact: IAdditionalContactToShow;
  invoiceNum: string;
  isDraft: boolean;
 
  invoiceNotification: InvoiceNotification;
  zatcaVerified : boolean;
  hasInvoiceNotifications : boolean;
  googleGenerateQrCode:string;
  zatcainvoicetypes: ZATCAInvoiceType;
  zatcaPaymentMethods: ZATCAPaymentMethod;
}

export interface IInvoiceEditOrCreate {
  id: number,
  language: string,
  invoiceType: InvoiceType,
  shortOrLong: ShortOrLong,
  clientId: number,
  date: Date,
  dateOfSupply: Date,
  notes: string,
  discount: number,

  discountType: DiscountType,
  taxId: number,
  total: number,
  branchId: number,
  bankId: number,
  additionalContactId: number,
  hasPendingMoney: boolean,
  pendingMoney: number,
  pendingMoneyType: PendingMoneyType,
  calculatePendingMoneyAfterTax: boolean,
  invoiceItems: InvoiceItem[]
}

export interface InvoiceItem {
  productDescription: string,
  productNum: string,
  quantity: number,
  unitPrice: number,
  discountValue: number,
  discountType: DiscountType,
  taxId: number,
  tax: ITax
}

export interface InvoiceNotificationItem {
  productDescription: string,
  productNum: string,
  quantity: number,
  unitPrice: number,
  discountValue: number,
  discountType: DiscountType,
  taxId: number,
  tax: ITax
}

export class Item implements InvoiceItem {
  productDescription: string;
  productNum: string;
  quantity: number;
  unitPrice: number;
  discountValue: number = 0;
  discountType: DiscountType = 0;
  taxId: number = 1;
  tax: ITax;
}

export interface IInvoiceNotification {
  id: number,
  invoiceID: number,
  date: Date,
  dateOfSupply: Date,
  acountantInvoiceType: AccountantInvoiceType,
  remarks: string,
  language: string;
  invoiceType: InvoiceType;
  shortOrLong: ShortOrLong;
  notes: string;
  discount: number;
  discountType: DiscountType;
  taxId: number;
  zatcaVerified:boolean;
  total: number;
  branchId: number;
  bankId: number;
  additionalContactId: number;
  hasPendingMoney: boolean;
  pendingMoney: number;
  pendingMoneyType: PendingMoneyType;
  calculatePendingMoneyAfterTax: boolean;
  invoiceNotificationItems: InvoiceNotificationItem[];
  user: IUser;
  bank: IBank;
  tax: ITax;
  branch: IBranch;
  additionalContact: IAdditionalContactToShow;
  invoiceNum: string;
  isDraft: boolean;
  googleGenerateQrCode:string;

}

export class InvoiceNotification implements IInvoiceNotification {
  id: number;
  invoiceID: number;
  date: Date;
  dateOfSupply: Date;
  acountantInvoiceType: AccountantInvoiceType;
  remarks: string;
  language: string;

  invoiceType: InvoiceType;
  poNumberNum:PoNumberNum;
  shortOrLong: ShortOrLong;
  notes: string;
  zatcaVerified:boolean;
  discount: number;
  discountType: DiscountType;
  taxId: number;
  total: number;
  branchId: number;
  bankId: number;
  additionalContactId: number;
  hasPendingMoney: boolean;
  pendingMoney: number;
  pendingMoneyType: PendingMoneyType;
  calculatePendingMoneyAfterTax: boolean;
  invoiceNotificationItems: InvoiceNotificationItem[];
  user: IUser;
  bank: IBank;
  tax: ITax;
  branch: IBranch;
  additionalContact: IAdditionalContactToShow;
  invoiceNum: string;
  isDraft: boolean;
  googleGenerateQrCode:string;
  zatcaPaymentMethods:ZATCAPaymentMethod;
}

export interface QrCodeResponse {
  QrCode: string;
}

export enum AccountantInvoiceType
{
  CreditNote = 1,
  DebitNote = 2
}

export enum InvoiceType
{
  Invoice = 1,
  SimpleInvoice = 2
}
export enum PoNumberNum
{
    poNumber=0,
    financialclaims=1,
    other =2,
    
}
export enum ShortOrLong
{
  Short = 0,
  Long = 1
}

export enum DiscountType
{
  Static = 0,
  Percentage = 1
}

export enum PendingMoneyType
{
  Static = 0,
  Percentage = 1
}

export enum ZATCAPaymentMethod
{
  CASH = 10,
  CREDIT = 30,
  BANK_ACCOUNT = 42,
  BANK_CARD = 48,
}
export enum ZATCAInvoiceType
{
  INVOICE = 388,
  DEBIT_NOTE = 383,
  CREDIT_NOTE = 381,
}
