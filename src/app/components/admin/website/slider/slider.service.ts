import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {ISlider, ISliderEditOrCreate} from "../../../../shared/models/slider";

@Injectable({
  providedIn: 'root'
})
export class SliderService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getSliders() {
    return this.http.get<ISlider[]>(this.baseUrl + 'api/Sliders?language='+localStorage.getItem('language'));
  }

  getSlider(id: number) {
    return this.http.get<ISliderEditOrCreate>(this.baseUrl + 'api/Sliders/'+id);
  }

  addNew(values: any) {
    const formData = new FormData();

    formData.append('titleAr', values.titleAr);
    formData.append('titleEn', values.titleEn);

    formData.append('descriptionAr', values.descriptionAr);
    formData.append('descriptionEn', values.descriptionEn);

    formData.append("image", values.imageSource, values.imageSource.name);

    let headers = new HttpHeaders();

    headers.append('Content-Type', 'multipart/form-data');

    return this.http.post(this.baseUrl + 'api/Sliders', formData, {headers: headers});
  }

  edit(id: number, values: any) {
    const formData = new FormData();

    formData.append('titleAr', values.titleAr);
    formData.append('titleEn', values.titleEn);

    formData.append('descriptionAr', values.descriptionAr);
    formData.append('descriptionEn', values.descriptionEn);

    if (values.imageSource) {
      formData.append("image", values.imageSource, values.imageSource.name);
    }

    let headers = new HttpHeaders();

    headers.append('Content-Type', 'multipart/form-data');

    return this.http.put(this.baseUrl + 'api/Sliders/'+id, formData, {headers: headers});
  }

  remove(id: number) {
    return this.http.delete(this.baseUrl + 'api/Sliders/'+id);
  }

}
