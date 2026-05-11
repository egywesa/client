import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {IClient, IClientEditOrCreate} from "../../../shared/models/client";
import {DataTable} from "../../../shared/models/dataTable";
import {Invoice} from "../../../shared/models/invoice";
import {retry} from "rxjs";
import {map} from "rxjs/operators";
import {IAdditionalContact} from "../../../shared/models/additional-contact";

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }



  getClients(values: any): Promise<DataTable<IClient>> {
    const formData = new FormData();

    formData.append('length', values.length);
    formData.append('start', values.start);
    if(values.searchAdministratorName){
      formData.append('searchAdministratorName', values.searchAdministratorName);

    }
    if(values.searchedName){
      formData.append('searchedName', values.searchedName);

    }
    if(values.searchPhone){
      formData.append('searchPhone', values.searchPhone);

    }
    if(values.searchEmail){
      formData.append('searchEmail', values.searchEmail);

    }
    // if(values.searchEmail){
    //   formData.append('searchEmail', values.searchEmail);

    // }
    if (values.searchedDate1) {
      formData.append('searchedDate1', values.searchedDate1);
    }
    if (values.searchEnum) {
      formData.append('searchEnum', values.searchEnum);
    }
    if (values.searchedDate2) {
      formData.append('searchedDate2', values.searchedDate2);
    }
    let headers = new HttpHeaders();

    headers.append('Content-Type', 'application/json; charset=utf-8');

    return this.http.post<DataTable<IClient>>(this.baseUrl +
      'api/Clients/GetClients?language='+localStorage.getItem('language'), formData, {headers: headers})
      .pipe(
        retry(1)
      ).toPromise();
  }

  getClientLookups() {
    return this.http.get<IClient[]>(this.baseUrl + 'api/Clients/Lookup');
  }

  getClient(id: number) {
    return this.http.get<any>(this.baseUrl + 'api/Clients/'+id).pipe(
      map((client: any) => ({
        ...client,
        nameAr: client.nameAr ?? client.name ?? null,
        nameEn: client.nameEn ?? client.name ?? null,
        administratorNameAr: client.administratorNameAr ?? client.administratorName ?? null,
        administratorNameEn: client.administratorNameEn ?? client.administratorName ?? null,
        addressAr: client.addressAr ?? client.address ?? null,
        addressEn: client.addressEn ?? client.address ?? null,
        countryId: client.countryId ?? client.countryID ?? null,
        cityId: client.cityId ?? client.cityID ?? null,
        countrySubentity: client.countrySubentity ?? client.countrySubEntity ?? null,
        plotIdentification: client.plotIdentification ?? null,
        postalZone: client.postalZone ?? null,
        streetName: client.streetName ?? null,
        citySubdivisionName: client.citySubdivisionName ?? null,
      }))
    );
  }

  addNew(values: any) {
    return this.http.post<any>(this.baseUrl + 'api/Clients', values);
  }

  edit(id: number, values: any) {
    return this.http.put(this.baseUrl + 'api/Clients/'+id, values);
  }

  remove(id: number) {
    return this.http.delete(this.baseUrl + 'api/Clients/'+id);
  }

  exportclient(invoicesIds: number[]) {
    return this.http.post(this.baseUrl + `api/Clients/ExportInvoices`, invoicesIds);
  }

  ClientSerchdate(d1: any,d2:any): Promise<DataTable<IClient>> {
    const formData = new FormData();
      formData.append('d1',d1);
      formData.append('d2', d2);

    let headers = new HttpHeaders();

    headers.append('Content-Type', 'application/json; charset=utf-8');

    return this.http.post<DataTable<IClient>>(this.baseUrl +
      'api/Clients/ExportClients?language='+localStorage.getItem('language'), formData, {headers: headers})
      .pipe(
        retry(1)
      ).toPromise();
  }
}
