import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ZatacSettingService {
  baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) { }

  zatacSetting(branchId:number,NewOtp:string,IntegrationType:number) {
    return this.http.get<any>(this.baseUrl + `api/SandBoxApi/GenerateCsr?branchID=${branchId}&NewOtp=${NewOtp}&IntegrationType=${IntegrationType}`);

  }
}
