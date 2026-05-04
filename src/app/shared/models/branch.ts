export interface IBranch {
  branchId: number;
  branchName: string;
  address: string;
  companyId: number;
  companyName: string;
  streetName: string;
  buildingNumber: string;
  plotIdentification: string;
  citySubdivisionName: string;
  cityName: string;
 
  postalZone: string;
  countrySubentity: string;
  country: string;
  commercialRegNumber:string;
}
export interface IBranchEditOrCreate {
  branchId: number,
  branchName: string,
  address: string,
}

