export interface ITax {
  id: number,
  taxName: string,
  taxValue: number
}

export interface ITaxEditOrCreate {
  id: number,
  taxNameAr: string,
  taxNameEn: string,
  taxValue: number
}
