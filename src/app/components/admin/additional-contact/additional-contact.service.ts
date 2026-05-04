import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {IAdditionalContact, IAdditionalContactEditOrCreate} from "../../../shared/models/additional-contact";
import {DataTable} from "../../../shared/models/dataTable";
import {Invoice} from "../../../shared/models/invoice";
import {retry} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AdditionalContactService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getAdditionalContacts(values: any) {
    const formData = new FormData();

    formData.append('length', values.length);
    formData.append('start', values.start);

    let headers = new HttpHeaders();

    headers.append('Content-Type', 'application/json; charset=utf-8');

    return this.http.post<DataTable<IAdditionalContact>>(this.baseUrl +
      'api/AdditionalContacts/GetAdditionalContacts?language='+localStorage.getItem('language'), formData, {headers: headers})
      .pipe(
        retry(1)
      ).toPromise();
  }

  getAdditionalContactLookups() {
    return this.http.get<IAdditionalContact[]>(this.baseUrl + 'api/AdditionalContacts/Lookup');
  }

  getAdditionalContact(id: number) {
    return this.http.get<IAdditionalContactEditOrCreate>(this.baseUrl + 'api/AdditionalContacts/'+id);
  }

  addNew(values: any) {
    return this.http.post(this.baseUrl + 'api/AdditionalContacts', values);
  }

  edit(id: number, values: any) {
    return this.http.put(this.baseUrl + 'api/AdditionalContacts/'+id, values);
  }

  remove(id: number) {
    return this.http.delete(this.baseUrl + 'api/AdditionalContacts/'+id);
  }

}
