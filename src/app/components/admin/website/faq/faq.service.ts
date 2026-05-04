import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {IFaq, IFaqEditOrCreate} from "../../../../shared/models/faq";

@Injectable({
  providedIn: 'root'
})
export class FaqService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getFaqs() {
    return this.http.get<IFaq[]>(this.baseUrl + 'api/Faqs?language='+localStorage.getItem('language'));
  }

  getFaq(id: number) {
    return this.http.get<IFaqEditOrCreate>(this.baseUrl + 'api/Faqs/'+id);
  }

  addNew(values: any) {

    return this.http.post(this.baseUrl + 'api/Faqs', values);
  }

  edit(id: number, values: any) {

    return this.http.put(this.baseUrl + 'api/Faqs/'+id, values);
  }

  remove(id: number) {
    return this.http.delete(this.baseUrl + 'api/Faqs/'+id);
  }

}
