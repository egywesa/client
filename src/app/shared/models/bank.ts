export interface IBank {
  id: number,
  bankName: string,
  bankAccountName: string,
  accountNumber: string,
  ibanNumber: string,
  swift: string,
  currency: string,
}

export interface IBankEditOrCreate {
  id: number,
  bankName: string,
  bankAccountName: string,
  accountNumber: string,
  ibanNumber: string,
  swift: string,
  currency: string,
}
