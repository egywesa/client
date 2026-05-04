export interface IPrice {
  id: number,
  plan: string,
  invoice: number,
  priceMonthly: number,
  priceAnnual: number,
  createdAt: Date,
}

export interface IPriceEditOrCreate {
  id: number,
  planAr: string,
  planEn: string,
  invoice: number,
  priceMonthly: number,
  priceAnnual: number,
  createdAt: Date,
}
