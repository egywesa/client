import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {ICity, ICityEditOrCreate} from "../../../shared/models/city";

@Injectable({
  providedIn: 'root'
})
export class CityService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getCities() {
    return this.http.get<ICity[]>(this.baseUrl + 'api/Cities?language='+localStorage.getItem('language'));
  }

  getCity(id: number) {
    return this.http.get<ICityEditOrCreate>(this.baseUrl + 'api/Cities/'+id);
  }

  addNew(values: any) {
    return this.http.post(this.baseUrl + 'api/Cities', values);
  }

  edit(id: number, values: any) {
    return this.http.put(this.baseUrl + 'api/Cities/'+id, values);
  }

  remove(id: number) {
    return this.http.delete(this.baseUrl + 'api/Cities/'+id);
  }

}
