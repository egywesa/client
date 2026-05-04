import { Injectable } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  loadStatistics() {
    return this.http.get(`${this.baseUrl}api/home`);
  }

}
