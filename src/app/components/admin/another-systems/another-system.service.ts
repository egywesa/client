import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {DataTable} from "../../../shared/models/dataTable";
import {retry} from "rxjs";
import * as QueryString from "querystring";

@Injectable({
  providedIn: 'root'
})
export class AnotherSystemService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  redirectToConnectPage(systemName: string) {
    return this.http.get(this.baseUrl + `api/anotherSystems/GetAuthorizationUrl?systemName=${systemName}`);
  }

  getAccessTokenAndRefreshToken(authorizationCode: string, systemName: string) {
    return this.http.get(this.baseUrl +
      `api/anotherSystems/GetAccessTokenAndRefreshToken/${authorizationCode}?systemName=${systemName}`);
  }

  getInvoices(accessToken: string, realmIdOrState: string, systemName: string) {
    console.log(realmIdOrState)
    return this.http.get(this.baseUrl +
      `api/anotherSystems/GetInvoices/${accessToken}?realmIdOrTenantId=${realmIdOrState}&systemName=${systemName}`);
  }

}
