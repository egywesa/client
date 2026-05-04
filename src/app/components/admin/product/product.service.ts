import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {IProduct, IProductEditOrCreate} from "../../../shared/models/product";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getProducts() {
    return this.http.get<IProduct[]>(this.baseUrl + 'api/Products?language='+localStorage.getItem('language'));
  }

  getProduct(id: number) {
    return this.http.get<IProductEditOrCreate>(this.baseUrl + 'api/Products/'+id);
  }

  addNew(values: any) {
    return this.http.post(this.baseUrl + 'api/Products', values);
  }

  edit(id: number, values: any) {
    return this.http.put(this.baseUrl + 'api/Products/'+id, values);
  }

  remove(id: number) {
    return this.http.delete(this.baseUrl + 'api/Products/'+id);
  }
  exportInvoices(Ids: number[]) {
    return this.http.post(this.baseUrl + `api/Products/ExportProduct`, Ids);
  }
  import(formData: any) {
    return this.http.post(this.baseUrl + 'api/Products/ImportProductExcel', formData);
  }
}
