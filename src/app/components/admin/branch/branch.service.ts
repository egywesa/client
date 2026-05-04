import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {IBranch, IBranchEditOrCreate} from "../../../shared/models/branch";
import {DataTable} from "../../../shared/models/dataTable";
import {IClient} from "../../../shared/models/client";
import {retry} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BranchService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getBranches(values: any) {
    const formData = new FormData();

    formData.append('length', values.length);
    formData.append('start', values.start);

    let headers = new HttpHeaders();

    headers.append('Content-Type', 'application/json; charset=utf-8');

    return this.http.post<DataTable<IBranch>>(this.baseUrl +
      'api/Branches/GetBranches?language='+localStorage.getItem('language'), formData, {headers: headers})
      .pipe(
        retry(1)
      ).toPromise();
  }

  getBranchLookups(companyId: number) {
    return this.http.get<IBranch[]>(this.baseUrl + 'api/Branches/Lookup?companyId=' + companyId + '&language=' + localStorage.getItem('language'));
  }
  getBranchsLookups(companyId: number) {
    return this.http.get<IBranch[]>(this.baseUrl + 'api/Branches/Lookups?companyId=' + companyId + '&language=' + localStorage.getItem('language'));
  }
  getBranch(id: number) {
    return this.http.get<IBranchEditOrCreate>(this.baseUrl + 'api/Branches/'+id);
  }

  addNew(values: any) {
    return this.http.post(this.baseUrl + 'api/Branches', values);
  }

  edit(id: number, values: any) {
    return this.http.put(this.baseUrl + 'api/Branches/'+id, values);
  }

  remove(id: number) {
    return this.http.delete(this.baseUrl + 'api/Branches/'+id);
  }
getBranchZatac(lang:string)
{
  return this.http.post<DataTable<IBranch>>(this.baseUrl +
    'api/Branches/GetBranches?language='+localStorage.getItem('language'),lang)
}
}
