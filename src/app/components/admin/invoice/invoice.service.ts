import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {ExportInvoicesRequest, IInvoice, IInvoiceEditOrCreate, IInvoiceNotification, Invoice, QrCodeResponse} from "../../../shared/models/invoice";
import {mergeMap, Observable, of, retry} from "rxjs";
import {DataTable} from "../../../shared/models/dataTable";
import {Data} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getInvoices(values: any): Promise<DataTable<Invoice>> {
    const formData = new FormData();

    formData.append('length', values.length);
    formData.append('start', values.start);
    formData.append('search[value]', values.search['value']);
    formData.append('order[0][dir]', values.order[0]['dir']);

    if (values.searchId) {
      formData.append('searchId', values.searchId);
    }

    if (values.searchClientId) {
      formData.append('searchClientId', values.searchClientId);
    }

    if (values.searchInvoiceType) {
      formData.append('searchInvoiceType', values.searchInvoiceType);
    }
    if (values.searchInvoiceFatora) {
      formData.append('searchInvoiceFatora', values.searchInvoiceFatora);
    }

    if (values.searchShortOrLong) {
      formData.append('searchShortOrLong', values.searchShortOrLong);
    }

    if (values.searchTotal) {
      formData.append('searchTotal', values.searchTotal);
    }
    if (values.searchedDate1) {
      formData.append('searchedDate1', values.searchedDate1);
    }
    if (values.searchedDate2) {
      formData.append('searchedDate2', values.searchedDate2);
    }


    let headers = new HttpHeaders();

    headers.append('Content-Type', 'application/json; charset=utf-8');

    return this.http.post<DataTable<Invoice>>(this.baseUrl + 'api/Invoices/GetInvoices', formData, {headers: headers})
      .pipe(
        retry(1)
      ).toPromise();
  }

  getInvoice(id: number) {
    return this.http.get<Invoice>(this.baseUrl + 'api/Invoices/'+id);
  }
  getInvoicelang(id: number) {
    return this.http.get<Invoice>(this.baseUrl + 'api/Invoices/updateGetInvoice/'+id+'?language='+localStorage.getItem('language'));
  }

  addNew(values: any) {
    return this.http.post(this.baseUrl + 'api/Invoices', values);
  }

  import(formData: any) {
    return this.http.post(this.baseUrl + 'api/Invoices/ImportExcel', formData);
  }

  downloadInvoice(id: number) {
    return this.http.get<any>(this.baseUrl + 'api/Pdf/DownloadInvoicePDF/'+id);
  }

  verifyZatca(invoiceId: number) {
    return this.http.get(this.baseUrl + 'api/SandBoxApi/ClearInvoice?invoiceId='+invoiceId, {});
  }

  verifyNotificationZatca(invoiceId: number) {
    return this.http.get(this.baseUrl + 'api/SandBoxApi/ClearNotification?invoiceId='+invoiceId, {});
  }

  saveInvoiceNotification(values: any) {
    return this.http.post(this.baseUrl + 'api/InvoiceNotifications', values);
  }

  edit(id: number, values: any) {
    return this.http.put(this.baseUrl + 'api/Invoices/'+id, values);
  }

  editNotification(id: number, values: any) {
    return this.http.put(this.baseUrl + 'api/InvoiceNotifications/'+id, values);
  }

  remove(id: number) {
    return this.http.delete(this.baseUrl + 'api/Invoices/'+id);
  }
  AllowAditeDate(){


    return this.http.get<Invoice>(this.baseUrl + 'api/Invoices/AllowAditeDate');
  }


  getInvoiceWithNotification(id: number) {
    return this.http.get<Invoice>(this.baseUrl + 'api/InvoiceNotifications/'+id);
  }
  removeInvoiceWithNotification(id: number) {
    return this.http.delete<Invoice>(this.baseUrl + 'api/InvoiceNotifications/'+id);
  }

  InvoiceZipBydate(d1: any,d2:any) {
    return this.http.get(this.baseUrl +`api/Pdf/PdfGetInvoices?d1=${d1}&d2=${d2}`);
  }

  getInvoiceNotifications(id: number) {
    return this.http.get<IInvoiceNotification[]>(this.baseUrl + 'api/InvoiceNotifications/GetInvoiceNotifications/'+id);
  }

  addNotificationNew(values: any) {
    return this.http.post(this.baseUrl + 'api/InvoiceNotifications', values);
  }

    generateQrCode(seller: string, vat: string, time: string, vatamount: string, amount: string) {
      return this.http.get(this.baseUrl + `api/Invoices/GenerateQrCode?sellername=${seller}
        &vatregistration=${vat}&timestamp=${time}&invoiceamount=${amount}&vatamoun=${vatamount}`);
    }



    convertTLV(tagnums: string, tagvalue: string): Uint8Array {
      const tagnum = Uint8Array.from([parseInt(tagnums, 10)]);
      const tagvalueb = new TextEncoder().encode(tagvalue);
      const taglengths = [tagvalueb.length.toString()];
      const tagvaluelengths = Uint8Array.from(taglengths.map((s) => parseInt(s, 10)));
      const tlvValue = Uint8Array.from([...tagnum, ...tagvaluelengths, ...tagvalueb]);

      return tlvValue;
    }

exportInvoices(request: ExportInvoicesRequest): Observable<any> {
  return this.http.post(`${this.baseUrl}api/Invoices/ExportInvoices`, request);
} 
  ExportInvoicesIds(invoicesIds: number[], num:number) {
    return this.http.post(this.baseUrl + `api/Invoices/ExportInvoicesIds?n=${num}`, invoicesIds);
  }

  getInvoicedesign() {
    return this.http.get<IInvoiceNotification[]>(this.baseUrl + 'api/Companies/GetRecommendedSample');
  }
  convertInvoice(id: number) {
    return this.http.put(this.baseUrl +'api/Invoices/ConvertToInvoice?id='+id,'');
  }
  InvoiceSerchdate(d1: any,d2:any) {
    return this.http.get(this.baseUrl +`api/Invoices/GetExcelInvoices?d1=${d1}&d2=${d2}`).pipe(
      retry(1)
    ).toPromise();
  }
  InvoiceSerchdateForCompany(d1: any,d2:any,id:number) {
    return this.http.get(this.baseUrl +`api/Invoices/GetExcelInvoicesForCompany?d1=${d1}&d2=${d2}&CompanyId=${id}`);
  }
  InvoicedownloaddateForCompany(d1: any,d2:any,id:number) {
    return this.http.get(this.baseUrl +`api/Pdf/CompressInvoicesPDF?d1=${d1}&d2=${d2}&CompanyId=${id}`);
  }

}
