import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICountry } from 'src/app/shared/models/country';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) { }
  geCountry() {
    return this.http.get<ICountry[]>(this.baseUrl + 'api/Country?language='+localStorage.getItem('language'));
  }

}
