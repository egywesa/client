import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ISlider } from 'src/app/shared/models/slider';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class LandingpageService {

  constructor(private http: HttpClient) { }
  baseUrl = environment.baseUrl;

  
  getabout() {
    return this.http.get<any[]>(this.baseUrl + 'api/Abouts?language='+localStorage.getItem('language'));
  }

  getSliders() {
    return this.http.get<ISlider[]>(this.baseUrl + 'api/Sliders?language='+localStorage.getItem('language'));
  }
}
