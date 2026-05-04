import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { ICompany, ICompanyEditOrCreate } from "../../../shared/models/company";
import { DataTable } from "../../../shared/models/dataTable";
import { retry } from "rxjs";
import { Invoice } from 'src/app/shared/models/invoice';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) { }

  getCompanies(values: any) {
    const formData = new FormData();

    formData.append('length', values.length);
    formData.append('start', values.start);
    formData.append('search[value]', values.search['value']);

    if (values.searchedCompanyName) {
      formData.append('searchedCompanyName', values.searchedCompanyName);
    }

    if (values.searchEmail) {
      formData.append('searchEmail', values.searchEmail);
    }

    if (values.searchPhoneNumber) {
      formData.append('searchPhoneNumber', values.searchPhoneNumber);
    }
    if (values.searchVat) {
      formData.append('searchVat', values.searchVat);
    }

    if (values.searchId) {
      formData.append('searchId', values.searchId);
    }

    let headers = new HttpHeaders();

    headers.append('Content-Type', 'application/json; charset=utf-8');

    return this.http.post<DataTable<ICompany>>(this.baseUrl +
      'api/companies/GetCompanies?language=' + localStorage.getItem('language'), formData, { headers: headers })
      .pipe(
        retry(1)
      ).toPromise();
  }
  getCompanys() {
    return this.http.get<ICompanyEditOrCreate>(this.baseUrl + 'api/companies/GetCompanies?language=' + localStorage.getItem('language'));
  }
  getCompanysgridtable() {
    return this.http.get<ICompanyEditOrCreate>(this.baseUrl + 'api/companies/KendoGetCompanies?language=' + localStorage.getItem('language'));
  }
  getCompany(id: number) {
    return this.http.get<ICompanyEditOrCreate>(this.baseUrl + 'api/Companies/' + id);
  }
  getCompanyReport(id: number) {
    return this.http.get<ICompanyEditOrCreate>(this.baseUrl + 'api/CompanyReport/' + id);
  }

  getCompanypayments(values: any, id: number) {
    const formData = new FormData();

    formData.append('length', values.length);
    formData.append('start', values.start);
    let headers = new HttpHeaders();

    headers.append('Content-Type', 'application/json; charset=utf-8');

    return this.http.post<DataTable<ICompany>>(this.baseUrl +
      `api/CompanyReport/GetCompanyPayments?language=${localStorage.getItem('language')}&CompanyId=${id}`, formData, { headers: headers })
      .pipe(
        retry(1)
      ).toPromise();
  }

  getCompanysZata() {
    return this.http.get<ICompanyEditOrCreate>(this.baseUrl + 'api/companies/GetCompanyZatac?language=' + localStorage.getItem('language'));
  }
  // getCompanyInvoices(id: number) {
  //   return this.http.get<ICompanyEditOrCreate>(this.baseUrl + `api/CompanyReport/GetCompanyInvoices?CompanyId=${id}`)
  //   .pipe(
  //     retry(1)
  //   ).toPromise();
  // }
  getCompanyInvoices(values: any, id: any): Promise<DataTable<Invoice>> {
    const formData = new FormData();

    formData.append('length', values.length);
    formData.append('start', values.start);
    formData.append('search[value]', values.search['value']);
    formData.append('order[0][dir]', values.order[0]['dir']);

    if (values.searchId) {
      formData.append('searchId', values.searchId);
    }

    if (values.searchClientId) {
      formData.append('searchClientId', values.searchClientId);
    }

    if (values.searchInvoiceType) {
      formData.append('searchInvoiceType', values.searchInvoiceType);
    }
    if (values.searchInvoiceFatora) {
      formData.append('searchInvoiceFatora', values.searchInvoiceFatora);
    }

    if (values.searchedDate1) {
      formData.append('searchedDate1', values.searchedDate1);
    }

    if (values.searchedDate2) {
      formData.append('searchedDate2', values.searchedDate2);
    }

    if (values.searchShortOrLong) {
      formData.append('searchShortOrLong', values.searchShortOrLong);
    }

    if (values.searchTotal) {
      formData.append('searchTotal', values.searchTotal);
    }



    let headers = new HttpHeaders();

    headers.append('Content-Type', 'application/json; charset=utf-8');

    return this.http.post<DataTable<Invoice>>(this.baseUrl + `api/CompanyReport/GetCompanyInvoices?CompanyId=${id}`, formData, { headers: headers })
      .pipe(
        retry(1)
      ).toPromise();
  }

  addNew(values: any) {
    const formData = new FormData();

    formData.append('companyNameAr', values.companyNameAr);
    formData.append('companyNameEn', values.companyNameEn);
    formData.append('companyAddressAr', values.companyAddressAr);
    formData.append('companyAddressEn', values.companyAddressEn);
    formData.append('activityId', values.activityId);
    formData.append('cityId', values.cityId);
    formData.append('commercialRegNumber', values.commercialRegNumber);
    formData.append('tin', values.tin);
    formData.append('vat', values.vat);
    formData.append('firstName', values.firstName);
    formData.append('lastName', values.lastName);
    formData.append('phoneNumber', values.phoneNumber);
    formData.append('email', values.email);
   // formData.append('BuildingNumber', values.buildingNumber);
   // formData.append('CitySubdivisionName', values.citySubdivisionName);
    formData.append('Country', values.country);
    formData.append('CountrySubentity', values.countrySubentity);
    //formData.append('PlotIdentification', values.plotIdentification);
   // formData.append('PostalZone', values.postalZone);
    //formData.append('StreetName', values.streetName);
    formData.append('password', values.password);
    formData.append("allowEditDate", values.allowEditDate)
    formData.append("allowZatac", values.allowZatac)
    formData.append("allowZatkaForm", values.allowZatacForm)
    formData.append("logo", values.logoSource, values.logoSource.name);

    let headers = new HttpHeaders();

    headers.append('Content-Type', 'multipart/form-data');

    return this.http.post(this.baseUrl + 'api/Companies', formData, { headers: headers });
  }

  edit(id: number, values: any) {
    const formData = new FormData();

    formData.append('id', values.id);
    formData.append('companyNameAr', values.companyNameAr);
    formData.append('companyNameEn', values.companyNameEn);
    formData.append('companyAddressAr', values.companyAddressAr);
    formData.append('companyAddressEn', values.companyAddressEn);
    formData.append('activityId', values.activityId);
    formData.append('commercialRegNumber', values.commercialRegNumber);
    formData.append('tin', values.tin);
    formData.append('vat', values.vat);
    formData.append('firstName', values.firstName);
    formData.append('lastName', values.lastName);
    formData.append('phoneNumber', values.phoneNumber);
    formData.append('email', values.email);
    formData.append('cityId', values.cityId);
    formData.append('BuildingNumber', values.buildingNumber);
    formData.append('CitySubdivisionName', values.citySubdivisionName);
    formData.append('Country', values.country);
    formData.append('CountrySubentity', values.countrySubentity);
    formData.append('PlotIdentification', values.plotIdentification);
    formData.append('PostalZone', values.postalZone);
    formData.append('StreetName', values.streetName);
    formData.append('password', values.password);
    formData.append("allowZatacForm", values.allowZatacForm)
    formData.append("allowZatac", values.allowZatac)
    formData.append("allowEditDate", values.allowEditDate)
    if (values.logo != null) {
      formData.append("logo", values.logoSource, values.logoSource.name);
    }

    let headers = new HttpHeaders();

    headers.append('Content-Type', 'multipart/form-data');

    return this.http.put(this.baseUrl + 'api/Companies/' + id, formData, { headers: headers });
  }

  remove(id: number) {
    return this.http.delete(this.baseUrl + 'api/Companies/' + id);
  }
  newsubscrip(id: number, isyearly: boolean, companyid: number) {
    let data = {
      planID: id,
      isYearly: isyearly,
      companyID: companyid
    }

    let headers = new HttpHeaders();



    return this.http.post(this.baseUrl + `api/payment/PostPaymentMaunal`, data, { headers: headers });
  }
  getInvoicesStatics(id: number) {
    return this.http.get(this.baseUrl + 'api/CompanyReport/GetInvoicesStatics?id=' + id);
  }

  getCompaniesreports(values: any) {
    const formData = new FormData();

    formData.append('length', values.length);
    formData.append('start', values.start);

    if (values.StaicsType) {
      formData.append('StaicsType', values.StaicsType);
    }


    let headers = new HttpHeaders();

    headers.append('Content-Type', 'application/json; charset=utf-8');

    return this.http.post<DataTable<ICompany>>(this.baseUrl +
      'api/CompanyReport/GetPaymentsStatics?language=' + localStorage.getItem('language'), formData, { headers: headers })
      .pipe(
        retry(1)
      ).toPromise();
  }

  getCompaniesreportsexport(values: any) {
    const formData = new FormData();
    formData.append('length', values.skip);
    formData.append('start', values.pagesize);
    if (values.staictype) {
      formData.append('StaicsType', values.staictype);
    }
    let headers = new HttpHeaders();

    headers.append('Content-Type', 'application/json; charset=utf-8');

    return this.http.post<DataTable<ICompany>>(this.baseUrl +
      'api/CompanyReport/GetPaymentsStatics?language=' + localStorage.getItem('language'), formData, { headers: headers })
      .pipe(
        retry(1)
      ).toPromise();
  }
  exportcompanyreport(companyIds: number[]) {
    return this.http.post(this.baseUrl + `api/CompanyReport/ExportCompanies`, companyIds);
  }
}
