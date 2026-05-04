import {IClient} from "./client";

export interface IPayment {
  id: number,
  startAt: Date,
  endAt: Date,
  amount: number,
  paidPrice: number,
  priceMonthly: number,
  invoicesLimit: number,
  currentInvoicesLimit: number,
  createdAt: Date,
}
export interface IPaymentOut {
  id: number,
  startAt: Date,
  endAt: Date,
  amount: number,
  paidPrice: number,
  priceMonthly: number,
  invoicesLimit: number,
  currentInvoicesLimit: number,
  createdAt: Date,
  pricePlan:string,
}
export interface IPaymentWithUser {
  id: number,
  startAt: Date,
  endAt: Date,
  amount: number,
  paidPrice: number,
  priceMonthly: number,
  invoicesLimit: number,
  currentInvoicesLimit: number,
  createdAt: Date,
  user: IClient
}
