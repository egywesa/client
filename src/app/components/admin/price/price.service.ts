import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {IPrice, IPriceEditOrCreate} from "../../../shared/models/price";
import {IPayment, IPaymentOut} from "../../../shared/models/payment";
import { first, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PriceService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getPrices() {
    return this.http.get<IPrice[]>(this.baseUrl + 'api/Prices?language='+localStorage.getItem('language'));
  }

  getPricestak6() {
    return this.http.get<IPrice[]>(this.baseUrl + 'api/Prices?language='+localStorage.getItem('language')).pipe(take(6));
  }
  getPrice(id: number) {
    return this.http.get<IPriceEditOrCreate>(this.baseUrl + 'api/Prices/'+id);
  }

  getCurrentPrice() {
    return this.http.get<IPaymentOut>(this.baseUrl + 'api/Auth/GetCurrentPayment');
  }

  addNew(values: any) {
    return this.http.post(this.baseUrl + 'api/Prices', values);
  }

  edit(id: number, values: any) {
    return this.http.put(this.baseUrl + 'api/Prices/'+id, values);
  }

  remove(id: number) {
    return this.http.delete(this.baseUrl + 'api/Prices/'+id);
  }

}
