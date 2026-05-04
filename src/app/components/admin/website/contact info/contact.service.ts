import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getContacts() {
    return this.http.get<any[]>(this.baseUrl + 'api/Contacts?language='+localStorage.getItem('language'));
  }

  getContact(id: number) {
    return this.http.get<any>(this.baseUrl + 'api/Contacts/'+id);
  }

  addNew(values: any) {
    console.log(values)

    let headers = new HttpHeaders();

    headers.append('Content-Type', 'application/json');
    headers.append('accept', 'text/plain');

    return this.http.post(this.baseUrl + 'api/Contacts', values, {headers: headers});
  }

  edit(id: number, values: any) {

    let headers = new HttpHeaders();

    headers.append('Content-Type', 'application/json');
    headers.append('accept', 'text/plain');

    return this.http.put(this.baseUrl + 'api/Contacts/'+id, values, {headers: headers});
  }

  remove(id: number) {
    return this.http.delete(this.baseUrl + 'api/Contacts/'+id);
  }
}
