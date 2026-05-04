import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { retry } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ZatcaEnteryListService {
  baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) { }

  GetZatacEnteryList(values: any) {
    const formData = new FormData();

    formData.append('length', values.length);
    formData.append('start', values.start);

    let headers = new HttpHeaders();

    headers.append('Content-Type', 'application/json; charset=utf-8');

    return this.http.post(this.baseUrl + `api/SandBoxApi/GetZatacEnteryHistory`, formData, {headers: headers}).pipe(
      retry(1)
    ).toPromise();;

  }
}
