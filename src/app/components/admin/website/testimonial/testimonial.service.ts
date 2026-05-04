import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {ITestimonial, ITestimonialEditOrCreate} from "../../../../shared/models/testimonial";

@Injectable({
  providedIn: 'root'
})
export class TestimonialService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getTestimonials() {
    return this.http.get<ITestimonial[]>(this.baseUrl + 'api/Testimonials?language='+localStorage.getItem('language'));
  }

  getTestimonial(id: number) {
    return this.http.get<ITestimonialEditOrCreate>(this.baseUrl + 'api/Testimonials/'+id);
  }

  addNew(values: any) {
    const formData = new FormData();

    formData.append('nameAr', values.nameAr);
    formData.append('nameEn', values.nameEn);

    formData.append('descriptionAr', values.descriptionAr);
    formData.append('descriptionEn', values.descriptionEn);

    formData.append('jobAr', values.jobAr);
    formData.append('jobEn', values.jobEn);

    formData.append("image", values.imageSource, values.imageSource.name);

    let headers = new HttpHeaders();

    headers.append('Content-Type', 'multipart/form-data');

    return this.http.post(this.baseUrl + 'api/Testimonials', formData, {headers: headers});
  }

  edit(id: number, values: any) {
    const formData = new FormData();

    formData.append('nameAr', values.nameAr);
    formData.append('nameEn', values.nameEn);

    formData.append('descriptionAr', values.descriptionAr);
    formData.append('descriptionEn', values.descriptionEn);

    formData.append('jobAr', values.jobAr);
    formData.append('jobEn', values.jobEn);

    if (values.imageSource) {
      formData.append("image", values.imageSource, values.imageSource.name);
    }

    let headers = new HttpHeaders();

    headers.append('Content-Type', 'multipart/form-data');

    return this.http.put(this.baseUrl + 'api/Testimonials/'+id, formData, {headers: headers});
  }

  remove(id: number) {
    return this.http.delete(this.baseUrl + 'api/Testimonials/'+id);
  }

}
