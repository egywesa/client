import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {IStep, IStepEditOrCreate} from "../../../../shared/models/step";

@Injectable({
  providedIn: 'root'
})
export class StepService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getSteps() {
    return this.http.get<IStep[]>(this.baseUrl + 'api/Steps?language='+localStorage.getItem('language'));
  }

  getStep(id: number) {
    return this.http.get<IStepEditOrCreate>(this.baseUrl + 'api/Steps/'+id);
  }

  addNew(values: any) {
    const formData = new FormData();

    formData.append('titleAr', values.titleAr);
    formData.append('titleEn', values.titleEn);

    formData.append('descriptionAr', values.descriptionAr);
    formData.append('descriptionEn', values.descriptionEn);

    formData.append('nameAr', values.nameAr);
    formData.append('nameEn', values.nameEn);

    formData.append('icon', values.icon);

    formData.append("image", values.imageSource, values.imageSource.name);

    let headers = new HttpHeaders();

    headers.append('Content-Type', 'multipart/form-data');

    return this.http.post(this.baseUrl + 'api/Steps', formData, {headers: headers});
  }

  edit(id: number, values: any) {
    const formData = new FormData();

    formData.append('titleAr', values.titleAr);
    formData.append('titleEn', values.titleEn);

    formData.append('descriptionAr', values.descriptionAr);
    formData.append('descriptionEn', values.descriptionEn);

    formData.append('nameAr', values.nameAr);
    formData.append('nameEn', values.nameEn);

    formData.append('icon', values.icon);

    if (values.imageSource) {
      formData.append("image", values.imageSource, values.imageSource.name);
    }

    let headers = new HttpHeaders();

    headers.append('Content-Type', 'multipart/form-data');

    return this.http.put(this.baseUrl + 'api/Steps/'+id, formData, {headers: headers});
  }

  remove(id: number) {
    return this.http.delete(this.baseUrl + 'api/Steps/'+id);
  }

}
