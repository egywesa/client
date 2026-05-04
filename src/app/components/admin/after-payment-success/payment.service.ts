import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { DataTable } from "../../../shared/models/dataTable";
import { retry } from "rxjs";
import * as QueryString from "querystring";
import { IBank } from "../../../shared/models/bank";
import { IPayment, IPaymentWithUser } from "../../../shared/models/payment";
import { data } from 'jquery';
import { IInvoice } from 'src/app/shared/models/invoice';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getPayments(values: any) {
    const formData = new FormData();

    formData.append('length', values.length);
    formData.append('start', values.start);

    let headers = new HttpHeaders();

    headers.append('Content-Type', 'application/json; charset=utf-8');

    return this.http.post<DataTable<IPaymentWithUser>>(this.baseUrl +
      'api/Payment/GetPayments?language=' + localStorage.getItem('language'), formData, { headers: headers })
      .pipe(
        retry(1)
      ).toPromise();
  }
  getPaymentInvoices(values: any) {
    const formData = new FormData();

    formData.append('length', values.length);
    formData.append('start', values.start);

    let headers = new HttpHeaders();

    headers.append('Content-Type', 'application/json; charset=utf-8');

    return this.http.post<DataTable<IInvoice>>(this.baseUrl +
      'api/Payment/GetClientInvoices',formData)
      .pipe(
        retry(1)
      ).toPromise();
  }

  redirectToPaymentForm(amount: number) {
    return this.http.get(`${this.baseUrl}api/Payment/GeneratePayment?amount=${amount}`);
  }

  checkIfPaymentSuccess(tranid: string, amount: string, trackid: string) {

    const formData = new FormData();

    formData.append('tranid', tranid);
    formData.append('amount', amount);
    formData.append('trackid', trackid);

    let headers = new HttpHeaders();

    headers.append('Content-Type', 'application/json; charset=utf-8');

    var xx = this.http.post(`${this.baseUrl}api/Payment/AfterSuccessPayment`, formData, { headers: headers });

    return xx;
  }

}
