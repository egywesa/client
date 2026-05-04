export interface ICompany {
  // company
  id: number,
  companyName: string,
  companyAddress: string,
  activityId: number,
  activityName: string,
  commercialRegNumber: string,
  tin: string,
  vat: string,
  logo: string,
  signature: string,
  // user
  firstName: string,
  lastName: string,
  phoneNumber: string,
  email: string,
  password: string,

}

export interface ICompanyToShow {
  id: number,
  companyNameAr: string,
  companyNameEn: string,
  companyAddressAr: string,
  companyAddressEn: string,
  activityId: number,
  commercialRegNumber: string,
  tin: string,
  vat: string,
  logo: string,
  signature: string,
  phoneNumber: string,
  email: string,
  firstName: string,
  lastName: string,
  
}


export interface ICompanyEditOrCreate {
  id: number,
  companyNameAr: string,
  companyNameEn: string,
  companyAddressAr: string,
  companyAddressEn: string,
  activityId: number,
  commercialRegNumber: string,
  cityId: number,
  tin: string,
  vat: string,
  // user
  firstName: string,
  lastName: string,
  phoneNumber: string,
  email: string,
  password: string,
  
}
