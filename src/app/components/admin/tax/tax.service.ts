import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {ITax, ITaxEditOrCreate} from "../../../shared/models/tax";

@Injectable({
  providedIn: 'root'
})
export class TaxService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getTaxes() {
    return this.http.get<ITax[]>(this.baseUrl + 'api/Taxis?/language='+localStorage.getItem('language'));
  }
  getAllTaxes() {
    return this.http.get<ITax[]>(this.baseUrl + 'api/Taxis/GetTaxisAll');
  }
  getTax(id: number) {
    return this.http.get<ITaxEditOrCreate>(this.baseUrl + 'api/Taxis/'+id);
  }

  addNew(values: any) {
    return this.http.post(this.baseUrl + 'api/Taxis', values);
  }

  edit(id: number, values: any) {
    return this.http.put(this.baseUrl + 'api/Taxis/'+id, values);
  }

  remove(id: number) {
    return this.http.delete(this.baseUrl + 'api/Taxis/'+id);
  }

}
