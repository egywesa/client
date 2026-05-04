import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {IBank, IBankEditOrCreate} from "../../../shared/models/bank";
import {IBranch} from "../../../shared/models/branch";
import {DataTable} from "../../../shared/models/dataTable";
import {retry} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BankService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getBanks(values: any) {
    const formData = new FormData();

    formData.append('length', values.length);
    formData.append('start', values.start);

    let headers = new HttpHeaders();

    headers.append('Content-Type', 'application/json; charset=utf-8');

    return this.http.post<DataTable<IBank>>(this.baseUrl +
      'api/Banks/GetBanks?language='+localStorage.getItem('language'), formData, {headers: headers})
      .pipe(
        retry(1)
      ).toPromise();
  }

  getBankLookups() {
    return this.http.get<IBank[]>(this.baseUrl + 'api/Banks/Lookup');
  }

  getBank(id: number) {
    return this.http.get<IBankEditOrCreate>(this.baseUrl + 'api/Banks/'+id);
  }

  addNew(values: any) {
    return this.http.post(this.baseUrl + 'api/Banks', values);
  }

  edit(id: number, values: any) {
    return this.http.put(this.baseUrl + 'api/Banks/'+id, values);
  }

  remove(id: number) {
    return this.http.delete(this.baseUrl + 'api/Banks/'+id);
  }

}
